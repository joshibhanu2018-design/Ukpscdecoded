# Step 4: add pictures, titles, name cards, music and sounds from work\overlays.csv
# on top of work\main_clean.mp4. Result: export\VIDEO1_final.mp4
#   Test first 3 minutes:  powershell -ExecutionPolicy Bypass -File video-edit\4_render.ps1 -Preview
param([switch]$Preview)
. "$PSScriptRoot\common.ps1"
Assert-FFmpeg

$MusicVolume = 0.18   # background music level (0.1 quieter, 0.3 louder)

$main = Join-Path $Work 'main_clean.mp4'
if (-not (Test-Path $main)) { throw 'work\main_clean.mp4 missing. Run step 3 first.' }
$txtDir = Join-Path $Work 'txt'
New-Item -ItemType Directory -Force $txtDir | Out-Null
Copy-Item "$env:WINDIR\Fonts\arialbd.ttf" (Join-Path $Work 'font.ttf') -Force

$inputs = @('-i', 'main_clean.mp4')
$idx = 1
$v = '[0:v]'
$g = @()
$musicOff = @()
$sounds = @()
$n = 0

function Add-Image([string]$file, [double]$s, [double]$d, [string]$scale) {
  $script:inputs += @('-loop', '1', '-framerate', '30', '-t', (F $d), '-i', $file)
  $script:g += "[$($script:idx):v]$scale,format=yuva420p,fade=t=in:st=0:d=0.3:alpha=1," +
    "fade=t=out:st=$(F ([math]::Max(0, $d - 0.3))):d=0.3:alpha=1,setpts=PTS-STARTPTS+$(F $s)/TB[img$($script:n)]"
  $script:idx++
  return "[img$($script:n)]"
}

function Text-File([string]$text) {
  $p = "txt/$($script:n).txt"
  [IO.File]::WriteAllText((Join-Path $Work $p), ($text -replace '\|', "`n"), $Utf8)
  return "fontfile=font.ttf:textfile=$($p):expansion=none"
}

foreach ($r in Import-Csv (Join-Path $Work 'overlays.csv')) {
  $s = To-Sec $r.start
  if ($null -eq $s) { continue }
  $e = To-Sec $r.end
  if ($null -eq $e) { $e = $s + 4 }
  $d = $e - $s
  $n++
  $en = "enable='between(t,$(F $s),$(F $e))'"
  switch ($r.type.Trim().ToLower()) {
    'full' {
      $img = Add-Image (Find-Asset $r.asset) $s $d 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black'
      $g += "$v$($img)overlay=x=0:y=0:eof_action=pass:$en[v$n]"
    }
    'corner' {
      $img = Add-Image (Find-Asset $r.asset) $s $d 'scale=640:400:force_original_aspect_ratio=decrease'
      $g += "$v$($img)overlay=x=W-w-40:y=40:eof_action=pass:$en[v$n]"
    }
    'card' {
      $logo = if ($r.asset) { $r.asset } else { 'LOGO' }
      $img = Add-Image (Find-Asset $logo) $s $d 'scale=160:160:force_original_aspect_ratio=decrease'
      $t = if ($r.text) { $r.text } else { 'Link in description' }
      $g += "$v$($img)overlay=x=40:y=H-h-40:eof_action=pass:$en,drawtext=$(Text-File $t):fontsize=42:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=14:x=220:y=h-150:$en[v$n]"
    }
    'title' {
      $g += "$($v)drawbox=x=0:y=0:w=iw:h=ih:color=black:t=fill:$en,drawtext=$(Text-File $r.text):fontsize=110:fontcolor=white:line_spacing=20:x=(w-tw)/2:y=(h-th)/2:$en[v$n]"
    }
    'text' {
      $g += "$($v)drawtext=$(Text-File $r.text):fontsize=58:fontcolor=yellow:box=1:boxcolor=black@0.65:boxborderw=22:line_spacing=12:x=(w-tw)/2:y=h-th-110:$en[v$n]"
    }
    'lowerthird' {
      $g += "$($v)drawtext=$(Text-File $r.text):fontsize=44:fontcolor=white:box=1:boxcolor=0x0B3D91@0.9:boxborderw=18:line_spacing=10:x=60:y=h-th-170:$en[v$n]"
    }
    'zoom' {
      # punch-in: crop the middle and blow it up (hides jump cuts)
      $g += "$($v)split[za$n][zb$n];[zb$n]crop=iw/1.12:ih/1.12,scale=1920:1080[zc$n];[za$n][zc$n]overlay=0:0:$en[v$n]"
    }
    'musicoff' { $musicOff += "between(t,$(F $s),$(F $e))"; continue }
    'sound' { $sounds += , @((Find-Asset $r.asset), $s); continue }
    default { throw "Unknown type '$($r.type)' in overlays.csv (row starting $($r.start))" }
  }
  $v = "[v$n]"
}

# ---- audio ----
$g += '[0:a]highpass=f=80,afftdn=nf=-25,aformat=sample_rates=48000:channel_layouts=stereo[voice]'
$mix = @()
$track = Get-ChildItem $Music -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in '.mp3', '.wav', '.m4a' -and $_.BaseName -notmatch '^(sfx|win)' } |
  Sort-Object Name | Select-Object -First 1
if ($track) {
  Write-Host "Music: $($track.Name)"
  $inputs += @('-stream_loop', '-1', '-i', $track.FullName)
  $off = if ($musicOff.Count) { ",volume=0:enable='" + ($musicOff -join '+') + "'" } else { '' }
  $g += '[voice]asplit=2[vo][sc]'
  $g += "[$($idx):a]aformat=sample_rates=48000:channel_layouts=stereo,volume=$MusicVolume$off[mu]"
  $g += '[mu][sc]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=600[duck]'
  $mix += '[vo]', '[duck]'
  $idx++
} else {
  Write-Host 'No music found in music\ - rendering without music.' -ForegroundColor Yellow
  $mix += '[voice]'
}
foreach ($snd in $sounds) {
  $inputs += @('-i', $snd[0])
  $ms = [math]::Round($snd[1] * 1000)
  $g += "[$($idx):a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=$($ms):all=1[s$idx]"
  $mix += "[s$idx]"
  $idx++
}
$g += ($mix -join '') + "amix=inputs=$($mix.Count):duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[aout]"

[IO.File]::WriteAllText((Join-Path $Work 'render_filter.txt'), ($g -join ";`n"), $Utf8)

$outName = if ($Preview) { 'VIDEO1_preview.mp4' } else { 'VIDEO1_final.mp4' }
$out = Join-Path $Export $outName
$args2 = $inputs + @('-/filter_complex', 'render_filter.txt', '-map', $v, '-map', '[aout]')
if ($v -eq '[0:v]') { $args2 = $inputs + @('-/filter_complex', 'render_filter.txt', '-map', '0:v', '-map', '[aout]') }
if ($Preview) { $args2 += @('-t', '180') }
$args2 += @('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', $out)

Write-Host "Rendering $outName (full video can take several hours; leave the laptop plugged in)" -ForegroundColor Cyan
Push-Location $Work
try { Invoke-FF $args2 } finally { Pop-Location }
Write-Host "Done: export\$outName" -ForegroundColor Green

# Step 2: shrink the 4K clips to 1080p, join them (1514 -> 1515 -> 1516)
# and cut out the pauses. Result: work\main_cut.mp4. Takes a few hours.
. "$PSScriptRoot\common.ps1"
Assert-FFmpeg

# Pause cutting. Raise $NoiseDb (e.g. -30) if the room is noisy and pauses are not cut.
$NoiseDb    = -35    # quieter than this counts as silence
$MinSilence = 0.8    # only pauses longer than this (seconds) are cut
$KeepPad    = 0.25   # seconds of pause kept on each side so speech doesn't sound clipped

$clips = Get-ChildItem $Raw -File | Where-Object { $_.Extension -in '.mov', '.mp4', '.m4v' } | Sort-Object Name
if ($clips.Count -eq 0) { throw 'No clips in raw\' }
Write-Host ('Order: ' + (($clips | ForEach-Object Name) -join ' -> '))

$list = @()
$i = 0
foreach ($c in $clips) {
  $i++
  $proxy = Join-Path $Work "clip_$i.mp4"
  $list += "file 'clip_$i.mp4'"
  if (Test-Path $proxy) { Write-Host "Already done: $($c.Name)"; continue }
  Write-Host "`n[$i/$($clips.Count)] Converting $($c.Name) (slow; leave it running)" -ForegroundColor Cyan

  $trc = (& ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of default=nw=1:nk=1 $c.FullName) -join ''
  $fit = 'scale=1920:1080:force_original_aspect_ratio=decrease'
  $pad = 'pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1'
  if ($trc -match 'arib-std-b67|smpte2084') {
    # iPhone HDR -> normal colours, otherwise YouTube shows it grey and washed out
    $vf = "$fit,zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,$pad"
  } else {
    $vf = "$fit,format=yuv420p,$pad"
  }
  $tmp = "$proxy.part.mp4"
  Invoke-FF @('-hwaccel', 'auto', '-i', $c.FullName, '-map', '0:v:0', '-map', '0:a:0', '-vf', $vf,
    '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-g', '30',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', $tmp)
  Move-Item $tmp $proxy -Force
}

Push-Location $Work
try {
  [IO.File]::WriteAllText((Join-Path $Work 'concat.txt'), ($list -join "`n"), $Utf8)
  Invoke-FF @('-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'joined.mp4')
} finally { Pop-Location }
$joined = Join-Path $Work 'joined.mp4'

Write-Host "`nFinding pauses..." -ForegroundColor Cyan
$log = Join-Path $Work 'silence.log'
cmd /c "ffmpeg -hide_banner -nostats -i `"$joined`" -vn -af silencedetect=noise=${NoiseDb}dB:d=$MinSilence -f null - 2> `"$log`""
$ranges = @()
$start = $null
foreach ($line in Get-Content $log) {
  if ($line -match 'silence_start: (-?[\d.]+)') { $start = [double]::Parse($Matches[1], $Inv) }
  elseif ($line -match 'silence_end: ([\d.]+)' -and $null -ne $start) {
    $a = [math]::Max(0, $start) + $KeepPad
    $b = [double]::Parse($Matches[1], $Inv) - $KeepPad
    if ($b - $a -gt 0.2) { $ranges += , @($a, $b) }
    $start = $null
  }
}
Write-Host "Cutting $($ranges.Count) pauses..." -ForegroundColor Cyan
$cut = Join-Path $Work 'main_cut.mp4'
Remove-Ranges $joined $cut $ranges

Write-Host ("`nDone. Before: {0}   After: {1}" -f (Show-Min (Get-Duration $joined)), (Show-Min (Get-Duration $cut))) -ForegroundColor Green
Write-Host 'Next: watch work\main_cut.mp4 in VLC and write bad takes into work\remove_takes.csv'

# Shared settings and helpers. Dot-sourced by the numbered scripts.
$ErrorActionPreference = 'Stop'
$Root   = Split-Path $PSScriptRoot -Parent
$Raw    = Join-Path $Root 'raw'
$Assets = Join-Path $Root 'ASSETS'
$Music  = Join-Path $Root 'music'
$Work   = Join-Path $Root 'work'
$Export = Join-Path $Root 'export'
New-Item -ItemType Directory -Force $Work, $Export | Out-Null
$Utf8 = New-Object System.Text.UTF8Encoding($false)
$Inv  = [Globalization.CultureInfo]::InvariantCulture

# FFmpeg downloaded by 1_setup.ps1 lives here; use it if present.
$FFBin = Join-Path $Root 'tools\ffmpeg\bin'
if (Test-Path (Join-Path $FFBin 'ffmpeg.exe')) { $env:PATH = "$FFBin;$env:PATH" }

function Assert-FFmpeg {
  if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    throw 'FFmpeg not found. Run video-edit\1_setup.ps1 first.'
  }
}

function Invoke-FF([string[]]$FFArgs) {
  & ffmpeg -hide_banner -y @FFArgs
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed (exit $LASTEXITCODE). Scroll up for the error." }
}

# "1:23", "01:02:03" or "83.5" -> seconds
function To-Sec([string]$s) {
  if ($null -eq $s) { return $null }
  $s = $s.Trim()
  if ($s -eq '') { return $null }
  $t = 0.0
  foreach ($x in $s.Split(':')) { $t = $t * 60 + [double]::Parse($x, $Inv) }
  return $t
}

function F([double]$x) { $x.ToString('0.###', $Inv) }

function Get-Duration([string]$file) {
  $d = & ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 $file
  return [double]::Parse($d.Trim(), $Inv)
}

function Show-Min([double]$sec) { '{0}m {1}s' -f [math]::Floor($sec / 60), [math]::Round($sec % 60) }

# Find a file by the name Explorer shows (extension optional).
function Find-Asset([string]$name) {
  foreach ($dir in @($Assets, $Music)) {
    if (-not (Test-Path $dir)) { continue }
    $hit = Get-ChildItem $dir -File | Where-Object {
      $_.Name -ieq $name -or $_.BaseName -ieq $name -or
      [IO.Path]::GetFileNameWithoutExtension($_.BaseName) -ieq $name
    } | Select-Object -First 1
    if ($hit) { return $hit.FullName }
  }
  throw "Asset not found: '$name' (looked in ASSETS\ and music\)"
}

# Re-encode $in to $out, leaving out the given [start,end] ranges (seconds, sorted).
# Works in batches so a long video with thousands of pauses doesn't run out of memory.
function Remove-Ranges([string]$in, [string]$out, $ranges) {
  if (-not $ranges -or $ranges.Count -eq 0) { Copy-Item $in $out -Force; return }
  $batch = 40
  $parts = @()
  $nb = [math]::Ceiling($ranges.Count / $batch)
  for ($b = 0; $b -lt $nb; $b++) {
    $from = if ($b -eq 0) { 0.0 } else { $ranges[$b * $batch][0] }
    $last = [math]::Min($ranges.Count, ($b + 1) * $batch) - 1
    $to   = if ($b -lt $nb - 1) { $ranges[($b + 1) * $batch][0] } else { $null }
    $mine = @($ranges[($b * $batch)..$last] | ForEach-Object { , @(($_[0] - $from), ($_[1] - $from)) })
    $expr = ($mine | ForEach-Object { "between(t,$(F $_[0]),$(F $_[1]))" }) -join '+'
    $graph = "[0:v]select='not($expr)',setpts=N/FRAME_RATE/TB[v];" +
             "[0:a]aselect='not($expr)',asetpts=N/SR/TB[a]"
    $script = Join-Path $Work 'cut_filter.txt'
    [IO.File]::WriteAllText($script, $graph, $Utf8)
    $part = Join-Path $Work ('part_{0:D4}.mp4' -f $b)
    Write-Host ("Part {0} of {1}" -f ($b + 1), $nb) -ForegroundColor Cyan
    $a = @('-ss', (F $from))
    if ($null -ne $to) { $a += @('-to', (F $to)) }
    $a += @('-i', $in, '-/filter_complex', $script, '-map', '[v]', '-map', '[a]',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-g', '30', '-r', '30',
      '-c:a', 'pcm_s16le', ($part -replace '\.mp4$', '.mov'))
    Invoke-FF $a
    $parts += "file '$(Split-Path ($part -replace '\.mp4$', '.mov') -Leaf)'"
  }
  $list = Join-Path $Work 'parts.txt'
  [IO.File]::WriteAllText($list, ($parts -join "`n"), $Utf8)
  Invoke-FF @('-f', 'concat', '-safe', '0', '-i', $list, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', $out)
  Get-ChildItem $Work -Filter 'part_*.mov' | Remove-Item -Force
}

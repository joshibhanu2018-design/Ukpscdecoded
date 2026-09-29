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

function Assert-FFmpeg {
  if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    throw 'FFmpeg not found. Run 1_setup.ps1, then close and reopen PowerShell.'
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

# Re-encode $in to $out, leaving out the given [start,end] ranges (seconds).
function Remove-Ranges([string]$in, [string]$out, $ranges) {
  if (-not $ranges -or $ranges.Count -eq 0) { Copy-Item $in $out -Force; return }
  $expr = ($ranges | ForEach-Object { "between(t,$(F $_[0]),$(F $_[1]))" }) -join '+'
  $graph = "[0:v]select='not($expr)',setpts=N/FRAME_RATE/TB[v];" +
           "[0:a]aselect='not($expr)',asetpts=N/SR/TB[a]"
  $script = Join-Path $Work 'cut_filter.txt'
  [IO.File]::WriteAllText($script, $graph, $Utf8)
  Invoke-FF @('-i', $in, '-/filter_complex', $script, '-map', '[v]', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-g', '30', '-r', '30',
    '-c:a', 'aac', '-b:a', '192k', $out)
}

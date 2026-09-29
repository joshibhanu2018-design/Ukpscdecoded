# Step 1: install FFmpeg (once) and create the folders.
. "$PSScriptRoot\common.ps1"

if (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
  Write-Host 'FFmpeg is ready.' -ForegroundColor Green
} else {
  # Download FFmpeg (about 200 MB) into tools\ffmpeg - no installer needed.
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $tools = Join-Path $Root 'tools'
  New-Item -ItemType Directory -Force $tools | Out-Null
  $zip = Join-Path $tools 'ffmpeg.zip'
  Write-Host 'Downloading FFmpeg (about 200 MB, a few minutes)...' -ForegroundColor Cyan
  $ProgressPreference = 'SilentlyContinue'
  Invoke-WebRequest 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-full.zip' -OutFile $zip -UseBasicParsing
  Write-Host 'Unzipping...' -ForegroundColor Cyan
  $tmp = Join-Path $tools 'unzip'
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  Expand-Archive $zip $tmp -Force
  $inner = Get-ChildItem $tmp -Directory | Select-Object -First 1
  $dest = Join-Path $tools 'ffmpeg'
  if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
  Move-Item $inner.FullName $dest
  Remove-Item $tmp -Recurse -Force
  Remove-Item $zip -Force
  $env:PATH = "$FFBin;$env:PATH"
  & ffmpeg -version | Select-Object -First 1
  Write-Host 'FFmpeg is ready.' -ForegroundColor Green
}

New-Item -ItemType Directory -Force $Raw, $Music | Out-Null
$ov = Join-Path $Work 'overlays.csv'
if (-not (Test-Path $ov)) { Copy-Item (Join-Path $PSScriptRoot 'overlays_template.csv') $ov }
$rt = Join-Path $Work 'remove_takes.csv'
if (-not (Test-Path $rt)) { [IO.File]::WriteAllText($rt, "start,end,note`r`n", $Utf8) }

Write-Host "`nClips in raw\:"; Get-ChildItem $Raw -File | ForEach-Object { '  ' + $_.Name }
Write-Host "Music in music\:"; Get-ChildItem $Music -File | ForEach-Object { '  ' + $_.Name }

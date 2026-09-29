# Step 1: install FFmpeg (once) and create the folders.
. "$PSScriptRoot\common.ps1"

if (Get-Command ffmpeg -ErrorAction SilentlyContinue) {
  Write-Host 'FFmpeg is already installed.' -ForegroundColor Green
} else {
  winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
  Write-Host 'FFmpeg installed. CLOSE this PowerShell window and open a new one before step 2.' -ForegroundColor Yellow
}

New-Item -ItemType Directory -Force $Raw, $Music | Out-Null
$ov = Join-Path $Work 'overlays.csv'
if (-not (Test-Path $ov)) { Copy-Item (Join-Path $PSScriptRoot 'overlays_template.csv') $ov }
$rt = Join-Path $Work 'remove_takes.csv'
if (-not (Test-Path $rt)) { [IO.File]::WriteAllText($rt, "start,end,note`r`n", $Utf8) }

Write-Host "`nClips in raw\:"; Get-ChildItem $Raw -File | ForEach-Object { '  ' + $_.Name }
Write-Host "Music in music\:"; Get-ChildItem $Music -File | ForEach-Object { '  ' + $_.Name }

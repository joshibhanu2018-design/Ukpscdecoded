# Step 2b: write out everything said in work\main_cut.mp4, with times, using the free
# Whisper speech-to-text AI (runs on the laptop, no internet needed after the first download).
# Result: work\transcript.srt - send it to Claude to get remove_takes.csv made for you.
. "$PSScriptRoot\common.ps1"
Assert-FFmpeg

$Model = 'small'   # 'base' = faster but more mistakes, 'small' = good balance

$cut = Join-Path $Work 'main_cut.mp4'
if (-not (Test-Path $cut)) { throw 'work\main_cut.mp4 missing. Finish step 2 first.' }

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'
$wdir = Join-Path $Root 'tools\whisper'
New-Item -ItemType Directory -Force $wdir | Out-Null

function Get-File($urls, $dest, $what, $manual) {
  if (Test-Path $dest) { return }
  Write-Host "Downloading $what..." -ForegroundColor Cyan
  foreach ($u in $urls) {
    try { Invoke-WebRequest $u -OutFile "$dest.part" -UseBasicParsing; Move-Item "$dest.part" $dest -Force; return }
    catch { Write-Host "  could not get $u" -ForegroundColor Yellow }
  }
  throw "Download of $what failed. $manual"
}

# 1. the Whisper program
$exe = Get-ChildItem $wdir -Recurse -Include 'whisper-cli.exe', 'main.exe' -ErrorAction SilentlyContinue |
  Sort-Object { $_.Name -ne 'whisper-cli.exe' } | Select-Object -First 1
if (-not $exe) {
  # Use a zip the owner downloaded by hand (any name, in tools\whisper or tools), else download.
  $zip = Get-ChildItem $wdir, (Join-Path $Root 'tools') -Filter '*.zip' -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match 'whisper' -or $_.DirectoryName -eq $wdir } | Select-Object -First 1
  $zip = if ($zip) { $zip.FullName } else { Join-Path $wdir 'whisper.zip' }
  Get-File @(
    'https://github.com/ggml-org/whisper.cpp/releases/latest/download/whisper-bin-x64.zip',
    'https://github.com/ggerganov/whisper.cpp/releases/latest/download/whisper-bin-x64.zip'
  ) $zip 'Whisper program' ("Open https://github.com/ggml-org/whisper.cpp/releases in the browser, " +
    "download whisper-bin-x64.zip and save it as $zip, then run this step again.")
  Expand-Archive $zip $wdir -Force
  $exe = Get-ChildItem $wdir -Recurse -Include 'whisper-cli.exe', 'main.exe' |
    Sort-Object { $_.Name -ne 'whisper-cli.exe' } | Select-Object -First 1
  if (-not $exe) { throw 'whisper-cli.exe not found inside the download.' }
}

# 2. the AI model
$modelFile = Join-Path $wdir "ggml-$Model.bin"
Get-File @("https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-$Model.bin") $modelFile "AI model ($Model, a few hundred MB)" `
  ("Open https://huggingface.co/ggerganov/whisper.cpp/tree/main in the browser, download ggml-$Model.bin " +
   "and save it as $modelFile, then run this step again.")

# 3. audio only, the format Whisper wants
$wav = Join-Path $Work 'main_cut_16k.wav'
if (-not (Test-Path $wav)) {
  Write-Host 'Taking out the audio...' -ForegroundColor Cyan
  Invoke-FF @('-i', $cut, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', $wav)
}

# 4. transcribe
$threads = [Math]::Max(1, [Environment]::ProcessorCount)
Write-Host "Transcribing (a few hours for a long video; leave it running)..." -ForegroundColor Cyan
# -mc 0: stops Whisper repeating one sentence forever; -bs 1 -bo 1: fast mode for a slow laptop
& $exe.FullName -m $modelFile -f $wav -l hi -t $threads -mc 0 -bs 1 -bo 1 -osrt -of (Join-Path $Work 'transcript') -pp
if ($LASTEXITCODE -ne 0) { throw "Whisper failed (exit $LASTEXITCODE). Scroll up for the error." }
Write-Host 'Done: work\transcript.srt - attach it in the chat with Claude.' -ForegroundColor Green

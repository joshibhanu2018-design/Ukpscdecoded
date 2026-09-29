# Step 3: remove the bad takes / repeated lines listed in work\remove_takes.csv
# (times as seen in work\main_cut.mp4). Result: work\main_clean.mp4
. "$PSScriptRoot\common.ps1"
Assert-FFmpeg

$ranges = @()
foreach ($r in Import-Csv (Join-Path $Work 'remove_takes.csv')) {
  $a = To-Sec $r.start; $b = To-Sec $r.end
  if ($null -eq $a -or $null -eq $b) { continue }
  if ($b -le $a) { throw "In remove_takes.csv the end is before the start: $($r.start),$($r.end)" }
  $ranges += , @($a, $b)
}
Write-Host "Removing $($ranges.Count) sections..." -ForegroundColor Cyan
$out = Join-Path $Work 'main_clean.mp4'
Remove-Ranges (Join-Path $Work 'main_cut.mp4') $out $ranges
Write-Host ("Done. Length now {0}. Next: watch work\main_clean.mp4 and fill in work\overlays.csv" -f (Show-Min (Get-Duration $out))) -ForegroundColor Green

# Step 2c: read work\transcript.srt, find lines said more than once, and write
# work\remove_takes.csv for you (keeps the LAST take, cuts the earlier tries
# and anything said in between, e.g. talk with the cameraman).
# Check the list it prints, then run step 3.
. "$PSScriptRoot\common.ps1"

$Similar = 0.65   # how alike two lines must be to count as a retake (0-1). Lower = finds more.
$MaxGap  = 60     # a retake must start within this many seconds of the first try
$MinWords = 3     # ignore very short lines ("haan", "ok")

$srt = Join-Path $Work 'transcript.srt'
if (-not (Test-Path $srt)) { throw 'work\transcript.srt missing. Run step 2b first.' }

function Parse-SrtTime([string]$t) {
  $t = $t.Trim() -replace ',', '.'
  return (To-Sec $t)
}

# read segments
$segs = @()
$blocks = ([IO.File]::ReadAllText($srt, [Text.Encoding]::UTF8) -replace "`r", '') -split "`n`n+"
foreach ($b in $blocks) {
  $lines = $b.Trim() -split "`n"
  if ($lines.Count -lt 3 -or $lines[1] -notmatch '-->') { continue }
  $p = $lines[1] -split '-->'
  $text = ($lines[2..($lines.Count - 1)] -join ' ').Trim()
  $norm = ($text.ToLower() -replace '[^\p{L}\p{N}\p{M} ]', ' ' -replace '\s+', ' ').Trim()
  $words = @($norm -split ' ' | Where-Object { $_ })
  $nums = (@([regex]::Matches($norm, '\d+') | ForEach-Object Value) | Sort-Object) -join ' '
  $segs += [pscustomobject]@{ Start = (Parse-SrtTime $p[0]); End = (Parse-SrtTime $p[1]); Text = $text; Norm = $norm; Words = $words.Count; Nums = $nums }
}
Write-Host "Read $($segs.Count) lines from the transcript."

function Bigrams([string]$s) {
  $h = @{}
  $s = $s -replace ' ', ''
  for ($k = 0; $k -lt $s.Length - 1; $k++) { $h[$s.Substring($k, 2)] = 1 }
  return $h
}
function Similarity($a, $b) {
  $x = Bigrams $a; $y = Bigrams $b
  if ($x.Count -eq 0 -or $y.Count -eq 0) { return 0 }
  $common = 0
  foreach ($k in $x.Keys) { if ($y.ContainsKey($k)) { $common++ } }
  return (2.0 * $common) / ($x.Count + $y.Count)
}

# find retakes: line i said again later as line j -> cut from i up to j
$ranges = @()
for ($i = 0; $i -lt $segs.Count; $i++) {
  if ($segs[$i].Words -lt $MinWords) { continue }
  $best = -1
  for ($j = $i + 1; $j -lt $segs.Count; $j++) {
    if ($segs[$j].Start - $segs[$i].Start -gt $MaxGap) { break }
    if ($segs[$j].Words -lt $MinWords) { continue }
    # "marks 942" and "marks 948" are different lines, not a retake
    if ($segs[$i].Nums -and $segs[$j].Nums -and $segs[$i].Nums -ne $segs[$j].Nums) { continue }
    if ((Similarity $segs[$i].Norm $segs[$j].Norm) -ge $Similar) { $best = $j }
  }
  if ($best -ge 0) {
    $ranges += [pscustomobject]@{ Start = $segs[$i].Start; End = $segs[$best].Start; Text = $segs[$i].Text }
  }
}

# merge overlapping cuts
$ranges = @($ranges | Sort-Object Start)
$merged = @()
foreach ($r in $ranges) {
  if ($merged.Count -and $r.Start -le $merged[-1].End + 0.5) {
    if ($r.End -gt $merged[-1].End) { $merged[-1].End = $r.End }
  } else { $merged += [pscustomobject]@{ Start = $r.Start; End = $r.End; Text = $r.Text } }
}

function T([double]$s) { '{0}:{1:00}.{2}' -f [math]::Floor($s / 60), [math]::Floor($s % 60), [math]::Floor(($s * 10) % 10) }

$out = Join-Path $Work 'remove_takes.csv'
if (Test-Path $out) { Copy-Item $out (Join-Path $Work 'remove_takes_backup.csv') -Force }
$rows = @('start,end,note')
$total = 0
foreach ($m in $merged) {
  $note = ($m.Text -replace '[,"]', ' ')
  if ($note.Length -gt 60) { $note = $note.Substring(0, 60) }
  $rows += "$(F $m.Start),$(F $m.End),retake: $note"
  $total += $m.End - $m.Start
}
[IO.File]::WriteAllText($out, ($rows -join "`r`n") + "`r`n", $Utf8)

Write-Host "`nFound $($merged.Count) retakes, $(Show-Min $total) in total:" -ForegroundColor Green
foreach ($m in $merged) { Write-Host ("  cut {0,-8} to {1,-8} ({2:0}s)" -f (T $m.Start), (T $m.End), ($m.End - $m.Start)) }
Write-Host "`nSaved to work\remove_takes.csv. Check a few in VLC (times are in main_cut.mp4)."
Write-Host 'To undo one, open the csv in Notepad and delete its line. Then run step 3.'

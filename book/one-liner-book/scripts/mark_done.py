"""Mark Negi OCR pages done in data/negi-coverage.md: mark_done.py <first> [<last>] ["note"]"""
import os, re, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(HERE, "data", "negi-coverage.md")
first = int(sys.argv[1])
last = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else first
note = sys.argv[-1] if not sys.argv[-1].isdigit() else ""
lines = open(path, encoding="utf-8").read().split("\n")
for i, l in enumerate(lines):
    m = re.match(r"\| p(\d{3}) \|", l)
    if m and first <= int(m.group(1)) <= last:
        cells = l.split("|")
        cells[4] = " done "
        if note:
            cells[5] = f" {note} "
        lines[i] = "|".join(cells)
open(path, "w", encoding="utf-8").write("\n".join(lines))
done = sum(1 for l in lines if "| done |" in l)
print(f"done: {done} of 146")

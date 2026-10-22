"""add_rows.py <chapter> <section substring> <rows.yaml>: append table rows to the last table of a section,
or (with --new "<en>|<hi>" and cols "en1,en2|hi1,hi2") add a new table section after it."""
import json, os, sys, yaml
HERE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content")
q = lambda t: json.dumps(t, ensure_ascii=False)
chap, sec, rowsf = sys.argv[1:4]
rows = yaml.safe_load(open(rowsf, encoding="utf-8"))
path = os.path.join(HERE, chap + ".yaml")
lines = open(path, encoding="utf-8").read().split("\n")
start = next(i for i, l in enumerate(lines) if l.startswith("- h:") and sec in l)
end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("- h:")), len(lines))
while not lines[end - 1].strip(): end -= 1
fmt = lambda r: f"      - {{en: {q(r['en'])}, hi: {q(r['hi'])}, src: {q(r['src'])}}}"
if len(sys.argv) > 4 and sys.argv[4] == "--new":
    hen, hhi = sys.argv[5].split("|"); cen, chi = [c.split(",") for c in sys.argv[6].split("|")]
    new = [f"- h: {{en: {q(hen)}, hi: {q(hhi)}}}", "  blocks:", "  - table:",
           f"      cols: {{en: {q(cen)}, hi: {q(chi)}}}", "      rows:"] + [fmt(r) for r in rows]
    lines[end:end] = [""] + new
else:
    last = max(i for i in range(start, end) if lines[i].startswith("      - {"))
    lines[last + 1:last + 1] = [fmt(r) for r in rows]
text = "\n".join(lines); yaml.safe_load(text)
open(path, "w", encoding="utf-8", newline="\n").write(text); print("ok", len(rows))

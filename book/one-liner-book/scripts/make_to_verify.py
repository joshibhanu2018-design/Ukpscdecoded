"""Write to-verify.md from data/disposition.yaml ('verify:' entries) and data/printed-notes.yaml."""
import json, os, re, sys
import yaml
sys.path.insert(0, os.path.dirname(__file__))
import check_sources
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bank = {json.loads(l)["id"]: json.loads(l) for l in open(os.path.join(HERE, "data", "uk_questions.jsonl"), encoding="utf-8")}
disp = yaml.safe_load(open(os.path.join(HERE, "data", "disposition.yaml"), encoding="utf-8")) or {}
notes = yaml.safe_load(open(os.path.join(HERE, "data", "printed-notes.yaml"), encoding="utf-8")) or []
full = lambda k: k if k.startswith(("UKPCS", "GEN")) else f"UKPCS-UKGK-CH{k}"
_, _, cited, _ = check_sources.main()
out = ["# To verify: question bank vs B.S. Negi", "",
       "Questions kept out of the book until checked, and printed facts where the sources differ.",
       "Fix the workbook (or give the question a Review_Flag) once checked.", "",
       "## Questions held back", "", "| Question | Bank says | Problem / what the book does |", "|---|---|---|"]
for k, v in disp.items():
    if not str(v).startswith("verify:"):
        continue
    q = bank[full(k)]
    cell = lambda t: re.sub(r"\s+", " ", t).replace("|", "/")
    state = " **(printed: other sources agree)**" if full(k) in cited else ""
    out.append(f"| `{full(k)}` {cell(q['q_en'])[:160]} | {cell(q['ans_en'])[:80]} | {cell(v[7:].strip())}{state} |")
out += ["", "## Printed facts where sources differ", "", "| Topic | Difference | Book |", "|---|---|---|"]
out += [f"| {n['topic']} | {n['issue']} | {n['book']} |" for n in notes]
open(os.path.join(HERE, "to-verify.md"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("to-verify.md:", sum(str(v).startswith("verify:") for v in disp.values()), "questions,", len(notes), "notes")

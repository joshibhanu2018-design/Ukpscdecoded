"""Export every Uttarakhand MCQ (used and unused) to data/uk_questions.jsonl.
Flag categories: 'ok' (no flag, or too easy / repeat: fact still usable) or
'verify' (doubtful, defect, outdated, answer check...: goes to to-verify.md)."""
import json, os, re
import pandas as pd
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
D = os.path.join(ROOT, "test series questions")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "uk_questions.jsonl")
UK = re.compile(r"uttarakhand|उत्तराखंड|उत्तराखण्ड|dehradun|garhwal|kumaon|nainital|haridwar|almora|tehri|chamoli|pithoragarh|uttarkashi|rudraprayag|bageshwar|champawat|udham singh|pauri|dhami", re.I)
USABLE = re.compile(r"^\s*(too easy|repeat of|duplicate)", re.I)

def opt(text):
    en, _, hi = str(text).partition(" / ")
    return en.strip(), hi.strip()

rows = []
for f, sh in [("MERGED_QUESTION_BANK_v2.xlsx", "Question Bank"), ("GENERATED_QUESTIONS.xlsx", "Generated Questions")]:
    df = pd.read_excel(os.path.join(D, f), sheet_name=sh, dtype=str).fillna("")
    for r in df.to_dict("records"):
        if r["Section_Code"] != "UKGK" and not UK.search(r["Question (English)"] + r["Correct_Answer_Text"] + r["Question (Hindi)"]):
            continue
        ans = r["Correct_Answer"].strip().upper()
        a_en, a_hi = opt(r.get(f"Option_{ans}", "")) if ans in "ABCD" and ans else ("", "")
        flag = r["Review_Flag"].strip()
        rows.append({
            "id": r["Question_ID"], "file": f, "sec": r["Section_Code"], "ch": r["Chapter_Code"],
            "chname": r["Chapter/Sub-topic"], "ca": r["Static_or_CA"],
            "q_en": r["Question (English)"], "q_hi": r["Question (Hindi)"],
            "ans_en": a_en or r["Correct_Answer_Text"], "ans_hi": a_hi,
            "opts": [r[f"Option_{l}"] for l in "ABCD"],
            "ex_en": r["Explanation (updated)"], "ex_hi": r["Explanation (Hindi if needed)"],
            "flag": flag, "use": "ok" if not flag or USABLE.match(flag) else "verify",
        })
with open(OUT, "w", encoding="utf-8") as fh:
    for r in rows:
        fh.write(json.dumps(r, ensure_ascii=False) + "\n")
import collections
print(len(rows), collections.Counter(r["use"] for r in rows))
print(collections.Counter((r["ch"], r["use"]) for r in rows if r["sec"] == "UKGK"))

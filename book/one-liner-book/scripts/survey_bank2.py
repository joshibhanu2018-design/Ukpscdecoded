import pandas as pd, re, os
D = r"C:\Users\Administrator\Documents\Ukpscdecoded\test series questions"
m = pd.read_excel(os.path.join(D,"MERGED_QUESTION_BANK_v2.xlsx"), sheet_name="Question Bank", dtype=str).fillna("")
g = pd.read_excel(os.path.join(D,"GENERATED_QUESTIONS.xlsx"), sheet_name="Generated Questions", dtype=str).fillna("")
c = pd.read_excel(os.path.join(D,"COMBINED_QUESTIONS.xlsx"), sheet_name="Combined Questions", dtype=str).fillna("")
uk = m[m.Section_Code=="UKGK"]
print("UKGK master:", len(uk), " flagged:", (uk.Review_Flag!="").sum())
print(uk["Chapter/Sub-topic"].value_counts().to_string())
print(uk["Chapter_Code"].value_counts().to_string())
pat = re.compile(r"uttarakhand|उत्तराखंड|उत्तराखण्ड|dehradun|garhwal|kumaon|nainital|haridwar|almora|tehri|chamoli|pithoragarh|uttarkashi|rudraprayag|bageshwar|champawat|udham singh|pauri|dhami", re.I)
for name, df in [("master non-UKGK", m[m.Section_Code!="UKGK"]), ("generated non-UKGK", g[g.Section_Code!="UKGK"])]:
    hit = df[df.apply(lambda r: bool(pat.search(r["Question (English)"]+" "+r["Correct_Answer_Text"]+" "+r["Question (Hindi)"])), axis=1)]
    print(name, "mentioning UK:", len(hit), hit.Section_Code.value_counts().to_dict())
print("GEN UKGK", len(g[g.Section_Code=="UKGK"]), "CMB", len(c))
print(uk.iloc[0].to_dict())

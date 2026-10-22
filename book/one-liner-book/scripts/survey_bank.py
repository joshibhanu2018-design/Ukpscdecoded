import pandas as pd, sys
D = r"C:\Users\Administrator\Documents\Ukpscdecoded\test series questions"
for f, sh in [("MERGED_QUESTION_BANK_v2.xlsx","Question Bank"),("GENERATED_QUESTIONS.xlsx","Generated Questions"),("COMBINED_QUESTIONS.xlsx","Combined Questions")]:
    df = pd.read_excel(f"{D}\{f}", sheet_name=sh, dtype=str).fillna("")
    print("=====", f, len(df)); print(list(df.columns))
    print(df["Section_Code"].value_counts().to_string()[:800])
    print(df["Subject"].value_counts().head(30).to_string())

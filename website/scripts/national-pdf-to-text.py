"""Convert the national source eBooks to page-numbered text so they can be searched.

    cd website
    python scripts/national-pdf-to-text.py

Reads  ../national sources/*.pdf
Writes ../test series questions/national-text/<book>.txt  (git-ignored)
Each page starts with a line "=== p<N> ===".
"""
import pathlib
import pymupdf as fitz

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "national sources"
OUT = ROOT / "test series questions" / "national-text"
OUT.mkdir(parents=True, exist_ok=True)

for pdf in sorted(SRC.glob("*.pdf")):
    target = OUT / (pdf.stem + ".txt")
    if target.exists() and target.stat().st_mtime > pdf.stat().st_mtime:
        print(f"up to date  {pdf.name}")
        continue
    doc = fitz.open(pdf)
    chars = 0
    with target.open("w", encoding="utf-8") as f:
        for i, page in enumerate(doc, 1):
            text = page.get_text()
            chars += len(text)
            f.write(f"=== p{i} ===\n{text}\n")
    print(f"{pdf.name}: {doc.page_count} pages, {chars // max(doc.page_count, 1)} chars/page")

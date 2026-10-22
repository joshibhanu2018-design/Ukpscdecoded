"""OCR the enhanced B.S. Negi scans (book/bs negi enhanced.pdf, rendered to
negi-enh/). Each image is a sideways two-page spread with two text columns
per page: rotate upright, cut at the three emptiest vertical gutters, OCR each
column with Tesseract (hin+eng, --psm 6). Output: negi-ocr/pNNN.txt with
'=== col k' markers, columns in reading order."""
import os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TESS = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
SRC, COLS, OUT = (os.path.join(HERE, d) for d in ("negi-enh", "negi-cols", "negi-ocr"))
FLIPPED = {6, 14, 28, 30, 32}  # found by a low share of Devanagari in the first OCR pass

def gutters(im):
    g = im.convert("L").resize((im.width // 4, im.height // 4))
    w, h = g.size
    px = g.load()
    ink = [sum(1 for y in range(h // 10, h * 9 // 10) if px[x, y] < 110) for x in range(w)]
    cuts = []
    for frac in (0.25, 0.5, 0.75):
        lo, hi = int(w * (frac - 0.1)), int(w * (frac + 0.1))
        # smooth over 3 px, pick the emptiest x
        best = min(range(lo + 1, hi - 1), key=lambda x: ink[x - 1] + ink[x] + ink[x + 1])
        cuts.append(best * 4)
    return cuts

def job(name):
    stem = name[:-4]
    out = os.path.join(OUT, stem + ".txt")
    if os.path.exists(out):
        return
    im = Image.open(os.path.join(SRC, name))
    if im.height > im.width:
        # most spreads were photographed one way; pages listed in FLIPPED the other way
        im = im.rotate(90 if int(stem[1:]) in FLIPPED else 270, expand=True)
    xs = [0, *gutters(im), im.width]
    parts = []
    for k in range(4):
        cp = os.path.join(COLS, f"{stem}-{k}.png")
        im.crop((max(0, xs[k] - 8), 0, min(im.width, xs[k + 1] + 8), im.height)).save(cp)
        r = subprocess.run([TESS, cp, "-", "--tessdata-dir", os.path.join(HERE, "tessdata"),
                            "-l", "hin+eng", "--psm", "6"], capture_output=True)
        parts.append(f"=== col {k}\n" + r.stdout.decode("utf-8", "replace"))
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    print(stem, flush=True)

with ThreadPoolExecutor(int(sys.argv[1]) if len(sys.argv) > 1 else 4) as ex:
    names = sorted(os.listdir(SRC))
    first = [f"p{int(n):03d}.png" for n in os.environ.get("OCR_FIRST", "").split(",") if n]
    list(ex.map(job, first + [n for n in names if n not in first]))

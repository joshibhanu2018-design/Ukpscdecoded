"""Middle-strip crops (the column that half-page crops cut): pNNN-M1/M2.png, x from a to b (fractions)."""
import os, sys
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
n, a, b = int(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
im = Image.open(os.path.join(HERE, "negi-enh", f"p{n:03d}.png"))
if im.height > im.width:
    im = im.rotate(90 if n in {6, 14, 28, 30, 32} else 270, expand=True)
w, h = im.size
for k in range(2):
    im.crop((int(w * a), max(0, k * h // 2 - 30), int(w * b), min(h, (k + 1) * h // 2 + 30))).save(
        os.path.join(HERE, "negi-read", f"p{n:03d}-M{k + 1}.png"))

"""Upright crops of Negi spreads for reading: pNNN-{L,R}{1,2,3}.png (half page, top/mid/bottom third)."""
import os, sys
from PIL import Image
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for n in [int(a) for a in sys.argv[1:]]:
    im = Image.open(os.path.join(HERE, "negi-enh", f"p{n:03d}.png"))
    if im.height > im.width:
        im = im.rotate(90 if n in {6, 14, 28, 30, 32} else 270, expand=True)
    w, h = im.size
    for side, (x0, x1) in (("L", (0, w // 2 + 10)), ("R", (w // 2 - 10, w))):
        for k in range(3):
            y0, y1 = max(0, k * h // 3 - 40), min(h, (k + 1) * h // 3 + 40)
            im.crop((x0, y0, x1, y1)).save(os.path.join(HERE, "negi-read", f"p{n:03d}-{side}{k + 1}.png"))

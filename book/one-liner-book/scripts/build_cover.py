"""Print cover (back + spine + front) for the B5 One-Liner book, for offset printing.

    python -I -X utf8 scripts/build_cover.py                  # both languages, page count from out/one-liner-<lang>.pdf
    python -I -X utf8 scripts/build_cover.py --pages hi=144 en=120 --gsm 70

Geometry (all mm): trim 176 x 250 per side; spine = leaves x paper caliper + cover
allowance; 3 mm bleed on every outside edge; text kept 6 mm inside the trim.
Output in out/cover/:
  cover-<lang>-bleed.pdf  artboard = trim + bleed (import into CorelDRAW: File > Import,
                          'Import text as: Curves'; then convert colours to CMYK)
  cover-<lang>-marks.pdf  same, centred on a larger sheet with crop marks, spine fold
                          marks and a slug line with the sizes (send this to the printer)
  cover-<lang>-preview.png  300 dpi preview of the bleed artboard
  cover-<lang>-spec.txt     the sizes, for the printer
"""
import math, os, sys
import pymupdf
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(HERE, "scripts"))
import build_book as bb  # noqa: E402  (fonts, colours, links, QR script, mountains)

TRIM_W, TRIM_H, BLEED, SAFE = 176.0, 250.0, 3.0, 6.0
CALIPER = {60: 0.080, 70: 0.090, 80: 0.100, 90: 0.110}  # mm per leaf (2 pages), uncoated maplitho
COVER_ALLOW = 0.6  # two folds of ~300 gsm board
SLUG = 12.0
MM = 72 / 25.4
INK, ORANGE = bb.INK, bb.ORANGE

TXT = {
    "hi": {
        "title1": "उत्तराखण्ड", "title2": "वन-लाइनर",
        "tag": "UKPSC · UKSSSC · अपर PCS · समूह 'ग' · पटवारी · VDO",
        "sub": "उत्तराखण्ड सामान्य ज्ञान के सभी तथ्य — एक पुस्तक में",
        "seal": ["4,300+", "परीक्षा प्रश्नों", "पर आधारित"],
        "chips": ["भूगोल एवं जनपद", "इतिहास", "कला-संस्कृति", "राजव्यवस्था", "अर्थव्यवस्था", "व्यक्तित्व", "समसामयिकी 2025–26"],
        "by": "भानु जोशी", "edition": "हिन्दी संस्करण · 2026",
        "back_h": "पढ़ें। अभ्यास करें। चयनित हों।",
        "back": "UKPSC व UKSSSC के प्रश्नपत्रों में उत्तराखण्ड से जो पूछा जाता है, वह सब यहाँ है — हर जनपद, नदी, दर्रा, राजवंश, "
                "आन्दोलन, मेला, योजना व व्यक्तित्व; छोटी, परीक्षा-उपयोगी पंक्तियों में और त्वरित रिवीजन हेतु तालिकाओं के साथ।",
        "points": ["30 अध्याय, UKPSC पाठ्यक्रम के क्रम में", "मोटे अक्षरों में परीक्षा के मुख्य शब्द", "नदियों, दर्रों, योजनाओं व पुरस्कारों की तालिकाएँ", "अद्यतन समसामयिकी 2025–26"],
        "author_h": "लेखक के बारे में",
        "author": "भानु जोशी — UKPSC Decoded के संस्थापक; नौ वर्षों की तैयारी व UPSC कोचिंग में 5+ वर्ष अध्यापन।",
        "creds": ["UKPSC अपर PCS — कट-ऑफ उत्तीर्ण", "UKPSC लोअर PCS — रैंक 9"],
        "cta": "जो पढ़ा, उसका टेस्ट दें", "cta2": "अध्यायवार व पूर्ण टेस्ट · वास्तविक परीक्षा पैटर्न",
        "q_tests": "टेस्ट", "q_yt": "यूट्यूब", "q_tg": "टेलीग्राम",
        "price": "मूल्य", "spine_ed": "हिन्दी",
    },
    "en": {
        "title1": "Uttarakhand", "title2": "One-Liner",
        "tag": "UKPSC · UKSSSC · Upper PCS · Group 'C' · Patwari · VDO",
        "sub": "Every fact of Uttarakhand GK — in one book",
        "seal": ["4,300+", "exam questions", "distilled"],
        "chips": ["Geography & Districts", "History", "Art & Culture", "Polity", "Economy", "Personalities", "Current Affairs 2025–26"],
        "by": "Bhanu Joshi", "edition": "English Edition · 2026",
        "back_h": "Read. Practise. Get selected.",
        "back": "Everything UKPSC and UKSSSC papers ask about Uttarakhand is here — every district, river, pass, dynasty, movement, "
                "fair, scheme and personality — in short, exam-ready lines with tables for quick revision.",
        "points": ["30 chapters in UKPSC syllabus order", "Exam keywords in bold", "Tables of rivers, passes, schemes and awards", "Updated current affairs 2025–26"],
        "author_h": "About the author",
        "author": "Bhanu Joshi — founder of UKPSC Decoded; nine years of preparation and 5+ years teaching at UPSC coaching institutes.",
        "creds": ["UKPSC Upper PCS — cleared the cut-off", "UKPSC Lower PCS — Rank 9"],
        "cta": "Test yourself on what you read", "cta2": "Chapter-wise & full-length tests · real exam pattern",
        "q_tests": "Tests", "q_yt": "YouTube", "q_tg": "Telegram",
        "price": "MRP", "spine_ed": "English",
    },
}

BIG_MTN = ("<svg class='bigmtn' viewBox='0 0 200 80' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>"
           "<circle cx='150' cy='22' r='13' fill='#FFC15E' opacity='0.9'/>"
           "<path d='M0 80 L0 52 L20 38 L32 46 L52 18 L64 34 L78 26 L96 46 L116 14 L130 32 L146 6 L162 34 L178 24 L200 40 L200 80 Z' fill='#F59307' opacity='0.55'/>"
           "<path d='M52 18 L47 26 L52 23 L57 28 Z M116 14 L111 22 L116 19 L121 24 Z M146 6 L140 15 L146 12 L152 17 Z' fill='#fff'/>"
           "<path d='M0 80 L0 62 L26 48 L42 56 L62 40 L84 58 L106 42 L126 56 L150 38 L172 52 L200 44 L200 80 Z' fill='#E0700A'/>"
           "<path d='M0 80 L0 70 L30 62 L56 70 L84 60 L112 70 L140 62 L170 70 L200 64 L200 80 Z' fill='#B85A06'/>"
           "</svg>")


def spine_mm(pages, gsm):
    leaves = math.ceil(pages / 2)
    return round((leaves * CALIPER[gsm] + COVER_ALLOW) * 2) / 2  # nearest 0.5 mm


def cover_html(lang, spine):
    t = TXT[lang]
    W = 2 * TRIM_W + spine + 2 * BLEED
    H = TRIM_H + 2 * BLEED
    fam = "Mukta, Poppins" if lang == "hi" else "Poppins"
    body = "Mukta, Poppins" if lang == "hi" else "Inter, Poppins"
    back_x, spine_x, front_x = 0, BLEED + TRIM_W, BLEED + TRIM_W + spine
    chips = "".join(f"<span>{c}</span>" for c in t["chips"])
    pts = "".join(f"<li>{p}</li>" for p in t["points"])
    creds = "".join(f"<div class='cred'><span>✓</span>{c}</div>" for c in t["creds"])
    fonts = bb.css(lang).split("@page")[0]  # just the @font-face rules
    spine_font = max(7.0, min(12.0, spine * 1.25))
    css = f"""{fonts}
@page {{ size: {W}mm {H}mm; margin: 0; }}
* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ margin: 0; width: {W}mm; height: {H}mm; position: relative; overflow: hidden; font-family: {body}; color: #fff; }}
.panel {{ position: absolute; top: 0; height: {H}mm; overflow: hidden; }}
.back {{ left: {back_x}mm; width: {BLEED + TRIM_W}mm; background: {INK}; }}
.spine {{ left: {spine_x}mm; width: {spine}mm; background: {ORANGE}; }}
.front {{ left: {front_x}mm; width: {TRIM_W + BLEED}mm; background: {INK}; }}
/* content boxes = trim area minus the safe margin */
.front .in {{ position: absolute; left: {SAFE}mm; right: {BLEED + SAFE}mm; top: {BLEED + SAFE + 4}mm; bottom: {BLEED + SAFE}mm; }}
.back .in {{ position: absolute; left: {BLEED + SAFE}mm; right: {SAFE + 2}mm; top: {BLEED + SAFE + 4}mm; bottom: {BLEED + SAFE}mm; }}
.brand {{ font: 600 11pt Poppins; letter-spacing: 0.04em; }}
.brand b {{ font-weight: 700; color: {INK}; background: {ORANGE}; padding: 0.4mm 2mm; border-radius: 1mm; margin-left: 0.8mm; }}
.tag {{ font: 500 8.4pt Poppins; color: #f7c27a; margin-top: 9mm; letter-spacing: 0.02em; }}
.t1 {{ font: 700 {46 if lang == 'hi' else 42}pt/1 {fam}; margin-top: 4mm; }}
.t2 {{ font: 700 {62 if lang == 'hi' else 58}pt/1 {fam}; color: {ORANGE}; margin-top: 1mm; }}
.rule {{ width: 34mm; height: 1.6mm; background: {ORANGE}; border-radius: 1mm; margin: 6mm 0 5mm; }}
.sub {{ font: 500 {14 if lang == 'hi' else 13}pt/1.3 {fam}; max-width: 120mm; }}
.seal {{ position: absolute; right: 2mm; top: 46mm; width: 34mm; height: 34mm; border-radius: 50%; background: {ORANGE};
         color: {INK}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
         transform: rotate(-8deg); box-shadow: 0 0 0 1.4mm {INK}, 0 0 0 2mm {ORANGE}; }}
.seal b {{ font: 700 15pt/1 Poppins; }}
.seal span {{ font: 600 {9 if lang == 'hi' else 8}pt/1.15 {fam}; }}
.chips {{ display: flex; flex-wrap: wrap; gap: 2mm; margin-top: 9mm; max-width: 150mm; }}
.chips span {{ font: 600 {10 if lang == 'hi' else 8.6}pt {fam}; border: 0.8pt solid {ORANGE}; color: #fff; border-radius: 5mm; padding: 1.2mm 3.4mm; }}
.bigmtn {{ position: absolute; left: 0; bottom: 0; width: 100%; height: 92mm; display: block; }}
.foot {{ position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; align-items: flex-end; }}
.by {{ font: 700 {15 if lang == 'hi' else 14}pt {fam}; }}
.ed {{ font: 600 {10.5 if lang == 'hi' else 9.5}pt {fam}; color: #ffe2b8; margin-top: 1mm; }}
.site {{ font: 700 11pt Poppins; color: #fff; text-align: right; }}
/* spine: text runs top to bottom */
.sp {{ position: absolute; left: 50%; top: {BLEED + 8}mm; width: {TRIM_H - 16}mm; height: {spine}mm;
       transform-origin: 0 0; transform: rotate(90deg) translate(0, -50%); display: flex; align-items: center;
       justify-content: space-between; color: {INK}; white-space: nowrap; padding: 0 2mm; }}
.sp .st {{ font: 700 {spine_font}pt/1 {fam}; }}
.sp .st i {{ font-style: normal; color: #fff; }}
.sp .sb {{ font: 700 {max(6.0, spine_font - 2.5)}pt/1 Poppins; }}
/* back */
.back h1 {{ font: 700 {24 if lang == 'hi' else 21}pt/1.15 {fam}; color: {ORANGE}; margin: 8mm 0 4mm; }}
.back p {{ font-size: {11 if lang == 'hi' else 10}pt; line-height: 1.45; margin: 0 0 4mm; color: #e9edf5; }}
.back ul {{ margin: 0 0 5mm; padding-left: 5mm; font-size: {10.5 if lang == 'hi' else 9.6}pt; line-height: 1.5; }}
.back li::marker {{ color: {ORANGE}; }}
.author {{ border: 0.8pt solid {ORANGE}; border-radius: 2mm; padding: 3.5mm 4mm; margin-bottom: 5mm; background: rgba(255,255,255,0.04); }}
.author h3 {{ font: 700 {11 if lang == 'hi' else 10}pt {fam}; color: {ORANGE}; margin: 0 0 1.5mm; }}
.author .a {{ font-size: {10 if lang == 'hi' else 9}pt; line-height: 1.4; color: #e9edf5; }}
.cred {{ font: 700 {11.5 if lang == 'hi' else 10.5}pt {fam}; margin-top: 2mm; display: flex; gap: 2mm; align-items: center; }}
.cred span {{ display: inline-flex; width: 5mm; height: 5mm; border-radius: 50%; background: {ORANGE}; color: {INK};
              align-items: center; justify-content: center; font-size: 8pt; }}
.cta {{ display: flex; align-items: center; justify-content: space-between; gap: 4mm; background: {ORANGE}; color: {INK};
        border-radius: 2mm; padding: 3.5mm 4.5mm; margin-bottom: 5mm; }}
.cta b {{ font: 700 {13 if lang == 'hi' else 12}pt {fam}; display: block; }}
.cta div {{ font-size: {9.5 if lang == 'hi' else 8.6}pt; }}
.cta .u {{ font: 700 9pt Poppins; margin-top: 1.4mm; }}
.qr {{ width: 21mm; height: 21mm; background: #fff; padding: 1.2mm; }}
.qr svg {{ width: 100%; height: 100%; display: block; }}
.qrs {{ display: flex; gap: 6mm; align-items: flex-end; }}
.qrbox {{ text-align: center; font: 600 8pt Poppins; }}
.qrbox .l {{ margin-top: 1.2mm; }}
.bfoot {{ position: absolute; left: 0; right: 0; bottom: 0; display: flex; justify-content: space-between; align-items: flex-end; }}
.barcode {{ width: 44mm; height: 27mm; background: #fff; border-radius: 1mm; color: #888; font: 500 7pt Poppins;
            display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 2mm; }}
.barcode b {{ color: {INK}; font: 700 10pt Poppins; margin-bottom: auto; margin-top: 3mm; }}
"""

    def qrb(key, label):
        return f"<div class='qrbox'><div class='qr'>{bb.QR_SVG.get(bb.LINKS[key][1], '')}</div><div class='l'>{label}</div></div>"

    front = (f"<div class='panel front'>{BIG_MTN}<div class='in'>"
             f"<div class='brand'>UKPSC<b>Decoded</b></div><div class='tag'>{t['tag']}</div>"
             f"<div class='t1'>{t['title1']}</div><div class='t2'>{t['title2']}</div><div class='rule'></div>"
             f"<div class='sub'>{t['sub']}</div>"
             f"<div class='seal'><b>{t['seal'][0]}</b><span>{t['seal'][1]}<br>{t['seal'][2]}</span></div>"
             f"<div class='chips'>{chips}</div>"
             f"<div class='foot'><div><div class='by'>{t['by']}</div><div class='ed'>{t['edition']}</div></div>"
             f"<div class='site'>{bb.SITE}</div></div></div></div>")
    spine_html = (f"<div class='panel spine'><div class='sp'><span class='st'>{t['title1']} <i>{t['title2']}</i></span>"
                  f"<span class='sb'>{t['spine_ed']} · UKPSC Decoded</span></div></div>")
    back = (f"<div class='panel back'><div class='in'>"
            f"<div class='brand'>UKPSC<b>Decoded</b></div><h1>{t['back_h']}</h1><p>{t['back']}</p><ul>{pts}</ul>"
            f"<div class='author'><h3>{t['author_h']}</h3><div class='a'>{t['author']}</div>{creds}</div>"
            f"<div class='cta'><div><b>{t['cta']}</b><div>{t['cta2']}</div><div class='u'>{bb.LINKS['tests'][0]}</div></div>"
            f"{qrb('tests', '')}</div>"
            f"<div class='bfoot'><div class='qrs'>{qrb('youtube', t['q_yt'])}{qrb('telegram', t['q_tg'])}</div>"
            f"<div class='barcode'><b>{t['price']} ₹ ______</b>ISBN / barcode</div></div></div></div>")
    # spine panel drawn last so a wide title never spills onto the covers
    return (f"<!doctype html><html lang='{lang}'><head><meta charset='utf-8'><style>{css}</style></head>"
            f"<body>{back}{front}{spine_html}</body></html>"), W, H


def add_marks(src, dst, W, H, spine, lang, pages, gsm):
    s = pymupdf.open(src)
    out = pymupdf.open()
    pw, ph = (W + 2 * SLUG) * MM, (H + 2 * SLUG) * MM
    page = out.new_page(width=pw, height=ph)
    o = SLUG * MM
    page.show_pdf_page(pymupdf.Rect(o, o, o + W * MM, o + H * MM), s, 0)
    reg = (0, 0, 0)
    tx = [BLEED, BLEED + TRIM_W, BLEED + TRIM_W + spine, BLEED + 2 * TRIM_W + spine]  # vertical trim/fold lines (mm from artboard left)
    top, bot = BLEED, BLEED + TRIM_H
    L = 7
    for i, x in enumerate(tx):
        X = o + x * MM
        for y0, y1 in ((0.5, SLUG - 1), (SLUG + H + 1, 2 * SLUG + H - 0.5)):
            if i in (1, 2):  # spine folds: dashed
                page.draw_line((X, y0 * MM), (X, y1 * MM), color=reg, width=0.25, dashes="[2 1] 0")
            else:
                page.draw_line((X, (SLUG - 1 - L) * MM if y0 < 1 else y0 * MM), (X, y1 * MM if y0 < 1 else (SLUG + H + 1 + L) * MM), color=reg, width=0.25)
    for y in (top, bot):
        Y = o + y * MM
        page.draw_line((1 * MM, Y), ((SLUG - 1) * MM, Y), color=reg, width=0.25)
        page.draw_line((pw - (SLUG - 1) * MM, Y), (pw - 1 * MM, Y), color=reg, width=0.25)
    info = (f"Uttarakhand One-Liner ({lang}) cover | B5 trim {TRIM_W:g}x{TRIM_H:g} mm | spine {spine:g} mm "
            f"({pages} pp, {gsm} gsm) | bleed {BLEED:g} mm | spread {W - 2 * BLEED:g}x{TRIM_H:g} mm trim, {W:g}x{H:g} mm with bleed")
    page.insert_text((o, ph - 3 * MM), info, fontsize=6, color=reg)
    out.save(dst, garbage=3, deflate=True)


def main():
    args = sys.argv[1:]
    gsm = 70
    pages = {}
    if "--gsm" in args:
        gsm = int(args[args.index("--gsm") + 1])
    if "--pages" in args:
        for a in args[args.index("--pages") + 1:]:
            if "=" not in a:
                break
            k, v = a.split("=")
            pages[k] = int(v)
    od = os.path.join(bb.OUT, "cover")
    os.makedirs(od, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        pg = browser.new_page()
        bb.make_qr_codes(pg)
        for lang in ("hi", "en"):
            n = pages.get(lang)
            if not n:
                n = len(pymupdf.open(os.path.join(bb.OUT, f"one-liner-{lang}.pdf")))
            n += n % 2
            spine = spine_mm(n, gsm)
            doc, W, H = cover_html(lang, spine)
            hp = os.path.join(od, f"cover-{lang}.html")
            open(hp, "w", encoding="utf-8").write(doc)
            pg.goto("file:///" + hp.replace(os.sep, "/"), wait_until="load")
            pg.evaluate("document.fonts.ready")
            bleed_pdf = os.path.join(od, f"cover-{lang}-bleed.pdf")
            pg.pdf(path=bleed_pdf, width=f"{W}mm", height=f"{H}mm", print_background=True, prefer_css_page_size=True)
            add_marks(bleed_pdf, os.path.join(od, f"cover-{lang}-marks.pdf"), W, H, spine, lang, n, gsm)
            d = pymupdf.open(bleed_pdf)
            d[0].get_pixmap(dpi=300).save(os.path.join(od, f"cover-{lang}-preview.png"))
            spec = (f"Uttarakhand One-Liner — {lang} cover\n"
                    f"Book: B5, trim {TRIM_W:g} x {TRIM_H:g} mm, {n} pages, text paper {gsm} gsm (spine calculated: {spine:g} mm)\n"
                    f"Cover spread (trim): {2 * TRIM_W + spine:g} x {TRIM_H:g} mm = back {TRIM_W:g} + spine {spine:g} + front {TRIM_W:g}\n"
                    f"Cover spread with 3 mm bleed: {W:g} x {H:g} mm\n"
                    f"Safe area: keep text {SAFE:g} mm inside the trim.\n"
                    f"Pages in the PDF: 1 (outside of the cover only; inside covers left blank).\n"
                    f"Before printing: confirm the spine width with your paper's actual caliper; convert to CMYK "
                    f"(orange {ORANGE} ~ C0 M48 Y100 K4, navy {INK} ~ C95 M80 Y40 K50); laminate after printing.\n")
            open(os.path.join(od, f"cover-{lang}-spec.txt"), "w", encoding="utf-8").write(spec)
            print(f"{lang}: {n} pages, spine {spine} mm, artboard {W:g} x {H:g} mm -> {od}")
        browser.close()


if __name__ == "__main__":
    main()

"""Build the Uttarakhand One-Liner book (Hindi + English) as A4 PDFs.

    python -I scripts/build_book.py                 # all chapters listed in book.yaml
    python -I scripts/build_book.py geo-water       # only these chapter ids (sample)

Content: content/<chapter-id>.yaml, bilingual (en/hi side by side), each fact
carrying a `src` tag (Q:<question id suffix> for the question bank, N:<book
page> for B.S. Negi). Source tags are kept in the data and never printed.
Chapters are numbered in book.yaml order.

Space management
- Chapters follow each other on the same page: a chapter starts right below
  the previous one unless its opener would land in the bottom part of a page.
- Every fact, table row and heading is a "unit" carrying an invisible marker.
  After rendering, the units that fell on a chapter's last page are moved into
  a second two-column block; a block that fits on one page is balanced by
  Chromium (a multi-page one is not), so the chapter ends with two even
  columns and the next chapter can use the rest of the page.
- Tables and boxes split between columns row by row (header repeated).
- The running header (current chapter) is stamped afterwards with PyMuPDF:
  Chromium's named pages would force a page break at every chapter.
- A space audit prints pages where a column ends well above the bottom.
Output: out/one-liner-<lang>[-sample].pdf (+ the .html used).
"""
import html, os, re, sys, time
import yaml
import pymupdf
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT, OUT, FONTS = (os.path.join(HERE, d) for d in ("content", "out", "fonts"))
ORANGE = "#F59307"
MM = 72 / 25.4
MARGIN_TOP, MARGIN_BOTTOM = 15 * MM, 13 * MM
MIN_UNITS_UNDER_OPENER = 3  # heading + 2 items must fit under a chapter opener, else it starts a new page
GAP_REPORT_MM = 18   # space audit: report a column ending this far above the bottom margin
UNIT = re.compile(r"@@U:([\w-]+):(\d+)@@")
OPENER = re.compile(r"@@CH:([\w-]+)@@")

UI = {
    "en": {"book": "Uttarakhand One-Liner", "brand": "UKPSC Decoded", "contents": "Contents", "chapter": "Chapter"},
    "hi": {"book": "उत्तराखण्ड वन-लाइनर", "brand": "UKPSC Decoded", "contents": "विषय-सूची", "chapter": "अध्याय"},
}


def inline(text):
    """Escape, then **bold** and __muted__ markup."""
    t = html.escape(str(text).strip())
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"__(.+?)__", r"<span class='mut'>\1</span>", t)
    return t


def pick(v, lang):
    return v.get(lang, "") if isinstance(v, dict) else v


# ---------- units: the smallest pieces the layout may move between columns ----------

def units(ch, lang):
    """[(group, open_html, close_html, body_html)] in order; consecutive units of one group share a wrapper."""
    out = []
    for si, s in enumerate(ch["sections"]):
        out.append((("h2", si), "", "", f"<h2>{inline(pick(s['h'], lang))}</h2>"))
        for bi, b in enumerate(s["blocks"]):
            gid = (si, bi)
            if "facts" in b:
                for f in b["facts"]:
                    out.append((("ul",) + gid, "<ul class='facts'>", "</ul>", f"<li>{inline(pick(f, lang))}</li>"))
            elif "box" in b:
                bx = b["box"]
                o, c = "<div class='box'><ul class='facts'>", "</ul></div>"
                out.append((("box",) + gid, o, c, f"<li class='boxh'>{inline(pick(bx['title'], lang))}</li>"))
                for f in bx["facts"]:
                    out.append((("box",) + gid, o, c, f"<li>{inline(pick(f, lang))}</li>"))
            elif "table" in b or "timeline" in b:
                if "table" in b:
                    t = b["table"]
                    head = "".join(f"<th>{inline(c)}</th>" for c in t["cols"][lang])
                    o = f"<div class='tbl'><table><thead><tr>{head}</tr></thead><tbody>"
                    rows = ["".join(f"<td>{inline(c)}</td>" for c in r[lang]) for r in t["rows"]]
                    title, note = t.get("title"), t.get("note")
                else:
                    t = b["timeline"]
                    ev = t["events"] if isinstance(t, dict) else t
                    o = "<div class='tbl'><table class='tl'><tbody>"
                    rows = [f"<td class='yr'>{inline(e['year'])}</td><td>{inline(pick(e, lang))}</td>" for e in ev]
                    title = t.get("title") if isinstance(t, dict) else None
                    note = t.get("note") if isinstance(t, dict) else None
                if title:
                    out.append((("cap",) + gid, "", "", f"<div class='cap'>{inline(pick(title, lang))}</div>"))
                # a very long row may continue in the next column instead of leaving a gap
                rows = [f"<tr class='long'>{r}</tr>" if len(re.sub(r"<[^>]+>", "", r)) > 260 else f"<tr>{r}</tr>"
                        for r in rows]
                if len(rows) <= 3:  # tiny table: one unit, never split
                    rows = ["".join(rows)]
                for r in rows:
                    out.append((("tbl",) + gid, o, "</tbody></table></div>", r))
                if note:
                    out.append((("note",) + gid, "", "", f"<div class='tnote'>{inline(pick(note, lang))}</div>"))
            else:
                raise ValueError(f"unknown block {list(b)}")
    return out


def tag(body, cid, k):
    """Put the invisible unit marker inside the unit's first text cell."""
    m = f"<span class='u'>@@U:{cid}:{k}@@</span>"
    return re.sub(r"^(<(?:li|h2|div|tr)[^>]*>(?:<td[^>]*>)?)", lambda x: x.group(1) + m, body, count=1)


def render_units(us, cid, lo, hi):
    parts, cur = [], None
    for k in range(lo, hi):
        g, o, c, body = us[k]
        if g != cur:
            if cur is not None:
                parts.append(us[k - 1][2])
            run = next((j for j in range(k, hi) if us[j][0] != g), hi) - k
            if g[0] == "tbl" and run <= 3:  # a short piece of a table never splits (header stays with its rows)
                o = o.replace("<div class='tbl'>", "<div class='tbl keep'>", 1)
            parts.append(o)
            cur = g
        parts.append(tag(body, cid, k))
    if cur is not None:
        parts.append(us[hi - 1][2])
    return "".join(parts)


def render_chapter(ch, lang, newpage, split):
    ui = UI[lang]
    cid = ch["id"]
    us = units(ch, lang)
    cls = "opener newpage" if cid in newpage else "opener"
    parts = [
        f"<div class='{cls}' id='{cid}'><span class='marker'>@@CH:{cid}@@</span>"
        f"<div class='chnum'>{ui['chapter']} {ch['num']}</div>"
        f"<h1>{inline(pick(ch['title'], lang))}</h1>"
        f"<div class='part'>{inline(pick(ch['part'], lang))}</div></div>"
    ]
    k = split.get(cid)
    if k:  # units on the chapter's last page go to a separate (balanced) block
        parts.append(f"<div class='cols'><div class='cstart'></div>{render_units(us, cid, 0, k)}</div>")
        parts.append(f"<div class='cols tail'><div class='cstart'></div>{render_units(us, cid, k, len(us))}</div>")
    else:
        parts.append(f"<div class='cols'><div class='cstart'></div>{render_units(us, cid, 0, len(us))}</div>")
    return "\n".join(parts), len(us)


def css(lang):
    body_font = "'Mukta', 'Poppins'" if lang == "hi" else "'Inter', 'Mukta'"
    size, lh = ("9.6pt", 1.28) if lang == "hi" else ("9pt", 1.3)
    bullet_top = "0.5em" if lang == "hi" else "0.55em"
    fonts = "\n".join(
        f"@font-face{{font-family:'{fam}';src:url('file:///{FONTS.replace(os.sep, '/')}/{file}');font-weight:{w};}}"
        for fam, file, w in [
            ("Poppins", "Poppins-Medium.ttf", 500), ("Poppins", "Poppins-SemiBold.ttf", 600),
            ("Poppins", "Poppins-Bold.ttf", 700), ("Inter", "Inter.ttf", "100 900"),
            ("Mukta", "Mukta-Regular.ttf", 400), ("Mukta", "Mukta-Medium.ttf", 500),
            ("Mukta", "Mukta-SemiBold.ttf", 600), ("Mukta", "Mukta-Bold.ttf", 700),
        ]
    )
    return f"""{fonts}
@page {{
  size: A4; margin: 15mm 11mm 13mm 11mm;
  @bottom-center {{ content: counter(page); font: 600 8pt Poppins; color: #444; }}
}}
@page front {{ @bottom-center {{ content: none; }} }}
* {{ box-sizing: border-box; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ margin: 0; font-family: {body_font}, sans-serif; font-size: {size}; line-height: {lh}; color: #1b1b1b; background: #fff; }}
b {{ font-weight: 600; color: #000; }}
.mut {{ color: #666; font-size: 0.92em; }}
.u {{ font-size: 0.5pt; line-height: 0; color: #fff; white-space: nowrap; }}
.front {{ page: front; break-after: page; }}
.toc h1 {{ font: 700 20pt Poppins; color: {ORANGE}; margin: 0 0 4mm; }}
.toc table {{ width: 100%; border-collapse: collapse; font-size: 10.5pt; }}
.toc td {{ padding: 1.5mm 0; border-bottom: 0.5pt dotted #bbb; }}
.toc td.n {{ width: 22mm; font: 600 9pt Poppins; color: {ORANGE}; }}
.toc td.p {{ width: 14mm; text-align: right; font: 600 9.5pt Poppins; }}
.toc tr.part td {{ font: 700 9pt Poppins; color: #fff; background: {ORANGE}; padding: 1mm 2mm; border: none; }}
.cols {{ column-count: 2; column-gap: 5.5mm; column-rule: 0.4pt solid #e6e6e6; }}
.opener {{ background: {ORANGE}; color: #fff; padding: 2mm 4mm 2mm; border-radius: 1.6mm; margin: 4mm 0 2.4mm; position: relative; break-inside: avoid; break-after: avoid; display: flex; align-items: baseline; gap: 3mm; }}
.opener.newpage {{ break-before: page; }}
main > .opener:first-child {{ margin-top: 0; }}
.opener .chnum {{ font: 600 8pt Poppins; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.95; white-space: nowrap; }}
.opener h1 {{ font: 700 14pt/1.15 Poppins; margin: 0; flex: 1; }}
.opener .part {{ font: 500 7.5pt Poppins; opacity: 0.9; white-space: nowrap; }}
.marker {{ font-size: 1pt; line-height: 1pt; color: {ORANGE}; position: absolute; left: 1mm; top: 0.3mm; }}
h2 {{ font: 600 10.2pt/1.25 Poppins; color: #222; margin: 2.4mm 0 1.3mm; padding: 0.6mm 0 0.6mm 2mm; border-left: 2.2mm solid {ORANGE}; background: #fff4e3; break-after: avoid; break-inside: avoid; }}
.cols > h2:first-child, .cols > .cstart + h2 {{ margin-top: 0; }}
/* a zero-height first child: without it Chrome may push a column block that opens with a heading to the next page */
.cstart {{ height: 0; }}
ul.facts {{ list-style: none; margin: 0 0 1.5mm; padding: 0; }}
ul.facts li {{ position: relative; padding-left: 3mm; margin: 0 0 0.7mm; break-inside: auto; orphans: 2; widows: 2; }}
/* long bullets may continue in the next column (>= 2 lines each side) so columns stay full */
ul.facts li::before {{ content: ""; position: absolute; left: 0.3mm; top: {bullet_top}; width: 1.3mm; height: 1.3mm; background: {ORANGE}; border-radius: 0.3mm; }}
.cap {{ font: 600 8.4pt Poppins; color: {ORANGE}; margin: 0.6mm 0 0.6mm; break-after: avoid; break-inside: avoid; }}
.tbl {{ margin: 0 0 2mm; }}
.tbl.keep {{ break-inside: avoid; }}
.tbl tr {{ break-inside: avoid; }}
.tbl tr.long {{ break-inside: auto; orphans: 2; widows: 2; }}
.tbl tbody tr:first-child {{ break-before: avoid; }}
.tbl thead {{ break-after: avoid; }}
.tbl table {{ width: 100%; border-collapse: collapse; font-size: 0.9em; line-height: 1.22; }}
.tbl th {{ background: {ORANGE}; color: #fff; font-weight: 600; text-align: left; padding: 0.8mm 1.1mm; }}
.tbl td {{ padding: 0.55mm 1.1mm; border-bottom: 0.4pt solid #ecd9bd; vertical-align: top; }}
.tbl tbody tr:nth-child(even) td {{ background: #fff8ee; }}
.tnote {{ font-size: 0.85em; color: #555; margin: -1.4mm 0 2mm; break-before: avoid; break-inside: avoid; }}
.tbl table.tl td {{ border-bottom: 0.4pt solid #eee; }}
.tbl table.tl tr:nth-child(even) td {{ background: transparent; }}
.tbl table.tl td.yr {{ width: 15mm; font: 600 8pt Poppins; color: {ORANGE}; white-space: nowrap; }}
.box {{ border: 0.8pt solid {ORANGE}; border-radius: 1.5mm; padding: 1.3mm 2mm 0.5mm; margin: 0.6mm 0 2mm; background: #fffaf2; -webkit-box-decoration-break: clone; box-decoration-break: clone; }}
.box ul.facts {{ margin-bottom: 0.6mm; }}
.box li.boxh {{ font: 600 8.6pt Poppins; color: {ORANGE}; padding-left: 0; margin-bottom: 0.8mm; break-after: avoid; }}
.box li.boxh::before {{ display: none; }}
"""


def build_html(lang, chapters, pages, newpage, split):
    ui = UI[lang]
    rows, last_part = [], None
    for c in chapters:
        part = pick(c["part"], lang)
        if part != last_part:
            rows.append(f"<tr class='part'><td colspan='3'>{inline(part)}</td></tr>")
            last_part = part
        p = pages.get(c["id"], "")
        rows.append(f"<tr><td class='n'>{ui['chapter']} {c['num']}</td><td>{inline(pick(c['title'], lang))}</td><td class='p'>{p}</td></tr>")
    toc = f"<div class='front toc'><h1>{ui['contents']}</h1><table>{''.join(rows)}</table></div>"
    body, counts = [], {}
    for c in chapters:
        h, n = render_chapter(c, lang, newpage, split)
        body.append(h)
        counts[c["id"]] = n
    doc = (f"<!doctype html><html lang='{lang}'><head><meta charset='utf-8'><title>{ui['book']}</title>"
           f"<style>{css(lang)}</style></head><body>{toc}<main>{''.join(body)}</main></body></html>")
    return doc, counts


def scan(pdf):
    """Opener positions [(cid, page, y)] and unit positions {(cid, k): (page, x, y)}."""
    openers, us = [], {}
    for i, page in enumerate(pdf):
        for w in page.get_text("words"):
            m = OPENER.match(w[4])
            if m:
                openers.append((m.group(1), i, w[1]))
            for m in UNIT.finditer(w[4]):
                us.setdefault((m.group(1), int(m.group(2))), (i, w[0], w[1]))
    return openers, us


def stamp_headers(pdf, lang, chapters, openers):
    """Brand on the left, current chapter on the right, rule below; chapter pages only."""
    ui = UI[lang]
    title = {c["id"]: f"{ui['chapter']} {c['num']} · {pick(c['title'], lang)}" for c in chapters}
    arch = pymupdf.Archive(FONTS)
    base = ("@font-face{font-family:P;src:url(Poppins-Medium.ttf);}"
            "@font-face{font-family:PS;src:url(Poppins-SemiBold.ttf);}"
            "body{font-size:7.5pt;margin:0;}")
    for i in range(openers[0][1], len(pdf)):
        page = pdf[i]
        w = page.rect.width
        # chapter at the top of the page: one whose opener is at the very top, else the last one begun before
        top = [m for m in openers if m[1] == i and m[2] < MARGIN_TOP + 25]
        before = [m for m in openers if m[1] < i]
        cur = (top or before or openers[:1])[-1][0]
        y = 9.5 * MM
        page.insert_htmlbox(pymupdf.Rect(11 * MM, y, w / 2, y + 12),
                            f"<div style='font-family:PS;color:{ORANGE}'>{html.escape(ui['brand'] + ' · ' + ui['book'])}</div>",
                            css=base, archive=arch)
        page.insert_htmlbox(pymupdf.Rect(w / 2, y, w - 11 * MM, y + 12),
                            f"<div style='font-family:P;color:#555;text-align:right'>{html.escape(title[cur])}</div>",
                            css=base, archive=arch)
        page.draw_line((11 * MM, 13 * MM), (w - 11 * MM, 13 * MM), color=(0.95, 0.79, 0.54), width=0.6)


def audit(pdf, openers, newpage):
    """Columns ending well above the bottom margin (not counting the page before a forced break or the book's last page)."""
    report = []
    before_break = {m[1] - 1 for m in openers if m[0] in newpage}
    for i in range(openers[0][1], len(pdf) - 1):
        if i in before_break:
            continue
        page = pdf[i]
        mid, limit = page.rect.width / 2, page.rect.height - MARGIN_BOTTOM
        cols = [0.0, 0.0]
        for w in page.get_text("words"):
            if w[1] > MARGIN_TOP - 2 and w[3] < limit + 2 and not w[4].startswith("@@"):
                k = 0 if w[0] < mid else 1
                cols[k] = max(cols[k], w[3])
        for k, bottom in enumerate(cols):
            gap = (limit - bottom) / MM
            if gap > GAP_REPORT_MM:
                report.append(f"page {i + 1} {'left' if k == 0 else 'right'} column: {gap:.0f} mm empty")
    return report


def render(page, doc, path, pdf_path):
    open(path, "w", encoding="utf-8").write(doc)
    page.goto("file:///" + path.replace(os.sep, "/"), wait_until="load", timeout=300000)
    page.evaluate("document.fonts.ready")
    page.pdf(path=pdf_path, format="A4", print_background=True, prefer_css_page_size=True)  # noqa
    return pymupdf.open(pdf_path)


def layout(page, lang, chapters, hp, raw):
    """Iterate: TOC page numbers, openers pushed off page bottoms, last-page tails split off and balanced."""
    pages, newpage, split = {}, set(), {}
    flips = {}  # chapters whose tail split keeps changing get frozen after two changes (avoids oscillation)
    for it in range(25 + 3 * len(chapters)):
        doc, counts = build_html(lang, chapters, pages, newpage, split)
        pdf = render(page, doc, hp, raw)
        openers, us = scan(pdf)
        h = pdf[0].rect.height
        changed = False
        # settle chapters in order: chapter i's tail decides where chapter i+1's opener lands
        for c in chapters:
            cid, n = c["id"], counts[c["id"]]
            # 1. opener stranded at a page bottom (fewer than MIN_UNITS_UNDER_OPENER of its units on the same
            #    page): start the chapter on a new page
            opener_page = next(pg for c2, pg, _ in openers if c2 == cid)
            under = sum(1 for k in range(n) if us.get((cid, k), (None,))[0] == opener_page)
            if under < MIN_UNITS_UNDER_OPENER and cid not in newpage:
                newpage.add(cid)
                print(f"  [{lang} pass {it + 1}] {cid}: opener moved to a new page", flush=True)
                changed = True
                break
            # 2. the first unit on the chapter's last page starts the balanced tail block
            pos = [us.get((cid, k)) for k in range(n)]
            missing = [k for k, p in enumerate(pos) if p is None]
            if missing:
                raise RuntimeError(f"{cid}: unit markers not found in PDF: {missing[:5]}")
            last, first = pos[-1][0], pos[0][0]
            k = next(k for k, p in enumerate(pos) if p[0] == last)
            want = k if last > first and k > 0 else None
            if want != split.get(cid) and flips.get(cid, 0) < 2:
                flips[cid] = flips.get(cid, 0) + 1
                print(f"  [{lang} pass {it + 1}] {cid}: tail split {split.get(cid)} -> {want}", flush=True)
                if want is None:
                    split.pop(cid, None)
                else:
                    split[cid] = want
                changed = True
                break
        new_pages = {cid: pg + 1 for cid, pg, _ in openers}
        if new_pages != pages:
            pages = new_pages
            changed = True
        if not changed:
            return pdf, openers, newpage
        pdf.close()
    raise RuntimeError("layout did not settle")


def main():
    os.makedirs(OUT, exist_ok=True)
    order = yaml.safe_load(open(os.path.join(HERE, "book.yaml"), encoding="utf-8"))["chapters"]
    only = sys.argv[1:]
    chapters = []
    order = [c for c in order if os.path.exists(os.path.join(CONTENT, f"{c}.yaml"))]  # not written yet: skipped
    for n, cid in enumerate(order, 1):
        if only and cid not in only:
            continue
        ch = yaml.safe_load(open(os.path.join(CONTENT, f"{cid}.yaml"), encoding="utf-8"))
        ch["num"] = n
        chapters.append(ch)
    suffix = "-sample" if only else ""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_default_timeout(600000)
        for lang in ("hi", "en"):
            hp = os.path.join(OUT, f"one-liner-{lang}{suffix}.html")
            raw = os.path.join(OUT, f"one-liner-{lang}{suffix}.raw.pdf")
            pdf, openers, newpage = layout(page, lang, chapters, hp, raw)
            stamp_headers(pdf, lang, chapters, openers)
            out = os.path.join(OUT, f"one-liner-{lang}{suffix}.pdf")
            try:
                pdf.save(out, garbage=3, deflate=True)
            except Exception:  # the previous PDF is open in a viewer (Windows locks it)
                out = out[:-4] + time.strftime("-%H%M%S.pdf")
                pdf.save(out, garbage=3, deflate=True)
            gaps = audit(pdf, openers, newpage)
            print(f"{lang}: {out} {len(pdf)} pages; chapters moved to a new page: {sorted(newpage) or 'none'}")
            for g in gaps:
                print("  GAP", g)
            pdf.close()
            os.remove(raw)
        browser.close()


if __name__ == "__main__":
    main()

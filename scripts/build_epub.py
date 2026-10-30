#!/usr/bin/env python3
"""
Build an EPUB 3 e-book from the Markdown sources in book/english-edition/.

Usage:
    pip install ebooklib markdown
    python3 scripts/build_epub.py                    # -> dist/decode-uttarakhand.epub
    python3 scripts/build_epub.py --out custom.epub

Design notes:
  * Each chapter file opens with TWO H1s ("# CHAPTER 9" then "# Folk Culture..."). Left
    as-is, every chapter produces two top-level TOC entries in an EPUB reader. This
    script collapses them into a single <h1> so the nav TOC has exactly one entry per
    chapter.
  * front-matter/01-table-of-contents.md is intentionally SKIPPED. It is a print
    artifact with unresolved "Page __" placeholders; EPUB readers generate their own
    navigable TOC from the nav document, which this script builds from real content.
  * HTML comment blocks (e.g. the "NOTES FOR AUTHOR (DELETE BEFORE PRINTING)" block on
    the copyright page) are stripped so author-only notes never ship to readers.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

try:
    import markdown
    from ebooklib import epub
except ImportError as exc:  # pragma: no cover
    sys.exit(f"Missing dependency: {exc}.\nRun: pip install ebooklib markdown")

REPO_ROOT = Path(__file__).resolve().parent.parent
EDITION_DIR = REPO_ROOT / "book" / "english-edition"
CHAPTERS_DIR = EDITION_DIR / "chapters"
FRONT_MATTER_DIR = EDITION_DIR / "front-matter"
APPENDIX_DIR = EDITION_DIR / "appendix"

# --------------------------------------------------------------------------------------
# Book metadata (source of truth: front-matter/02-copyright-page.md)
# --------------------------------------------------------------------------------------
TITLE = "Decode Uttarakhand"
SUBTITLE = (
    "Complete General Studies for UKPSC, Lower PCS, RO/ARO "
    "& All Uttarakhand State Examinations"
)
AUTHOR = "UKPSC Decoded"
LANGUAGE = "en"
EDITION = "First Edition, August 2026"
# No ISBN assigned yet. Until one exists, a stable UUID keeps readers/libraries from
# treating each rebuild as a different book. Generated deterministically via
# uuid5(NAMESPACE_URL, "<repo>/book/english-edition/1st") so it never changes.
# Once an ISBN is assigned, replace with "urn:isbn:<13-digit>".
IDENTIFIER = "urn:uuid:3fcdc347-5705-5d42-b6fc-7620b47929e0"

# Part structure per front-matter/01-table-of-contents.md (the source of truth;
# book/README.md's chapter list is stale and off-by-one for Parts C and D).
PARTS: list[tuple[str, str, str, range]] = [
    ("PART A", "History & Culture", "Paper V", range(1, 11)),
    ("PART B", "Polity & Governance", "Paper V", range(11, 15)),
    ("PART C", "Geography", "Paper VI", range(15, 21)),
    ("PART D", "Economy", "Paper VI", range(21, 26)),
    ("PART E", "Disaster Management & HRD", "Paper VI", range(26, 29)),
]

MD_EXTENSIONS = ["tables", "sane_lists", "attr_list", "fenced_code"]

CSS = """
body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.5;
       margin: 0 5%; text-align: left; }
h1 { font-size: 1.6em; line-height: 1.25; margin: 1.2em 0 0.8em; page-break-before: always; }
h1 .chnum { display: block; font-size: 0.55em; letter-spacing: 0.18em;
            text-transform: uppercase; color: #666; margin-bottom: 0.5em;
            font-family: Helvetica, Arial, sans-serif; }
h2 { font-size: 1.25em; margin: 1.5em 0 0.5em; border-bottom: 1px solid #ccc;
     padding-bottom: 0.2em; }
h3 { font-size: 1.08em; margin: 1.2em 0 0.4em; }
h4 { font-size: 1em; font-style: italic; margin: 1em 0 0.3em; }
p { margin: 0.6em 0; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 0.85em;
        page-break-inside: avoid; }
th, td { border: 1px solid #999; padding: 0.4em 0.5em; text-align: left;
         vertical-align: top; }
th { background: #eee; font-weight: bold; font-family: Helvetica, Arial, sans-serif; }
tr:nth-child(even) td { background: #f7f7f7; }
hr { border: 0; border-top: 1px solid #ccc; margin: 1.5em 0; }
blockquote { margin: 1em 1.5em; padding-left: 0.8em; border-left: 3px solid #bbb;
             font-style: italic; }
code { font-family: 'Courier New', monospace; font-size: 0.9em; }
ul, ol { margin: 0.6em 0 0.6em 1.4em; }
li { margin: 0.25em 0; }
/* Part divider pages */
.part-divider { page-break-before: always; text-align: center; margin-top: 30%; }
.part-divider .label { font-size: 0.9em; letter-spacing: 0.3em;
                       text-transform: uppercase; color: #666;
                       font-family: Helvetica, Arial, sans-serif; }
.part-divider h1 { font-size: 2em; page-break-before: avoid; border: 0; margin: 0.4em 0; }
.part-divider .paper { font-size: 0.95em; font-style: italic; color: #444; }
/* Title page */
.titlepage { text-align: center; margin-top: 18%; }
.titlepage h1 { font-size: 2.4em; page-break-before: avoid; margin-bottom: 0.3em; }
.titlepage .subtitle { font-size: 1.05em; font-style: italic; color: #333;
                       margin: 0 8% 2.5em; line-height: 1.4; }
.titlepage .author { font-size: 1.3em; margin-bottom: 0.5em; }
.titlepage .edition { font-size: 0.9em; color: #666; }
"""

HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
CHAPTER_NUM_H1_RE = re.compile(r"^#\s*CHAPTER\s+(\d+)\s*$", re.IGNORECASE | re.MULTILINE)
FILENAME_NUM_RE = re.compile(r"chapter-(\d+)")


@dataclass
class Chapter:
    number: int
    title: str
    body_md: str
    path: Path


def strip_author_notes(text: str) -> str:
    """Remove HTML comment blocks so author-only notes never reach readers."""
    return HTML_COMMENT_RE.sub("", text)


def md_to_html(text: str) -> str:
    return markdown.markdown(text, extensions=MD_EXTENSIONS, output_format="xhtml")


def parse_chapter(path: Path) -> Chapter:
    """Split a chapter file into (number, title, remaining body) collapsing the double H1."""
    raw = strip_author_notes(path.read_text(encoding="utf-8"))

    num_match = CHAPTER_NUM_H1_RE.search(raw)
    if not num_match:
        raise ValueError(f"{path.name}: no '# CHAPTER <n>' heading found")
    number = int(num_match.group(1))

    file_num_match = FILENAME_NUM_RE.search(path.name)
    if file_num_match and int(file_num_match.group(1)) != number:
        raise ValueError(
            f"{path.name}: filename says chapter {int(file_num_match.group(1))} but "
            f"heading says CHAPTER {number}. Fix one before building."
        )

    # Everything after the "# CHAPTER n" line
    rest = raw[num_match.end():]

    # The next H1 is the chapter title.
    title_match = re.search(r"^#\s+(.+?)\s*$", rest, re.MULTILINE)
    if not title_match:
        raise ValueError(f"{path.name}: no title H1 after '# CHAPTER {number}'")
    title = title_match.group(1).strip()

    body_md = rest[title_match.end():]
    # Drop a leading horizontal rule / blank run left over from the removed headings.
    body_md = re.sub(r"^\s*(-{3,}\s*)?", "", body_md, count=1)

    return Chapter(number=number, title=title, body_md=body_md, path=path)


def load_chapters() -> list[Chapter]:
    files = sorted(CHAPTERS_DIR.glob("chapter-*.md"))
    if not files:
        sys.exit(f"No chapter files found in {CHAPTERS_DIR}")

    chapters = [parse_chapter(p) for p in files]

    numbers = [c.number for c in chapters]
    duplicates = {n for n in numbers if numbers.count(n) > 1}
    if duplicates:
        sys.exit(f"Duplicate chapter numbers: {sorted(duplicates)}")

    return sorted(chapters, key=lambda c: c.number)


def make_page(book: epub.EpubBook, filename: str, title: str, body_html: str) -> epub.EpubHtml:
    page = epub.EpubHtml(title=title, file_name=filename, lang=LANGUAGE)
    page.content = body_html
    page.add_link(href="style/main.css", rel="stylesheet", type="text/css")
    book.add_item(page)
    return page


def build_title_page(book: epub.EpubBook) -> epub.EpubHtml:
    html = (
        f'<div class="titlepage">'
        f"<h1>{TITLE}</h1>"
        f'<p class="subtitle">{SUBTITLE}</p>'
        f'<p class="author">{AUTHOR}</p>'
        f'<p class="edition">{EDITION}</p>'
        f"</div>"
    )
    return make_page(book, "titlepage.xhtml", TITLE, html)


def build_part_divider(book: epub.EpubBook, label: str, name: str, paper: str) -> epub.EpubHtml:
    slug = label.lower().replace(" ", "-")
    html = (
        f'<div class="part-divider">'
        f'<p class="label">{label}</p>'
        f"<h1>{name}</h1>"
        f'<p class="paper">{paper}</p>'
        f"</div>"
    )
    return make_page(book, f"{slug}.xhtml", f"{label}: {name}", html)


def build() -> tuple[Path, dict]:
    parser = argparse.ArgumentParser(description="Build the Decode Uttarakhand EPUB.")
    parser.add_argument(
        "--out",
        default=str(REPO_ROOT / "dist" / "decode-uttarakhand.epub"),
        help="Output .epub path (default: dist/decode-uttarakhand.epub)",
    )
    args = parser.parse_args()
    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    chapters = load_chapters()

    book = epub.EpubBook()
    book.set_identifier(IDENTIFIER)
    book.set_title(TITLE)
    book.set_language(LANGUAGE)
    book.add_author(AUTHOR)
    book.add_metadata("DC", "description", SUBTITLE)

    css = epub.EpubItem(
        uid="style_main",
        file_name="style/main.css",
        media_type="text/css",
        content=CSS,
    )
    book.add_item(css)

    spine: list = ["nav"]
    toc: list = []

    # ---- Front matter -----------------------------------------------------------------
    title_page = build_title_page(book)
    spine.insert(0, title_page)  # title page before the nav document

    # 01-table-of-contents.md is deliberately skipped (print artifact with "Page __").
    front_matter_files = [
        ("02-copyright-page.md", "Copyright"),
        ("03-how-to-use-this-book.md", "How to Use This Book"),
    ]
    for fname, nav_title in front_matter_files:
        path = FRONT_MATTER_DIR / fname
        if not path.exists():
            print(f"  ! skipping missing front matter: {fname}")
            continue
        html = md_to_html(strip_author_notes(path.read_text(encoding="utf-8")))
        page = make_page(book, f"front-{path.stem}.xhtml", nav_title, html)
        spine.append(page)
        toc.append(epub.Link(page.file_name, nav_title, page.file_name))

    # ---- Chapters, grouped into parts --------------------------------------------------
    by_number = {c.number: c for c in chapters}
    placed: set[int] = set()

    for label, name, paper, rng in PARTS:
        part_chapters = [by_number[n] for n in rng if n in by_number]
        if not part_chapters:
            continue

        divider = build_part_divider(book, label, name, paper)
        spine.append(divider)

        links = []
        for ch in part_chapters:
            body = md_to_html(ch.body_md)
            heading = f'<h1><span class="chnum">Chapter {ch.number}</span>{ch.title}</h1>'
            page = make_page(
                book,
                f"chapter-{ch.number:02d}.xhtml",
                f"{ch.number}. {ch.title}",
                heading + body,
            )
            spine.append(page)
            links.append(epub.Link(page.file_name, f"{ch.number}. {ch.title}", page.file_name))
            placed.add(ch.number)

        toc.append((epub.Section(f"{label}: {name}", href=divider.file_name), links))

    # Any chapter outside the declared part ranges still ships, ungrouped.
    orphans = [c for c in chapters if c.number not in placed]
    if orphans:
        links = []
        for ch in orphans:
            print(f"  ! chapter {ch.number} is outside every PART range in PARTS")
            body = md_to_html(ch.body_md)
            heading = f'<h1><span class="chnum">Chapter {ch.number}</span>{ch.title}</h1>'
            page = make_page(
                book, f"chapter-{ch.number:02d}.xhtml", f"{ch.number}. {ch.title}", heading + body
            )
            spine.append(page)
            links.append(epub.Link(page.file_name, f"{ch.number}. {ch.title}", page.file_name))
        toc.append((epub.Section("Unassigned Chapters"), links))

    # ---- Appendix (optional; directory does not exist yet) -----------------------------
    appendix_files = sorted(APPENDIX_DIR.glob("*.md")) if APPENDIX_DIR.is_dir() else []
    if appendix_files:
        links = []
        for path in appendix_files:
            text = strip_author_notes(path.read_text(encoding="utf-8"))
            heading_match = re.search(r"^#\s+(.+?)\s*$", text, re.MULTILINE)
            nav_title = heading_match.group(1).strip() if heading_match else path.stem
            page = make_page(book, f"appendix-{path.stem}.xhtml", nav_title, md_to_html(text))
            spine.append(page)
            links.append(epub.Link(page.file_name, nav_title, page.file_name))
        toc.append((epub.Section("Appendix"), links))

    book.toc = tuple(toc)
    book.spine = spine
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    epub.write_epub(str(out_path), book)

    stats = {
        "chapters": len(chapters),
        "parts": sum(1 for label, _, _, rng in PARTS if any(n in by_number for n in rng)),
        "appendix_files": len(appendix_files),
        "words": sum(len(c.body_md.split()) for c in chapters),
        "spine_items": len(spine),
    }
    return out_path, stats


if __name__ == "__main__":
    path, stats = build()
    size_kb = path.stat().st_size / 1024
    print(f"\n  Built: {path}")
    print(f"  Size:  {size_kb:,.0f} KB")
    print(
        f"  {stats['chapters']} chapters in {stats['parts']} parts, "
        f"{stats['appendix_files']} appendix file(s), "
        f"~{stats['words']:,} words, {stats['spine_items']} spine items"
    )
    if stats["appendix_files"] == 0:
        print(
            "\n  NOTE: no appendix/ directory yet, but the TOC promises Appendix A/B/C.\n"
            "        Create book/english-edition/appendix/*.md and they will be picked up."
        )

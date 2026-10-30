# Decode Uttarakhand — Complete General Studies

**By UKPSC Decoded**

> For UKPSC (PCS/ACF/RFO), Lower PCS, RO/ARO, UKSSSC, Patwari, Lekhpal & All Uttarakhand State Examinations

## Book Structure

- **28 Chapters + Appendix**
- **Two Editions**: English & Hindi (separate books)
- **Coverage**: Prelims + Mains (Paper V & VI)

## Repository Structure

Present today:

```
book/
└── english-edition/
    ├── chapters/          # All 28 chapters (written, ~79,000 words)
    └── front-matter/      # 01-table-of-contents, 02-copyright-page, 03-how-to-use-this-book
```

Planned but **not yet created** (the build script picks `appendix/` up automatically once it exists):

```
book/
├── english-edition/
│   └── appendix/          # Appendix A/B/C — referenced by the TOC, no source files yet
├── hindi-edition/         # Not started
└── resources/
    ├── pyqs/
    ├── raw-content/
    └── images/
```

## Chapter List

### PART A: History & Culture (Paper V)
1. Prehistoric & Proto-historic Period
2. Ancient Dynasties — Kartikeyapur, Katyuri & Parmar
3. Chand Dynasty & Gorkha Invasion
4. British Rule in Uttarakhand
5. Tehri State
6. National Movement & Freedom Fighters
7. People's Movements & Social Reformers
8. Society — Family, Marriage, Caste System
9. Folk Culture — Songs, Dance, Art, Instruments
10. Religious Places, Temples, Fairs & Festivals

### PART B: Polity & Governance (Paper V)
11. Political System — Governor, CM, Legislature, Parties
12. Administrative System — Govt Structure, UKPSC, High Court
13. Local Self-Government — Panchayati Raj, Urban Bodies
14. Good Governance & Public Policy

### PART C: Geography (Paper VI)
15. Physical Geography — Part 1 (Structure, Climate, Rivers)
16. Physical Geography — Part 2 (Soils, Vegetation, Glaciers)
17. Resources & Agriculture
18. Industry, Transport & Energy
19. Tourism, National Parks & Wildlife
20. Population, Migration & Urbanization

### PART D: Economy (Paper VI)
21. Economy — Features, GSDP, Income Sources
22. Industrial Development & MSME
23. Infrastructure
24. Economic Planning, Budget & Public Finance
25. Major Economic Problems & Welfare Programs

### PART E: Disaster Management & HRD (Paper VI)
26. Disaster Management
27. Education & Human Resource Development
28. Health

### Appendix
- Uttarakhand Current Affairs Capsule (2024-2026)
- Data at a Glance
- Quick Facts

## Building the E-book

```bash
pip install ebooklib markdown
python3 scripts/build_epub.py          # -> dist/decode-uttarakhand.epub
```

The script reads `book/english-edition/` and produces a validated EPUB 3 file. It:

- collapses each chapter's two `# ` headings into one, so readers show a single TOC entry per chapter;
- groups chapters into Parts A–E and generates a title page and part dividers;
- strips HTML comment blocks, so author-only notes never ship to readers;
- skips `front-matter/01-table-of-contents.md` (a print artifact with unresolved `Page __` placeholders) and lets the reader build its own navigation instead;
- fails the build if a filename's chapter number disagrees with its `# CHAPTER n` heading, or if two chapters share a number.

Optional validation with [EPUBCheck](https://github.com/w3c/epubcheck):

```bash
java -jar epubcheck.jar dist/decode-uttarakhand.epub
```

The current build passes with 0 errors and 0 warnings against EPUB 3.3 rules.

## Production Status

| Item | English | Hindi |
|---|---|---|
| Ch. 1–28 — written | ✅ Done (~79,000 words) | Not started |
| Chapter numbering / section numbering | ✅ Verified consistent | — |
| EPUB build | ✅ Passes EPUBCheck, 0 errors | — |
| Appendix A/B/C | ❌ Referenced in TOC, no source files | Not started |
| Cover image | ❌ Not created | — |
| ISBN | ❌ Not assigned | — |
| Per-chapter study aids | ⚠️ See note below | — |

> **Note on per-chapter study aids.** `front-matter/03-how-to-use-this-book.md` tells the
> reader that *every* chapter contains a Syllabus Coverage line, an Exam Priority Rating,
> Key Fact boxes, Exam Tips and end-of-chapter One-Liners. In the current content, Key Fact
> boxes appear in 7 of 28 chapters and the other four elements appear in none. Either add
> these blocks or amend the "How to Use This Book" page — as written, the book contradicts
> itself on its own first page.

## Timeline

- **Target Launch:** 10 days from project start
- **English Edition:** Produced first
- **Hindi Edition:** Adapted from English (natural Hindi, not literal translation)

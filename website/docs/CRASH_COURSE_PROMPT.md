# Prompt for a new chat: Uttarakhand one-liner book + crash course content

Copy everything below the line into a NEW Claude Code session started on the
owner's laptop, inside `C:\Users\<you>\Documents\Ukpscdecoded` (the question
workbooks are only on the laptop, in `test series questions/`, git-ignored).

---

You are helping me (owner of UKPSC Decoded, www.ukpscdecoded.in) build content
for my UKPSC crash course. I am not a developer: explain steps plainly, one
command per line, Windows PowerShell (`npm.cmd`, `npx.cmd`). Read `CLAUDE.md`,
`website/docs/HANDOFF.md` and `website/content/crashCoursePlan.json` first.

## Rules
- The GitHub repo is PUBLIC. Never commit question data, `.xlsx`, `.csv`,
  generated books/PDFs or scripts' outputs that contain questions. Put every
  output in a new folder `content-output/` and add it to `.gitignore` first.
- Never invent facts, dates, numbers or names. Every fact must come from my
  question workbooks or my book. If a source looks wrong or doubtful, list it
  in a "To verify" sheet for me instead of guessing.
- Ask me before anything costs money or publishes anything.
- First confirm with me what I mean by "my 5 lessons" (see Task 2) before
  starting Task 2.

## Background (already decided)
- Exam: UKPSC Upper PCS Prelims, 29 November 2026. My 60-day plan runs
  1 Oct → 29 Nov; the crash course runs **5 October → 18 November 2026**:
  50 videos (2–3 a day, dates in `website/content/crashCoursePlan.json`),
  6 live sessions on Wednesdays (14, 21, 28 Oct; 4, 11, 18 Nov), revision +
  mocks 19–29 Nov.
- My book: **Uttarakhand Decoded / उत्तराखंड डिकोडेड** (English and Hindi
  editions), 28 chapters + 2 appendices:
  Part A History & Culture (Paper V): 1 Prehistoric & Proto-historic Period,
  Ancient Tribes and Early Political Powers · 2 Ancient Dynasties —
  Kartikeyapur, Katyuri & Parmar · 3 Chand Dynasty & Gorkha Invasion ·
  4 British Rule in Uttarakhand · 5 Tehri Princely State · 6 National
  Movement & Freedom Fighters · 7 People's Movements, Social Reformers &
  Statehood · 8 Society of Uttarakhand — Family, Marriage, Caste System ·
  9 Folk Culture — Songs, Dance, Art, Instruments · 10 Religious Places,
  Temples, Fairs & Festivals.
  Part B Polity & Governance (Paper V): 11 Political System — Governor, CM,
  Legislature, Parties · 12 Administrative System — Govt Structure, UKPSC,
  High Court · 13 Local Self-Government — Panchayati Raj & Urban Bodies ·
  14 Good Governance & Public Policy.
  Part C Geography (Paper VI): 15 Physical Geography Part 1 (Structure,
  Climate, Rivers) · 16 Physical Geography Part 2 (Soils, Vegetation,
  Glaciers) · 17 Resources & Agriculture · 18 Industry, Transport & Energy ·
  19 Tourism, National Parks & Wildlife · 20 Population, Migration &
  Urbanization.
  Part D Economy (Paper VI): 21 Economy — Features, GSDP, Income Sources ·
  22 Industrial Development & MSME · 23 Infrastructure · 24 Economic
  Planning, Budget & Public Finance · 25 Major Economic Problems & Welfare
  Programs.
  Part E Disaster Management & HRD (Paper VI): 26 Disaster Management ·
  27 Education & Human Resource Development · 28 Health.
  Appendix A Uttarakhand Current Affairs Capsule (2024–2026) · Appendix B
  Data at a Glance.
  Hindi chapter names: use the ones in `content-output` once I confirm them
  against my Hindi edition (draft translations exist in my 60-day planner).
- Uttarakhand videos and their book chapters (from crashCoursePlan.json):
  V2 Glaciers, Rivers, Prayags [Ch 15, 16] · V3 Passes, Valleys, Bugyals,
  Doons/Tarai/Bhabar [Ch 15] · V4 National Parks & Sanctuaries [Ch 19] ·
  V5 Biosphere Reserves, Ramsar, Lakes [Ch 19] · V6 District Data [Ch 20,
  App B] · V9 Katyuri & Parmar [Ch 1, 2] · V10 Chand & Panwar + Inscriptions
  [Ch 3, 5] · V11 Gorkha, Sugauli, British Admin [Ch 3, 4] · V14 Movements I
  [Ch 7] · V15 Movements II [Ch 7] · V16 1857 incl. UK's role [Ch 6] ·
  V18 Statehood facts, First officials, Governors & CMs [Ch 11] · V19 State
  symbols & Legislature [Ch 11] · V21 Panchayati Raj [Ch 13] · V22 13
  Districts [Ch 12] · V23 Commissions & Committees [Ch 12, 14] · V24 Tribes,
  PVTG, Fairs & Festivals [Ch 8, 10] · V25 Folk dances, Art, Religious sites
  [Ch 9, 10] · V26 Literary figures, Freedom fighters, Reformers, Languages
  [Ch 6, 9] · V29 Dams, Hydro, GSDP [Ch 18, 21, 23] · V30 Tourism, Crops
  [Ch 17, 19] · V33 Industrial areas, SEZs, Minerals [Ch 17, 18, 22, 23] ·
  V40 UK Current Affairs — schemes, disaster mgmt, awards [Ch 25, 26, App A]
  · V41 UK Budget + Economic Survey [Ch 24, 25] · V50 Final integrated CA
  [App A]. (25 Uttarakhand videos = the separate "Uttarakhand Crash Course"
  product, ₹1,899.)
- PYQ trackers (my files): Uttarakhand clusters C1 Wildlife & Protected
  Areas · C2 District comparisons · C3 Geography · C4 Tribes & Culture ·
  C5 Dynasties & Inscriptions · C6 State formation & Governance · C7 Economy
  · C8 Movements · C9 Current affairs & schemes · C10 Literature &
  personalities. CRITICAL clusters: C1, C2, C5, C8.
- Question sources (in `test series questions/`, read only, never edit
  without a backup): `MERGED_QUESTION_BANK_v2.xlsx` (master; skip rows with
  a Review_Flag), `Uttarakhand STATIC _Question_Bank.xlsx`,
  `UKPCS_Master_Question_Bank_CLEAN.xlsx`, `UTTARAKHAND_TEST_STRUCTURE.xlsx`,
  `GENERATED_QUESTIONS.xlsx`, `COMBINED_QUESTIONS.xlsx`. Columns include
  Question_ID, Subject, Chapter_Code, Question_Type, Correct_Answer,
  Difficulty, Source fields; question/option cells are "English / Hindi".
  `website/scripts/question-bank-common.mts` already knows how to read and
  split them — reuse its helpers.

## Task 1 — Uttarakhand one-liner book (A4, print-ready)
1. Collect every Uttarakhand question (Subject = Uttarakhand GK, or UK
   chapter codes) from all sources. Drop Review_Flag rows. Remove exact and
   near duplicates (same fact asked twice) — keep one.
2. Turn each MCQ into ONE fact sentence without options, using the correct
   answer: "Which is the smallest tribe?" → "Raji is the smallest tribe of
   Uttarakhand." Statement-type ("Which of these is/are correct") questions
   become the true statements only. Keep it short (one line where possible).
3. Group the one-liners by my 28 book chapters (Part A–E order), sub-headed
   by topic, with the PYQ cluster tag (e.g. C5) and a ★ on facts from
   CRITICAL clusters or facts that appeared in actual past papers.
4. LAST section: **Uttarakhand Current Affairs only** (2024–2026, no
   national CA), grouped by month or theme (schemes, appointments, awards,
   sports, disasters, budget, reports).
5. Two editions: English and Hindi (from the Hindi side of each question;
   where Hindi is missing, list it in "To verify", don't machine-translate
   silently).
6. Output: a spreadsheet `UK_ONE_LINERS.xlsx` (one row per fact: ID, chapter,
   topic, cluster, English, Hindi, source Question_IDs) for my checking, then
   print-ready **A4 PDFs** (book interior: title page, contents with page
   numbers, chapter headings, numbered facts, 2 columns, header with chapter
   name, footer "Uttarakhand Decoded — One-Liners · page n", 15 mm margins,
   readable 10–11 pt, Hindi rendered properly — build HTML and print with
   Chromium/Playwright, NOT reportlab, so Devanagari shapes correctly).
   Show me a 5-page sample before building the full book.
7. Report: total facts per chapter, duplicates removed, "To verify" count.

## Task 2 — Crash course lesson content (after Task 1)
First ask me: "Which 5 lessons?" (I may mean 5 specific Uttarakhand videos,
or 5 per week). Then, for each lesson I name, from the one-liners + my book
chapter + PYQ trackers:
- **Video script, 40 minutes**, Hinglish (Hindi sentences in Roman script with
  English terms), in this shape: 0–2 min hook (one PYQ asked in the exam) ·
  2–5 min what UKPSC asks from this topic (cluster + years) · 5–32 min
  teaching in 4–6 blocks, each ending with one PYQ-style question to pause on
  · 32–37 min traps & confusing pairs (e.g. Govind Sanctuary 1955 vs
  National Park 1989) · 37–40 min 10-question rapid revision + which book
  chapter to read today + the test of the day from my 60-day plan.
  Mark [SLIDE n] and [SHOW MAP/TABLE] cues in the script.
- **Slides** for the video (16:9) matching the script cues.
- **Free PDF** (A4, 2–4 pages, Hindi + English) per lesson: key facts table,
  10 one-liners, 5 PYQs with answers, "read Ch X of Uttarakhand Decoded" and a
  link to www.ukpscdecoded.in — this is the free lead magnet, so no full
  book content.
- **Lesson PDF notes** for paid students (longer: all one-liners of that
  lesson's chapters).
Keep dates consistent with `crashCoursePlan.json` (videos 5 Oct → 18 Nov).

## Done means
Files in `content-output/` (not committed), a short summary per file, the
"To verify" list, and `website/docs/HANDOFF.md` updated with what was made
(no question content in it).

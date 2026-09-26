# Next tasks — test series polish, courses page, theme (for local Claude Code)

Written 25 Sep 2026 from the owner's review of the live test flow. Work on
branch `claude/wizardly-cannon-rkvbbd` (run `git pull` first). Read
`website/docs/PROGRESS.md` for how everything works. Conventions: SQL goes in
`website/supabase/*.sql` files for the owner to run (idempotent, no
DROP/DELETE/TRUNCATE); type check (`npx.cmd tsc --noEmit` in `website`) must
be clean; test at 375 / 768 / 1280 px; never commit `.xlsx`/`.csv` (public
repo). Commit + push to the same branch after each batch so work isn't lost;
update PROGRESS.md each batch. Stop and ask only if something is genuinely
ambiguous — otherwise decide, and list decisions at the end of the batch.

Do the batches in order. Each batch should fit in one session.

---

## Batch 1 — Test-taking fixes (highest priority)

1. **Negative marking is 1/4, not 1/3.** Every test: 0.25 of the marks per
   question. SQL file to set `tests.negative_marking_value = 0.25` for all
   tests; change the default in the admin test builder
   (`src/app/test-platform/admin/tests/page.tsx`, `src/app/api/admin/tests/route.ts`)
   and the loader (`scripts/load-question-bank.ts`) from 0.33 to 0.25; fix
   every text that says 0.33 / "one-third" / 24.8% (break-even becomes 20% —
   it's computed in `src/lib/analysis.ts`, check the copy around it), the
   instructions page, refund/terms if mentioned.
2. **Broken option split (data bug).** Screenshot Q133: options show as
   `मीटर प्रति दशक / 100 meters per decade / 100` — the Hindi part lost its
   number. `splitOption()` in the loader splits "English / Hindi" cells at the
   wrong " / " for numeric options. Fix it, then add a check that flags any
   question where the English option has a number the Hindi option lacks (or
   vice versa), re-run the loader dry run, then `--apply` (it upserts, safe).
3. **Report a mistake.** A small "Report error / गलती बताएँ" button on each
   question in the result review → table `question_reports` (question id,
   user id, attempt id, reason, note, status) → admin page listing open
   reports with the question, its answer key and explanation, and actions:
   resolve / deactivate question (`questions.status = 'inactive'`; inactive
   questions must be excluded from new attempts but past results still
   render). Example to check: Q134 "first Cyber Police Station in
   Uttarakhand" — answer key 2015 looks doubtful.
4. **Language on the exam and result screens.**
   - Instructions page: all points in English as one list, then all points in
     Hindi as a separate list — not mixed line by line.
   - Result/answer review: show the question and options in the student's
     chosen language (the same हिंदी/EN toggle as the exam, remembered in
     localStorage) instead of both at once. If both must show, English on its
     own line in a clearly readable colour (not dim grey), visually separate
     from the Hindi.
   - Make the हिंदी / EN toggle on the exam screen bigger and more obvious
     (min 44px tap target, clear active state).
5. **Readability everywhere.** Secondary text is too dim (e.g. the grey
   "/ Our Courses" and grey card text). Raise all body/secondary text on dark
   backgrounds to at least WCAG AA 4.5:1 (e.g. slate-300 or lighter instead
   of slate-400/500 for anything a student must read). Placeholder-level
   grey only for truly decorative text.

## Batch 2 — Question quality & test composition (re-run the loader)

Data is in `test series questions\` (not in git). Owner feedback: Uttarakhand
test quality is not good enough.

1. **Prefer better sources.** Questions whose `Source_File` is the chapter 1,
   chapter 2 or chapter 3 file are lower quality. In the loader, use every
   other source first and fall back to chapter 1/2/3 questions only when a
   test can't be filled otherwise; report how many chapter 1/2/3 questions
   each test still uses. Show the owner the Source_File list with counts
   first so they can confirm which files are "chapter 1/2/3".
2. **More statement and match formats in Uttarakhand tests.** The UK pool has
   ~2,500 spare questions. Raise the share of statement-type ("1 only / 2 only
   / both / neither") and match-the-following questions in the 20 Uttarakhand
   tests to ~45–50%, and re-format more UK direct questions into those
   formats where the fact supports it (same care as before: bilingual, one
   correct answer, verified facts, new IDs so nothing already live changes).
3. **Current affairs tests with real names.** Replace "Current Affairs Set
   1–8" with theme-based tests built from what the bank actually has, e.g.
   National Affairs, International Relations & Summits, Uttarakhand Current
   Affairs, Economy & Budget, Schemes & Reports/Indices, Science & Tech /
   Defence / Space, Environment & Awards, Sports & Persons in News, plus mixed
   monthly revision if enough dated questions exist. Check counts first,
   propose the list, then build. Update `tests.test_name` and `tests.subject`
   via the loader.
4. **Question bank browser for the owner** (admin page): search and filter
   questions by section, chapter, Source_File, difficulty, format, status, and
   "used in test X / unused"; view the full bilingual question; deactivate. Store
   `Source_File` in the database (new column `questions.source_file`, set by
   the loader) so filtering by source works. The owner wants to use this to
   tell you which questions to prefer.
5. **One free sample test for everyone:** a "Free Sample Mock" (50 questions,
   benchmark mix) built from questions NOT used in any paid test, with
   `is_free_test = true`, shown on the home page ("Free Sample Test" section
   currently says Coming soon) and on the course pages.

## Batch 3 — Courses page & course detail (done 25 Sep 2026 — see PROGRESS.md)

1. **Card header:** the big empty gold gradient block on every course card
   and on the course detail hero wastes space. Put the course name and a
   one-line, very plain "what you get" inside it in large text, e.g.:
   - CRASH COURSE — 50 videos + live sessions + PDF notes
   - PREMIUM TEST SERIES — 12 Full Mocks + 12 Sectional + 20 Uttarakhand + 12 Current Affairs + 6 CSAT
   - COMPLETE PRELIMS PACK — Crash Course + Premium Test Series
   - MENTORSHIP — Everything + weekly 1-on-1 with Bhanu Joshi
   Show `image_url` if set, otherwise this text header.
2. **Group the store** (`/courses`): top section "Premium plans" with the 3
   main choices side by side and visually distinct (Complete Prelims Pack —
   Most Popular, Premium Test Series, Mentorship), then Crash Course, then a
   lower section "Standalone test series" for the smaller packs (Basic,
   Uttarakhand Intensive, etc.). Goal: a student instantly sees the
   difference and picks one.
3. **Tabs inside the test series:** on the course detail test list and on
   `/test-platform/course/[slug]`, tabs: Full Length · Sectional · Uttarakhand ·
   Current Affairs · CSAT (from `tests.subject`), instead of one long page.
4. **Free content per course:** 1 free test (above) + 2 free videos on the
   test series/crash course pages: an orientation & exam-strategy video and
   one content video. Until Bunny is set up, allow a YouTube video ID per
   course in `packages.metadata.demo_videos` (array of {title, youtube_id})
   and render them in the existing "Watch free demo" section.
5. Home page copy says "66+ tests" — make it match the real count (62).

## Batch 4 — Site-wide design & navigation (done 26 Sep 2026 — see PROGRESS.md)

1. **Theme:** the portal's blue-slate dark theme doesn't match the public
   site's graphite + saffron and doesn't feel premium. Move the whole student
   portal (`/test-platform/*`, `/courses`, `/checkout`, login) to one premium
   dark theme: near-black/graphite neutrals (no blue tint), gold/saffron
   accent, one accent for success/danger, generous spacing, consistent card
   style. Define the colours once (Tailwind theme tokens) and use them
   everywhere instead of hard-coded `slate-*`.
2. **One language for the interface:** switch the website and platform UI to
   English only (login, navigation, buttons, headings, dashboard). Hindi stays
   where it matters: the questions/options/explanations, the exam and result
   language toggle, and the Hindi book edition link. Remove "हिंदी / English"
   doubled labels elsewhere.
3. **Home page:** the quick-links row (Paid Courses · Test Series · E-Books ·
   Daily MCQ — see the old section under the hero) should be near the top and
   link to all paid products: Crash Course, Test Series, Books (English +
   Hindi), E-Books, Mentorship.
4. **Navigation keeps everything reachable:** Home, Courses, Test Series,
   Books, Free Content in the bar; "More" must include Articles, Daily Current
   Affairs & MCQ, PYQ Tracker, E-Books, About, Contact. Check every old page is
   reachable from the navbar or footer and nothing 404s.
5. **Carousel:** it must auto-slide (every ~5s, pause on hover/touch, respect
   reduced-motion), swipe on mobile, dots. Add optional `banners.image_url`
   (+ `image_url_mobile`) so the owner can upload designed banners (desktop
   1920×600, mobile 1080×1080, JPG/WebP < 200 KB) to Supabase Storage; fall back
   to the current text banner when empty. Document the sizes in PROGRESS.md.

## After these batches (not now)

Bunny Stream video player + watch tracking (refund rule: <3 videos), live
class section (YouTube Live unlisted inside enrolled course page), admin
course-content editor, mentorship intake/weekly report forms, mobile app.

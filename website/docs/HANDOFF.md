# Handoff — state of UKPSC Decoded (17 Nov 2026)

Written at the end of the cloud Claude Code sessions, so work can continue in
the owner's local terminal. Keep this file current: add to "Done" and trim
"Open" as things land.

## Lower PCS + RO/ARO relaunch (17 Nov 2026, branch `lower-pcs-relaunch`)
The site is now organised by exam: **Lower PCS & RO/ARO** (`/lower-pcs`, main),
**TRI** (`/tri`), **Upper PCS** (`/upper-pcs`) and **Subject Packs** (`/subject-packs`, metadata tab key still `individual`).
The top menu has one entry per exam; `/courses` and `/test-series` list every
product grouped by exam.

- **SQL:** `supabase/schema-phase47-lower-pcs-relaunch.sql` (run BEFORE merging)
  creates the products, copies the Crash Course lessons into the Lower PCS Crash
  Course (same video ids + PDFs, "Video N" dropped from titles, `lessons.section`
  headings) and adds "Coming soon" placeholders (lessons without a video, tests
  with 0 questions). `supabase/schema-phase47b-upper-2027.sql` runs on **30 Nov**:
  Crash Course → Upper PCS Video Revision Program ₹2,499, Complete Prelims Pack →
  Upper PCS 2027 Complete ₹3,599, Premium → Upper PCS 2027 Test Series ₹1,499.
- **Phase 47c** (`supabase/schema-phase47c-revision-tests-only-in-revision.sql`, 17 Nov):
  Uttarakhand / CA Revision tests belong ONLY to the Revision Test Series (made from
  Premium questions, so they'd repeat elsewhere); Basic Test Series off the store;
  Lower PCS Test Series is 67 tests (44 live day one).
- **Phase 47d** (17 Nov): "2026" kept in Revision Test Series 2026 and All Uttarakhand Rank
  Challenge 2026 (owner's wish: shows they are for the 2026 exam). `separate_total` also
  drives "Save X%" on course pages; `false` = no saving shown (bundles of unsold parts).
- **Store listing lives in `packages.metadata`:** `exam_tab` (lower / tri / upper /
  individual), `listed` (false = hidden from lists, page + access still work),
  `sale_ends_at` (hidden and not buyable after it), `card_label` (chip on the card),
  `separate_total` ("bought separately" line). Never set `is_active = false` to hide
  a product: buyers would lose access.
- **Bundles inside bundles** now grant access (3-Exam Complete → Lower PCS Complete →
  CSAT → its classes and tests): `getOwnedPackageIds` expands until nothing new.
- **Section subsets** (`src/lib/course-subsets.ts` `SECTION_SUBSETS`): CSAT Classes and
  Current Affairs 2026 videos show Part E / Part D of the Lower PCS Crash Course, so
  those videos are uploaded once, to the Lower PCS Crash Course.
- **Filling placeholders:** edit the placeholder lesson in Admin → Lessons and add the
  YouTube/Bunny id + PDFs. A new lesson takes the section of the lesson above its sort
  order: for a new current affairs video use sort order 650, 660 … (Part D is 600–640).
  Tests: load questions into the placeholder test (fixed ids in phase 47).
- Course pages show the lesson outline (sections, "Coming soon") for the new courses
  and the release calendar only for the old Crash Course family; test lists show every
  test by title with "Coming soon" on empty ones. CSAT tests go to the CSAT tab even
  when named "Sectional".

## Live now (www.ukpscdecoded.in)
- **Store:** Courses page (crash course, crash course + test series
  bundles, mentorship) and Test Series page (all test series, bundles,
  mentorship). Razorpay live checkout with coupons; `PAYMENTS_ENABLED=true`.
- **Test platform:** email-code login (sessions last until 31 Dec 2026, 2
  devices max), 57 tests + Free Sample Mock, analysis, XP/streaks,
  mentorship booking, admin tools (`/test-platform/admin`).
- **Second round, 17 Nov (white student area, new cards, menus, WhatsApp
  login, cached pages):**
  - **Whole site white.** `src/app/test-platform/layout.tsx` no longer has
    `theme-dark`, so My Courses, the test screen, results and Admin are
    white too (only the footer stays dark). To go back, add `theme-dark` to
    that div. The test screen's question drawer and submit box now sit above
    the top menu (they were partly hidden behind it on phones).
  - **Home toppers** (`HomeToppers.tsx`): only the top 3 names and districts
    of the latest Rank Challenge mock, no scores, no student count, no link
    to the full list; shown after "Our Courses".
  - **Product cards** (`CourseCard.tsx` + `CourseCardActions.tsx`): white
    card, coloured strip and kind label, price with the old price struck out
    and "% off", Buy Now + Details.
  - **Menu** (`Navbar.tsx`): Courses, Test Series and Books open a list.
    Courses and Test Series are filled from the active packages (the layout
    passes them in); Books lists the guidebook and the Polity Decoded e-book.
    The desktop menu now starts at 1280 px; smaller screens get the phone menu.
  - **WhatsApp login** (off until set up): with `AISENSY_API_KEY` and
    `AISENSY_CAMPAIGN_OTP` in Vercel, the login page shows a WhatsApp tab
    first and Email second. The code is stored in `login_codes` with
    `wa:91XXXXXXXXXX` in the email column (no SQL needed). A number saved on
    exactly one account logs into it; a new number asks for name + email and
    makes an account; a number on two accounts, or an email that already has
    an account, is told to use email login. Steps: `docs/WHATSAPP_AUTOMATION.md`.
    Not tested against a real AiSensy account.
  - **Cached public pages.** The root layout reads no cookies and has
    `revalidate = 300`, so home, /courses, /test-series, books, articles,
    answer key etc. are served from Vercel's cache (rebuilt at most every
    5 minutes: a price or banner change can take 5 minutes to show). The
    browser works out login state: readable cookie `ukd_in` (set at login,
    no identity in it) plus `/api/me` (logged in? owned package ids),
    see `src/lib/session-client.ts`. Still run on every visit: student
    area, checkout, /revision, /mahasangram, /courses/[slug] (they show
    personal prices or "Purchased").

- **Toppers, answer key, WhatsApp, Clarity (17 Nov):**
  * Home shows the top 5 of the latest published Rank Challenge mock
    (`HomeToppers.tsx`, cached 10 min; hidden until a result is out).
  * `/answer-key`: until the key is published it collects name + mobile +
    district into `mock_registrations` (source `answer-key`, email saved as
    ""; Admin → Mock Registrations). On exam evening fill the sets in
    `content/answerKey.json` (one letter per question, X = ignore), set
    `"published": true`, merge: the score calculator appears. **Owner to
    confirm** the 150 questions / 1 mark / 0.25 negative values in that file.
  * WhatsApp through AiSensy (`src/lib/whatsapp.ts`): "payment received"
    after `completeOrder`, and a mock-day reminder from the 8 am
    `telegram-mcq` cron (`src/lib/mockReminders.ts`). Both are OFF until
    `AISENSY_API_KEY` + `AISENSY_CAMPAIGN_PAYMENT` / `AISENSY_CAMPAIGN_MOCK_DAY`
    are set in Vercel. Owner steps and template text: `docs/WHATSAPP_AUTOMATION.md`.
    The AiSensy call has not been tested against a real account yet.
  * Microsoft Clarity loads only when `NEXT_PUBLIC_CLARITY_ID` is set
    (`Clarity.tsx`); the Privacy Policy mentions it.
  * Still to do after 25 Nov: WhatsApp-code login, static public pages
    (fewer Vercel calls), student area in the light theme.
- **Hindi / English switch (17 Nov):** a हिंदी / EN button in the top bar
  (`SiteLangToggle.tsx`). Text written as `<T en="…" hi="…" />` (`T.tsx`)
  is in the page in both languages and CSS shows one (`<html data-lang="hi">`,
  set before paint by the inline script in `layout.tsx` from localStorage
  `ukd-site-lang`, or Hindi when the phone's language is Hindi). No cookie,
  so it works on static pages. Translated so far: menu, home chooser and
  tiles, `/revision`, `/mahasangram`, BuyBox, timetable labels, Buy Now /
  Know more buttons, login, checkout. Product names and text that come from
  the `packages` table are still English only. Checkout also shows a
  "secure payment by Razorpay / WhatsApp help" line.
- **Light theme (17 Nov):** the public site and store are now light (white
  cards on a soft off-white page); the student area under `/test-platform`
  (dashboard, tests, results, admin) and the footer stay dark. No page
  classes were rewritten: `src/app/globals.css` remaps the dark-surface
  utilities (`bg-graphite-600..950`, `border-graphite-500..950`,
  `text-graphite-50..500`, `text-white`, pale saffron/jade/danger text) to
  `--ui-*` variables. `.theme-dark` on a wrapper restores the dark values
  (`src/app/test-platform/layout.tsx`, `Footer.tsx`); `.on-color` keeps white
  text on a coloured tile, photo or gradient set by inline style. To make
  the student area light too, remove `theme-dark` from that layout and check
  the test screen. Local preview without the database: a small mock of the
  Supabase REST API is enough for the public pages.
- **Audit quick wins (17 Nov):** the "Which one is for me?" chooser
  (`src/components/final-month/WhichOne.tsx`, now with Hindi lines) is the
  first thing under the home carousel till 29 Nov; the free sample test sits
  above "Our Courses"; home quick-link tiles take an optional Hindi line
  (`labelHi` in `content/home.json`); `/mahasangram` and `/revision` mention
  the free Warm-up Mock only while it is open (otherwise the next mock date);
  small grey text on the store, checkout and final-month pages is one step
  brighter. Full audit and the December list (light theme, Hindi store
  pages, WhatsApp login): project file `website-audit/website-audit.md`.
- **Buy Now everywhere (12 Nov):** every product tile and card has a
  Buy Now button (straight to `/checkout/<slug>`) next to Know more: home
  quick-link tiles (`buy` slug in `content/home.json`), home "Our Courses"
  cards (Revision, Mahasangram, Crash Course pinned first), the "Which one
  is for me?" tiles, and the Revision step on `/mahasangram`. Buy buttons
  stay `web-only` (hidden in the Android app, Play policy).
- **Video order (13 Nov):** course lesson lists show "Video N" lessons in
  number order (1, 2, 3 …) whatever order they were uploaded in
  (`src/lib/lesson-order.ts`, used by `getPackageLessons` and the admin
  Lessons page). Lessons without "Video N" in the title keep their admin
  position. No database change.
- **Store order (27 Sep):** Courses and Test Series pages lead with the
  Complete Prelims Pack ("Best Buy"), then Premium Test Series
  ("Recommended — includes all test series"), then the individual products.
  The Standard Test Series + Crash Course bundle is switched off.
- **Uttarakhand Crash Course** (`uttarakhand-crash-course`, ₹1899, video
  course): 25 Uttarakhand lectures + 3 Google Meet live sessions, access
  till 31 Dec 2026. Set up by `supabase/fix-phase23-store-uttarakhand-crash-course.sql`.
- **Crash course:** tentative plan on the course pages
  (`content/crashCoursePlan.json`), video lessons (Admin → Video Lessons,
  unlisted YouTube links; `/test-platform/lessons/crash-course`), refund check
  (fewer than 3 lessons watched).
- **Books:** `/buy-book` (print book) and `/buy-ebooks` (Polity Decoded
  ₹59). The e-book PDF is in the private Supabase bucket `ebooks`; buyers get
  a 24-hour signed link (`src/lib/ebooks.ts`).
- **Free resources:** `/free-content` (PYQ trackers, 60-day plan PDFs in
  `public/uploads/`, guides), `/pyq-tracker`, daily current affairs.
- **SEO:** per-page canonicals, vercel.app → www redirect, sitemap with
  course pages, JSON-LD (organisation, courses, FAQs), share image,
  `public/llms.txt`. Google Search Console and Bing Webmaster verified;
  sitemap submitted; 8 main pages submitted for indexing (27 Sep).

## Done (29 Sep)
- **Ownership & operator split:** Updated About page with separate profiles:
  * **Founder:** Bhanu Joshi (9-year UPSC/UKPSC prep journey, created platform)
  * **Operator:** Varun Joshi (Owner since 10 Oct 2026, 4+ years business experience: Sr. Executive at Tecgenome, Trader/Market Analyst at RPG Trading Dubai, Manager at Brillify Global)
  * **Content clarification:** Bhanu developed the book/course material, continues free YouTube guidance
- **Settings update:** `settings.legal.ownerName` changed to "Varun Joshi" for legal pages
- **Legal pages updated:**
  * Footer: "© [year] UKPSC Decoded. Owned and operated by Varun Joshi."
  * Terms page: Added Varun Joshi's contact (email + Telegram)
  * Privacy & Refund policy: Auto-pull Varun's name from settings
- **Crash course date shift (5 Oct):** Shifted all course videos, live sessions, and early-bird pricing from 2 Oct to 5 Oct (`crashCoursePlan.json`, `seed-phase5-pricing-update.sql`)
- **PR #66 merged:** All website changes deployed live. Pricing now correctly shows "till 5 October" for founding price.
- **Website live:** All pages verified working, pricing labels correct, ownership split visible on About page.
- **Android Phase 1 + 2 prep:** the `android-app-phase1` work (logo icons, maskable
  icons, `/app` home, shortcuts) merged in; `/delete-account`
  page (footer, privacy, sitemap), Play Store feature graphic and listing text
  (English + Hindi) in `docs/play-store/`.
- **Student mobile numbers (30 Sep):** before this, a mobile number was saved
  only at checkout. Now sign-up asks name + mobile (required); students without
  one see an "Add your mobile number" card on My Courses. **Admin → Students**
  lists every account (search, filters, call / WhatsApp buttons, CSV). Privacy
  Policy says we may call or WhatsApp. Numbers are in `users.phone`.
- **Universal offer + offer emails (30 Sep):** Admin → Coupons → "Universal
  offer": one code, % off any package, once per student, runs N hours (default
  48). While it runs, a bar at the top of the site shows the code + countdown and
  checkout applies it automatically. "Email this offer" sends a bilingual email
  (test to yourself first, then batches of up to 100; nobody twice; unsubscribe
  link). Needs `supabase/schema-phase24-offer-emails.sql` run once. A universal
  code is a `coupons` row with type `single_use_percent` and max_uses 1,000,000.
  Resend free plan = 100 emails/day including login codes.
- **Crash course text check (30 Sep):** video numbers now follow release order
  (old 34/35, 39-41, 47-49 renumbered); live-session video references fixed (28
  Oct = UK Polity 18-19, 22-23 only); live sessions are Wednesdays (the +3 day
  shift moved them off Sundays); revision 19-29 Nov; book name "Uttarakhand
  Decoded" everywhere (as on the cover). Store text in the database needs
  `supabase/fix-phase25-crash-course-dates.sql` (old dates, "8-10 live
  sessions", "TRI Exam").
- **60-Day Master Plan (1 Oct):** spreadsheet for students (1 Oct → 29 Nov exam):
  book chapter (EN + HI) + crash course video + national self-study + PYQ
  clusters + test of the day, all 62 tests + Free Sample Mock scheduled,
  progress sheet. Kept out of git (repo is public); the owner has the .xlsx.
  The crash course calendar now releases videos on the plan's watch days (2-3
  a day, 5 Oct – 18 Nov; videos 4-34 moved 1-2 days later) and the plan page
  shows the matching book chapter per Uttarakhand video (`book` field in
  `content/crashCoursePlan.json`).

## Test series quality review (1 Oct) — run it on the laptop
- A student found the sectional tests below UKPSC standard: basic Uttarakhand
  questions asked again and again, missing statements, wrong answers, and
  doubtful current affairs. **`docs/TEST_REVIEW.md`** has the steps and a
  prompt to paste into Claude Code on the laptop (the question files are only
  there).
- New scripts: `export-tests-for-review.mts` (one review file per test, with
  automatic flags, open student reports and the same fact in other tests),
  `apply-review-decisions.mts` (decision CSVs → workbooks, dry run first,
  backups), and loader `--harden` (each topic test at most 20% Easy / 30% Hard;
  every test except the Free Sample Mock, Full Mocks included). Shared checks in
  `question-checks.mts`. The audit now also flags missing statements, Hindi
  with fewer statements, explanation/answer-key disagreements on statements,
  and one-line Easy questions.
- A `Review_Flag` now drops CMB- (combined) questions too.

## Test series review done on the laptop (1-3 Oct) — waiting for the owner's OK
- **All 4,050 live questions reviewed** (21 subagent batches), then every
  replacement the loader brought in, in rounds, until each incoming question
  had been checked. Decisions: `test series questions/review/decisions/`
  (batch-01 … batch-44, git-ignored), applied to the workbooks with backups in
  `test series questions/backups/`. Roughly 800 questions dropped (too easy,
  repeats, doubtful, outdated, incomplete), ~1,000 fixed (answer keys, missing
  statements, Hindi), many relabelled.
- **Web search ran out** (200 per session) part-way: some 2025-26 current
  affairs and Uttarakhand budget figures were kept from memory (CH04-0052,
  Lala Lajpat Rai's 1913 sacred-thread ceremony place, was dropped as doubtful). Raise
  `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` before the next review.
- **Student reports (6, all open):** UKD date (2 reports, valid — the wrong
  question is dropped), Mukandi Lal's paper "Tarun Kumaon" (valid — key fixed),
  "Neither I nor II" pasted into a UMM statement (valid — fixed), Hill
  Development Council matching (valid — dropped, two wrong pairs), red litmus
  pH (not valid). Resolve all 6 in Admin → Reports after the loader `--apply`.
- **Loader fixes:** a replacement for a dropped live question no longer takes
  a question that is live in another test (later tests were emptied, e.g.
  Geography Sectional II); UK topic tests swap questions from other chapters for
  unused on-topic ones.
- **Bank ran dry** in History / Geography / Polity / Science: 163 questions
  flagged "too easy" or cross-test "repeat" were restored (as Easy) to keep the
  tests full (`batch-22-restore-to-fill.csv`), plus 15 Uttarakhand current
  affairs ones (`batch-35`, `batch-36`). **Add Medium/Hard questions** for these
  subjects and for UK current affairs, then re-run the loader.
- **New test headings (owner):** Uttarakhand (Post-Independence) → Uttarakhand:
  Freedom Struggle to Statehood (1900-2000) (adds CH04 20th-century questions);
  Gorkha & British rule & Freedom Struggle → Gorkha & British Rule (to 1900)
  (rebuilt with `--recompose`); Demography & Census → Demography, Society &
  Tribes (adds CH11 tribes/society); Economy Development & Budget → Economy,
  Budget & State Schemes (adds CH10). Database names: run
  `supabase/seed-phase26-rename-uk-topic-tests.sql`.
- **Part 2 (spare facts → statement questions):** only 3 new CMB- questions so
  far (Demography, post-2000) — most spare facts could not be checked without
  web search. CMB- edits live in the decision files: after re-running
  `build-combined-questions.mts`, re-run `apply-review-decisions.mts --apply`.
- **Telegram quiz CSV** (`QUESTION_BANK_FOR_TELEGRAM.csv`, row 12 Garv-Bhanjan
  = Mahipati Shah; row 59 order of zones) is wrong but left alone on the
  owner's instruction.
- **To go live (owner):**
  ```
  cd website
  npx.cmd --yes tsx scripts/load-question-bank.mts --harden "--recompose=Gorkha & British Rule (to 1900)" --apply
  ```
  Use exactly the same flags as the approved dry run. Then run the phase-26
  SQL, then resolve the reports.

## YouTube video editing (30 Sep)
- `video-edit/` = FFmpeg scripts to edit Video 1 on the laptop (steps in `video-edit/README.md`).
  Footage in `raw/`, `ASSETS/`, `music/`, output in `work/` + `export/` (all git-ignored).

## Question bank (27 Sep clean-up)
- 79 generator-filler questions ("(Item #N)" + fake statement 2) corrected
  in the workbook and back live; the loader rejects that filler pattern.
- Audit fixes: wrong years, answer given away, broken/missing Hindi,
  "…is Both I and II." option text pasted into 15 stems, 6 unverifiable
  current-affairs questions dropped (Review_Flag).
- Free Sample Mock (the main sales test) hand-reviewed; 7 hand-picked swaps
  in `test series questions/TEST_OVERRIDES.xlsx` (applied on every loader
  run). Mix: UK 16, Polity 7, History 5, Geography 5, Sci-Tech 5, Economy 5,
  Environment 3, CA 4; Easy/Medium/Hard 12/34/4. Review files:
  `FREE_MOCK_REVIEW.xlsx`, `AUDIT_FIXES_REVIEW.xlsx`.
- After a free mock, students who don't own Premium see a buy card with
  their weakest subject.
- Confirmed 27 Sep (local): loader dry run shows 0 changed questions in
  every test and all 7 swaps already applied, so the bank is live.

## Android app — Phase 1 done (27 Sep, branch `android-app-phase1`)
- `public/manifest.json`: `start_url` is now `/app?source=app`; `id` stays
  `/test-platform` so existing installs keep the same app; shortcuts for
  Test Series, My Courses, Free Resources, Books.
- New icons from the logo (saffron BookOpen on graphite), including real
  maskable icons with padding: `scripts/make-app-icons.mts` redraws them.
  Service worker cache bumped to `ukpsc-shell-v2` so phones pick them up.
- `/app` (app home, noindex): My Courses (when logged in), Test Series,
  Video Courses, Books & E-book, Free Sample Mock, and free resources
  (PYQ Tracker, 60-Day Plan PDF, Current Affairs). No lead popup there.
- Still to do from Phase 1: check the key flows inside the installed app
  (APP_PLAN step 3). `assetlinks.json` comes in Phase 2.

- **60-Day Master Plan on the website (5 Oct):** `/pyq-tracker` → "60-Day Plan"
  tab now shows the new plan (`src/lib/masterPlan.ts`, generated from the
  planner source: video, book EN/HI, self-study, PYQ, tests, live), opens on
  today's phase and highlights today. The free PDF
  `public/uploads/UKPSC-60-Day-Master-Plan-2026.pdf` is the new printable
  planner (new name so phones don't reopen a cached copy); the old
  `UKPSC-60-Day-Prep-Tracker.pdf` path holds the same file for old links. Old `prepPlan` removed from `pyqData.ts`.
- **Android app (5 Oct):** PWABuilder APK installed on the owner's phone and
  opens full-screen (assetlinks upload-key fingerprint works). Added a bottom
  tab bar (Home · Courses · Tests · Free · Login/My Courses) that shows only in
  the installed app (`display-mode: standalone`, `src/components/AppTabBar.tsx`);
  hidden during tests and checkout. The website is unchanged.

- **Protected lessons (5 Oct, needs `supabase/schema-phase27-protected-lessons.sql`
  run BEFORE merging):** a lesson's video can be a Bunny Stream video ID
  (signed embed link valid 6 h, made per view; Bunny library allows only
  ukpscdecoded.in as referrer) or an unlisted YouTube link (title bar/logo
  covered). Both show a drifting watermark of the student's email/phone and
  use our own full-screen button so it stays visible. Admin → Video Lessons
  has EN PDF / HI PDF upload per lesson (private bucket `lesson-notes`,
  direct signed upload, 50 MB max); students download a copy stamped with
  their email/phone (`/api/lessons/[id]/notes?lang=en|hi`, stamped copy
  cached under `stamped/<user>/`). Env: `BUNNY_STREAM_LIBRARY_ID`,
  `BUNNY_STREAM_TOKEN_KEY`.

- **New logo (5 Oct):** round UKPSC Decoded badge (source
  `scripts/assets/logo-source.webp`; `npx.cmd --yes tsx scripts/make-app-icons.mts`
  rebuilds `public/logo-badge.png`, all `public/icons/*` incl. maskable, and
  `docs/play-store/app-icon-512.png`). Used in the navbar, footer, Razorpay
  book checkout and the lesson-PDF stamp (faint centred badge + email/phone;
  stamped copies cached under `stamped/v2/`). The installed app's home-screen
  icon changes only with the next PWABuilder build — rebuild with the SAME
  signing key (upload `signing.keystore`, never "Create new").
  The home carousel shows the badge above the title on text (gradient)
  banners only; picture banners carry the logo inside the designed image.
  AI prompts for the product banners (1920x600 + 1080x1080 mobile):
  `docs/CAROUSEL_PROMPTS.md`.

- **Designed carousel banners (12 Oct):** five picture banners, desktop
  1920x600 + phone 1080x1080 WebP, in `public/banners/` (shipped with the
  site, nothing to upload): Complete Prelims Pack (gold), Premium Test Series
  (crimson), Crash Courses — Uttarakhand + National (teal, links to
  `/courses`), Mentorship (violet), the book (navy, links to `/buy-book`).
  No prices or dates on them. New `banners.link_url` column overrides the
  course-page link; a banner with a link needs no package. Owner runs
  `supabase/fix-phase35-designed-banners.sql`. To change a banner later,
  edit the picture in Canva at the same size and replace the file.
- **Speed (14 Oct):** fonts are self-hosted with `next/font` (Inter +
  Poppins, no Google Fonts request), the navbar/footer logo is a 10 KB
  `logo-badge-160.webp` (was the 238 KB PNG on every page), and the e-book
  page uses WebP images (~4.6 MB → ~250 KB). Supabase is in Singapore
  (ap-southeast-1), so `vercel.json` pins the server functions to Singapore
  (`"regions": ["sin1"]`) instead of Vercel's US default.
- **YouTube lesson thumbnails (13 Oct):** lessons stored as YouTube videos
  (e.g. Videos 1 and 9) now show YouTube's thumbnail on the plan and lessons
  page (`lessonThumbnailUrl` in `src/lib/lessons.ts`; Bunny first, then
  YouTube).
- **App: no prices or buy banners (12 Oct):** inside the Android app
  (`html[data-app]`) prices, savings, founding labels, the home carousel and
  the store-page Buy Now banners are hidden (`web-only`). The app note now
  says "Already purchased? Log in with the same email you used, and your
  courses will appear in My Courses." Never mention buying on the website
  inside the app (Play payments policy); say it on WhatsApp/Telegram/YouTube.
- **Store page tops + Books redesign (12 Oct):** `/courses` opens with the
  Complete Prelims Pack banner and `/test-series` with the Premium Test
  Series banner (`src/components/PageHeroBanner.tsx`): price + Buy Now
  straight to `/checkout/<slug>` (app: opens the course page, no buying).
  `/buy-book` is now an overview with three tabs (English Book, Hindi Book,
  E-Books → `/buy-ebooks`); "Read Samples & Order" opens
  `/buy-book/order?lang=en|hi` with the sample PDFs (step 1), the address
  form and Razorpay payment (step 2). Order logging to the Google Sheet and
  `/api/create-book-order` are unchanged. Fixed the Hindi Chapter 27 sample
  link (the file name has a space before ".pdf").

- **Retests (6 Oct):** each test can be taken once plus 2 retests
  (`MAX_ATTEMPTS_PER_TEST = 3` in `src/lib/tests.ts`, enforced in
  `/api/tests/[testId]/start`; a timed-out attempt counts; admins unlimited).
  The result page shows "Retest (n left)" and "Results of all attempts"; the
  student's course list shows View/Latest result, All n attempts and Retest.

- **Crash course plan with thumbnails (7 Oct):** `CrashCoursePlan` shows the
  video schedule first (always open, bigger), then live sessions. A lesson
  titled "Video N …" in that course fills slot N: its Bunny thumbnail shows to
  everyone (needs `BUNNY_STREAM_CDN_HOST` in Vercel); only owners can click
  through to watch, others see "For enrolled students". The lesson list also
  shows thumbnails. Custom thumbnails need `BUNNY_STREAM_API_KEY` too. A free
  demo video (course metadata `demo_videos`) titled "Video N …" (or named like
  plan video N) fills that slot as "Free · Watch now" (links to #free-demo).

- **Free sample lessons (7 Oct):** Admin → Lessons → "Make free" on a lesson
  (needs `supabase/schema-phase29-free-sample-lessons.sql`). Any logged-in
  student can then watch it and download its stamped PDFs; the plan shows
  "Free sample · Watch now". Non-owners opening any other lesson are sent to
  the course page. Video 4 is the first sample (owner, 7 Oct).

- **Play rejection: Misleading Claims (8 Oct):** "Missing source link for
  government information". Fixed by (1) a store description with official
  sources (psc.uk.gov.in, sssc.uk.gov.in, uk.gov.in) and a "not a government
  entity" disclaimer at the top, and (2) the same disclaimer + links in the
  site footer (`Footer.tsx`, shows in the app). Then Publishing overview →
  Send changes for review.

- **National Crash Course (9 Oct, ₹1899):** `supabase/seed-phase30-national-crash-course.sql`
  creates `national-crash-course`. It has no lessons of its own: `src/lib/course-subsets.ts`
  maps it to the Crash Course's national "Video N" lessons (27 videos: no "UK …" modules,
  no videos 40/50) and 4 live sessions (no Uttarakhand ones). Owning it or the Crash
  Course opens those lessons and PDFs (`getCourseLessons`, `canAccessLesson`). Admin →
  Lessons shows a "don't add lessons here" note for it. Live-session Meet links are
  shared the usual way.

- **Uttarakhand Crash Course shares lessons too (9 Oct):** `course-subsets.ts` now maps
  `uttarakhand-crash-course` to the Crash Course's Uttarakhand videos (26: "UK …"
  modules + 40 + 1 + CSAT 47-48 + 50; live 14 Oct, 28 Oct, 18 Nov). National = 28 videos (now
  incl. 50), 4 live. Upload every video once, to the Crash Course. The Uttarakhand
  course's own old lessons are ignored. Course text: `supabase/fix-phase31-crash-course-subsets.sql`.

- **Launch prices back (10 Oct):** `supabase/fix-phase32-restore-launch-prices.sql`
  extends `founding_ends_at` to 29 Nov 2026 for every active package with a lower
  founding price (they had ended 5 Oct). Weekend offer: universal code WEEKEND12 (12%).

- **Subset courses (10 Oct):** Uttarakhand + National Crash Course now ₹1699
  (`supabase/fix-phase33-subset-course-price.sql`). Their lesson lists show the
  Crash Course video number (not the position) plus a note that gaps are the
  other part's videos, so students don't think videos are missing.

- **Telegram daily quiz (12 Oct):** `/api/cron/telegram-mcq` runs 08:00 IST
  (vercel.json): 7 Telegram quiz polls (bilingual, with explanation) from the view
  `telegram_unused_questions` (active, in no test, never posted), then a rotating
  promo. Posted ids go to `telegram_posted_questions` (no repeats; one run per IST
  day). Admin: `/api/cron/telegram-mcq?preview=1` (dry run) or `?send=1`. Needs
  SQL phase 34 + env TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID. The old Apps Script
  bot (Google Sheet) is separate; turn its trigger off to avoid double posts.

- **Telegram quiz text (12 Oct):** intro names Upper PCS (29 Nov 2026) + Lower PCS
  (Dec 2026) with a live day countdown; 4 closing messages rotate daily (real countdown,
  no invented scarcity), links /courses and /test-series (`src/lib/telegramMcq.ts`).
  After 29 Nov the countdown reads 0: switch the texts to Lower PCS then.

- **Big thumbnail cards (12 Oct):** in the Crash Course Plan, uploaded videos are large
  cards (full-width 16:9 thumbnail, "Video N" badge, play/lock icon; 1 per row on phones,
  2 on desktop), shown to everyone; not-uploaded videos stay compact rows. Thumbnails:
  brand-led Canva template (no face, owner joining government service).

- **CSAT tests + CSAT Test Series ₹299 (18 Oct):** 6 original CSAT mocks (100 Q,
  bilingual, UKPSC pattern; tests 1-2 at 2025 level, 3-4 between, 5-6 at 2024
  level) built by `test series questions/csat-tests/generator/build.py`
  (git-ignored; also writes the paper/solution PDFs and `csat-questions.json`).
  `scripts/load-csat-tests.mts` (dry run, then `--apply`) loads them into CSAT 1-6:
  120 min, 1.5 marks each, 1/4 negative. Premium, Complete Prelims Pack and
  Mentorship buyers get them through Premium. `supabase/fix-phase36-csat-test-series.sql`
  links CSAT 1-6 to `csat-test-series`, sets ₹299 flat and switches it on only when
  all 6 tests have 100 questions; removes "coming soon" from Premium. The result
  page shows "CSAT is qualifying (33% = 49.5)" for CSAT tests. The main loader
  still skips CSAT tests. Question ids `CSAT-T01-Q001` …; to change a question,
  edit the generator, rebuild (output is reproducible), dry run, `--apply`.

- **Mock Mahasangram + Revision Test Series (4 Nov, PR #101 merged):** Mock Mahasangram (₹499, different from Basic,
  `mock-mahasangram`) = Premium's Full Mock 7-12 as live mocks on 12, 15, 18, 21, 22, 25 Nov (moved from 24/27 by phase 40)
  (`tests.live_series = 'mahasangram'`; opens `release_at` 12 noon, only first attempts
  started by `rank_until` 6 pm are ranked, result + solutions + ranks at `result_at` 8 pm).
  Full Mock 7 is free for all. Public pages `/mahasangram` (free Mock 1 sign-up: a NEW
  email is logged in with no email code; an existing email must log in) and
  `/mahasangram/[testId]/ranks` (name + district, stars for top 20). Revision Test Series
  (₹999, `revision-test-series`) = those 6 mocks + CA Revision 1-6 and Uttarakhand
  Revision 1-8 (100 Q each, existing 50-Q tests joined in pairs) + CSAT 5-6. `packages.metadata.returning_percent_off` (20) gives 20% off both at checkout
  to logged-in students owning another paid package (not Premium/Complete/Mentorship). `coupons.package_slugs`
  locks a code to packages. SQL: `supabase/schema-phase37-mock-mahasangram.sql` (times in
  UTC). Note: Full Mock 7-12 now open for Premium students only on their mock dates.
- **Final-month store (4 Nov, phase 38):** `supabase/schema-phase38-final-month-prices.sql`
  cuts prices till 29 Nov 11:59 pm (Crash Course ₹2,222, UK/National Crash Course ₹1,188,
  Complete Prelims Pack ₹3,299, Premium ₹1,399; old price shown struck through), gives
  Premium/Complete/Mentorship owners Revision + Mahasangram as separate products
  (`packages.metadata.included_with`, read by `getOwnedPackageIds`), sets the ₹500 upgrade
  (`metadata.upgrade_from`, priced in `src/lib/returningPrice.ts`) and removes the 14 revision
  tests from Premium (one targeted DELETE, on the owner's request). Pages: `/revision` (main,
  highlighted first in the navbar and app tab bar), `/mahasangram`; "Which one is for me?"
  (`src/components/final-month/WhichOne.tsx`) on Courses and Test Series; banner
  `src/components/FinalMonthBar.tsx` (shows only while a struck price exists, before 29 Nov).
  Dates live in `content/finalMonthSchedule.json`; timetable PDF
  `public/uploads/final-month-timetable.pdf` is rebuilt with
  `node scripts/make-final-month-timetable.mjs` (needs Playwright; prices printed are set
  at the top of the script). Admin → Lessons: video is optional, and an "Add notes-only
  lessons" button creates Video 1-50 lessons from the crash course plan so notes PDFs can be
  uploaded before the videos.
- **New dates (4 Nov, phase 40):** Revision Series runs 6-26 Nov (no test on 8 Nov Diwali or
  27-28 Nov); CSAT 5 and 6 share 20 and 24 Nov with a UK test. Mocks 5 and 6 moved to 22 and 25 Nov
  by `supabase/schema-phase40-mock-dates.sql`.
- **Final-month carousel banners (4 Nov, phase 41):** Revision (first, /revision) and All Uttarakhand Rank Challenge (second, /mahasangram), `public/banners/revision-*.webp` + `mahasangram-*.webp`
  (rebuild: `scripts/banners/make-final-month-banners.cjs`). Mock Mahasangram is sold as "All Uttarakhand Rank Challenge · Are you the next topper?".
  Test Series page: single test series are shown openly (no dropdown).
- **Warm-up Mock + early-bird (4 Nov, phase 42):** `supabase/schema-phase42-warmup-earlybird.sql`
  adds a free "Warm-up Mock" (copy of a Basic full mock, `tests.live_series = 'warmup'`), open
  till 11 Nov 11:59 pm with an instant, tentative rank list (`getWarmupTest` in `src/lib/liveMock.ts`;
  card on `/mahasangram`, no-OTP sign-up). Rank Challenge ₹399 till 11 Nov (founding price), then ₹499. Only the warm-up is free: all 6 live mocks are paid (Mock 1 was free before phase 42).
  Re-run phase 42 after question fixes so the warm-up copy picks them up.
- **Sale wording + validity (5 Nov, phase 46):** the founding-price label now reads "⚡ Last-minute sale · one-time offer ₹X till <date>, then ₹Y" (`formatFoundingLabel`). Every course is valid till 15 Jan 2027: `supabase/schema-phase46-validity-15-jan.sql` moves packages and running enrollments from 31 Dec to 15 Jan (only extends). Logins also last till 15 Jan.
- **Free mock popup (5 Nov, phase 45):** the old answer-writing popup (`LeadPopup`) is gone. `components/FreeMockPopup.tsx` shows to logged-out website visitors while the Warm-up Mock is open (12 s or exit intent; not on /mahasangram, tests, checkout, app). Each sign-up is saved in `mock_registrations` (run `supabase/schema-phase45-mock-registrations.sql`), then the student gets an account and goes to the warm-up. Admin → Free Mock Registrations lists them with call/WhatsApp and a CSV.
- **Rank Challenge contact list (4 Nov):** Admin → Students → "Rank Challenge list" downloads a CSV (name, mobile, email, district, warm-up status and score, live mocks taken, purchases) of everyone who signed up through the free form or took the warm-up or a live mock (`/api/admin/students/rank-challenge`).
- **BOOK10 (4 Nov, phase 39):** `supabase/schema-phase39-book10-code.sql` creates a private
  10% code for book buyers (WhatsApp broadcast), once per student, till 29 Nov, on every
  active package. Codes with `package_slugs` set are never shown in the site-wide offer
  bar or prefilled at checkout (`getActiveOffer` in `src/lib/coupons.ts`).

## Student report fixes (4 Nov)
- All 31 open reports (29 questions) reviewed: `test series questions/review/decisions/batch-45-student-reports-nov.csv`
  (git-ignored). Full Mock 7-12 and CSAT 5-6 had none. Loader `--apply` DONE (no flags; 4050 placed, none below target).
- **Done:** phase 43 run (Uttarakhand Revision 2, 3, 5, 7, 8 synced, Warm-up Mock = Full Mock 6, 12 dropped questions inactive).
- **Follow-up, loader `--apply` DONE (`batch-46`):** 17 broken Hindi explanations rewritten; pasted option text removed from
  `UKPCS-POL-STA-0013`; `UKPCS-UKGK-CH09-0161` replaced by `CH09-0022` in Uttarakhand CA + Budget (TEST_OVERRIDES.xlsx).
- **Owner still to do:** run `supabase/fix-phase44-replace-0161-block-flagged.sql` (CA Revision 6 swap; every flagged question
  not in a test goes inactive, so Telegram cannot post it), then resolve the 31 reports in Admin -> Reports.
- **To bring back a flagged question after phase 44:** clear its Review_Flag AND set `status` to active; the loader never changes status.
- **The loader does not update copied tests.** Revision tests and the Warm-up Mock are outside its 57 tests: a replacement
  needs an `array_replace` like phase 43 (text and answer-key fixes reach them by themselves, same question row).
- **The export hides CSAT reports** (CSAT questions are not in the workbooks): read `question_reports` directly too.
- **`apply-review-decisions` counts old flag-then-restore pairs as changes** (358 of them, no net effect): diff the workbooks
  against a backup to see the real changes.
- Could not verify outside the bank: first State Finance Commission chairman, the "Surat Kavi" pen name, Man Shah and Tibet.
  fsi.nic.in has a revoked certificate; ISFR 2023 district figures came from a public transcription that matches the bank.

## WhatsApp chat button (5 Nov)
- Green "Chat with us" button bottom-right on every page (icon only on phones),
  `src/components/WhatsAppButton.tsx`. It opens WhatsApp to the AiSensy number
  +91 83684 57598 with a ready message that names the page the visitor was on;
  chats arrive in AiSensy Live Chat. Plain wa.me link, no AiSensy script.
- Hidden during tests, at checkout and in admin pages. In the installed app it
  sits above the bottom tab bar. To change the number, edit `WHATSAPP_NUMBER`.

## Vercel free-tier usage (6 Nov)
- Vercel warned at 75% of the free plan's 1M function invocations. The owner
  chose to stay on the free plan for now (Pro, about $20/month, is the
  fallback if usage keeps climbing). Don't move hosting/DNS before 29 Nov.
- Test answers now save every 2 minutes (`AUTOSAVE_INTERVAL_MS` in
  `src/components/TestRunner.tsx`) instead of 0.8 s after every tap, plus on
  submit, tab hide/close and leaving the test page. Worst case a crashed
  phone loses up to 2 minutes of answers.
- Other big driver: the root layout reads the login cookie, so every page
  view is a server function call. Making public pages static is post-exam work.

## Open items (owner)
- [ ] **CSAT go-live (18 Oct):** loader `--apply` DONE (600 questions, CSAT 1-6
      filled). Still to do: run `supabase/fix-phase36-csat-test-series.sql`, then
      merge the CSAT pull request. Take CSAT 1 with a test account on a phone.
- [ ] **Test series review (3 Oct):** review done (see "Test series review
      done on the laptop"). Approve the dry run, run the loader `--apply` with
      the same flags, run `seed-phase26-rename-uk-topic-tests.sql`, resolve the
      6 reports in Admin → Reports. Supply Medium/Hard questions for History,
      Geography, Polity, Science and Uttarakhand current affairs.
- [ ] **Razorpay keys (28 Sep):** book / e-book payments failed with 401
      because they read a different, stale key pair. Now every payment reads
      `RAZORPAY_TEST_KEY_ID` + `RAZORPAY_TEST_KEY_SECRET` (live keys despite
      the name). Put the current live keys there in `.env.local` **and** in
      Vercel → Settings → Environment Variables, redeploy, then delete the old
      `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` from Vercel. Deactivate the
      old Razorpay key once a real payment succeeds.
- [ ] Print book page (`/buy-book`) had an old key typed into its code; it now
      creates the order through `/api/create-book-order` (keys from Vercel).
      Test one real book payment after merging.
- [ ] Site sometimes froze (no scrolling on any page until a full reload).
      Likely Razorpay checkout leaving `overflow:hidden` on the page;
      `ScrollUnlock` now clears it on every page change. Report if it recurs.
- [ ] Android app Phase 2: account verified, app created and v1.0.0 (new
      logo, rebuilt with the SAME keystore) uploaded to Internal testing
      (7 Oct). `public/.well-known/assetlinks.json` now has both fingerprints:
      Play app signing key (B5:6A:…) and the upload key (52:52:…).
      Next: store listing (add the "not affiliated with UKPSC" line), app
      content forms, App access = the reviewer login (`REVIEWER_EMAIL` +
      `REVIEWER_CODE` in Vercel, see PROGRESS env vars; after its first
      login run `supabase/seed-phase28-play-reviewer-access.sql` so it sees
      all paid content), closed test
      with 12+ testers for 14 days (personal account), then production.
      Payments: consumption-only (Google Play India): inside the app every
      Buy button, the checkout form, the e-book buy form and the offer bar
      are hidden and a neutral "Purchases aren't available in the app" note
      shows (no link to the website: Play forbids steering). App detection:
      inline script in layout.tsx sets <html data-app> from `?source=app` or
      the android-app:// referrer (sessionStorage); CSS `.web-only` /
      `.app-only` in globals.css. The print book stays buyable (physical). Keep the
      PWABuilder zips (signing key) in two safe places, never in the repo.
- [ ] **Run `supabase/fix-phase23-store-uttarakhand-crash-course.sql`**
      in the Supabase SQL Editor (repairs the hand-added rows: wrong prices
      ₹1,89,900 / ₹3,99,900, and the Premium Test Series bullet points).
- [ ] Uttarakhand Crash Course: add its 25 lessons in Admin → Video Lessons
      (pick the course in the drop-down; the same YouTube links as in the
      Crash Course) and share the Google Meet links for its 3 live sessions.
- [ ] **Run the loader `--apply`** if the last Free Sample Mock fixes and
      swaps aren't live yet, then take the free test on a phone with a
      non-buyer account.
- [ ] Merge any open pull requests on GitHub (check the Pull requests tab).
- [ ] **Resend:** free tier is 100 emails/day (login codes, receipts,
      backup). Upgrade to Pro (~$20/month) if sales grow, or add a backup
      email provider.
- [ ] **Delete the old Netlify project** (app.netlify.com → ukpscdecoded →
      Project configuration → Delete). Its old deploy previews still contain
      the e-book PDF.
- [ ] **By 5 Oct:** upload the strategy video (Unlisted) and add it as Lesson 1.
- [ ] YouTube: website link on the channel and in the top 10 video
      descriptions; Search Console → Pages check around 4 Oct.
- [ ] Mentorship: add the Google Meet link in Admin → Mentorship.
- [ ] Turn off the 100% test coupon if still active.

## Open items (code / content)
- [ ] Crash-course calendar (`content/crashCoursePlan.json`) titles synced
      with `VIDEO_STATUS.md` on 5 Oct; keep it in step when slots change.
- [ ] **Android app** — Phase 1 code done (above); next: flow checks in
      the installed app, then Phase 2 in `APP_PLAN.md`.
- [ ] SEO content pages (syllabus 2026, previous-year papers, exam date,
      cutoff analysis) as articles — needs official facts from the owner.
- [ ] Audit re-flags rows already reviewed as OK; add an "Audit_Note = OK"
      column the audit skips.
- [ ] Spare (unused) questions flagged by the audit: review so bad ones are
      never picked as replacements.
- [ ] Demo videos on course pages (`metadata.demo_videos`, see
      `supabase/seed-phase15-course-pages.sql`), course images, CSAT tests.

## How-tos
- **Question fix:** edit the workbook → dry run → check → `--apply`
  (see `CLAUDE.md`). A live question can be switched off at once with
  `update questions set status='inactive', deactivated_at=now() where question_id='…';`
- **Curate a test by hand:** add a row to `TEST_OVERRIDES.xlsx` (sheet
  Overrides: Test, Remove_ID, Add_ID) → dry run shows "Hand-picked swaps".
- **Audit:** `npx.cmd --yes tsx scripts/audit-question-bank.mts` →
  `test series questions/QUESTION_AUDIT.xlsx`.
- **Student reports:** Admin → Reports; deactivate or fix, then re-run the loader.
- **New lesson video:** Admin → Video Lessons (YouTube link must be Unlisted,
  embedding allowed).
- **Prices / course text:** SQL on the `packages` table (see the seed-phase
  files for examples); the founding price ends on 5 Oct 2026 (`packages.founding_ends_at`); the "till 5 October" label on price cards reads that date, so changing it in SQL is enough.

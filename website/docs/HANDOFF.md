# Handoff — state of UKPSC Decoded (3 Oct 2026)

Written at the end of the cloud Claude Code sessions, so work can continue in
the owner's local terminal. Keep this file current: add to "Done" and trim
"Open" as things land.

## Live now (www.ukpscdecoded.in)
- **Store:** Courses page (crash course, crash course + test series
  bundles, mentorship) and Test Series page (all test series, bundles,
  mentorship). Razorpay live checkout with coupons; `PAYMENTS_ENABLED=true`.
- **Test platform:** email-code login (sessions last until 31 Dec 2026, 2
  devices max), 57 tests + Free Sample Mock, analysis, XP/streaks,
  mentorship booking, admin tools (`/test-platform/admin`).
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
  The home carousel shows the badge too: top-left corner on picture banners,
  centred above the title on text (gradient) banners (`HomeCarousel.tsx`).

## Open items (owner)
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
- [ ] Android app Phase 2: PWABuilder package built (4 Oct); its upload-key
      fingerprint is in `public/.well-known/assetlinks.json`. Play Console
      "Create app" is locked until account verification (ID, phone/email,
      Android device) finishes. After the first upload, send Claude Play's
      "App signing key" SHA-256 so it is added as a second fingerprint (the
      app shows an address bar until then). Keep the PWABuilder zip (signing
      key) in two safe places, never in the repo. Decide the payments option.
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

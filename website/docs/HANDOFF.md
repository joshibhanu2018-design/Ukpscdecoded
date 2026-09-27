# Handoff — state of UKPSC Decoded (27 Sep 2026)

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

## Open items (owner)
- [ ] Take the Free Sample Mock on a phone with a non-buyer account.
- [ ] Merge any open pull requests on GitHub (check the Pull requests tab).
- [ ] **Resend:** free tier is 100 emails/day (login codes, receipts,
      backup). Upgrade to Pro (~$20/month) if sales grow, or add a backup
      email provider.
- [ ] **Delete the old Netlify project** (app.netlify.com → ukpscdecoded →
      Project configuration → Delete). Its old deploy previews still contain
      the e-book PDF.
- [ ] **2 Oct:** upload the strategy video (Unlisted) and add it as Lesson 1.
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
  files for examples); the founding price ends on 1 Oct 2026 (`packages.founding_ends_at`).

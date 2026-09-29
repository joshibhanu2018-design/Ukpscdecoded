# Handoff — state of UKPSC Decoded (29 Sep 2026)

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
- **Branch:** `claude/wizardly-cannon-rkvbbd` with 2 commits; ready for PR merge

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

## Open items (owner)
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
- [ ] Android app: Phase 1 done, Play Console account created. Next is Phase 2 (pwabuilder.com build). Owner is moving to a new laptop; see `NEW_LAPTOP.md`.
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
- [ ] **2 Oct:** upload the strategy video (Unlisted) and add it as Lesson 1.
- [ ] YouTube: website link on the channel and in the top 10 video
      descriptions; Search Console → Pages check around 4 Oct.
- [ ] Mentorship: add the Google Meet link in Admin → Mentorship.
- [ ] Turn off the 100% test coupon if still active.

## Open items (code / content)
- [ ] **Android app** — see `APP_PLAN.md`.
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

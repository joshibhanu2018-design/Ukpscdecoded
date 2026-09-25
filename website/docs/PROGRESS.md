# UKPSC Decoded — Test Platform Progress

Status snapshot of `/student/*` and `/test-platform/*` — the Supabase-backed
test platform built alongside the existing static site. Update this file
when phases land or SQL files get run.

## What's done

**Auth — passwordless email OTP (Phase 7, replaces Phase 1 password
login + Phase 3 password reset).** One screen at `/student/login`: email →
"Send code" → 6-digit code by email (Resend, bilingual, valid 10 min) →
logged in. A new email creates the account automatically after asking for
a name. Phone is collected at checkout. `/student/signup`,
`/student/forgot-password`, `/student/reset-password` now redirect to the
login screen (keeping `?next=`), so old links still work. Existing
accounts log in with their email as before — nothing to migrate.
- Codes stored as HMAC-SHA256 keyed with `SESSION_SECRET` (a plain hash of
  a 6-digit code is brute-forceable offline), never in plain text.
- Max 5 guesses per code. Each guess *claims* an attempt with a
  compare-and-set UPDATE before comparing, so a burst of parallel guesses
  can't get extra tries. Requesting a new code supersedes older ones.
- Max 3 codes per email per 15 minutes, max 10 per IP per hour (fails
  closed if the DB check errors). The request endpoint answers the same
  whether or not the email has an account.
- A correct code is consumed immediately (single use, guarded UPDATE). A
  first-time user gets a signed 15-minute signup ticket for the name step,
  so that step can't be used for more guesses.
- Sessions: HMAC-signed cookie carrying a `user_sessions` row id (Phase 9, below).
- Removed: password signup/login/reset pages, forms and API routes, and
  `src/lib/password-reset.ts`. `password_reset_tokens` and existing
  `password_hash` values are left in the DB, unused.
- **Not tested against the live DB or real Resend yet** (the cloud session
  that built it had no credentials). Logic checked against an in-memory
  DB stand-in (rate limits, 5-attempt cap incl. 20 parallel guesses,
  single use, expiry, supersede, ticket tampering, case-insensitive
  email); UI checked at 375/768/1280px. **Before relying on it:** run
  `schema-phase7-otp-login.sql`, then on localhost log in with a
  temporary email end-to-end, and delete that user +
  its `login_codes` rows afterwards.

**Question bank loader (Phase 8, built — not applied yet).**
`scripts/load-question-bank.ts` (run with `npx --yes tsx`, from `website/`)
loads the master bank (`MERGED_QUESTION_BANK_v2.xlsx`, minus the 153
rows with a Review_Flag) plus `GENERATED_QUESTIONS.xlsx` (509 new `GEN-`
questions written to cover shortfalls): 7,487 questions in total. It
then fills the 56 non-CSAT Premium Test Series tests: 4,000 questions,
none used twice.
- Input files live in `test series questions/` at the repo root. That
  folder, `*.xlsx` and `*.csv` are git-ignored (root `.gitignore`), and
  the repo is public, so never commit question data.
- Default is a dry run, which reads the xlsx files only. It prints
  per-test counts, the section mix, the difficulty split, the reuse count
  (must be 0), short tests and near-duplicate pairs. `--plan` also writes
  `TEST_ALLOCATION_PLAN.xlsx` next to the inputs. `--apply` writes: it
  upserts questions on `question_id` (batches of 500), then sets
  `tests.question_ids` (in order), `total_questions` and the new names:
  "Current Affairs Set 1-8" (were "Month 1-8").
- Allocation is deterministic (seeded), so dry run and apply agree.
  - Mocks: 2024-25 benchmark mix of HIS 17 / GEO 16 / POL 24 / ECO 10 /
    ENV 7 / SCI 14 / CA 14 / UKGK 48; difficulty is spread by
    proportional dealing.
  - Uttarakhand: reuses 14 sets from `UTTARAKHAND_TEST_STRUCTURE.xlsx`
    (flagged or repeated questions are replaced like for like). Statehood
    I/II, Art/Crafts/Language, UK CA, Topper and Grand UK Mock are built
    fresh.
  - CSAT 1-6 are left empty.
- **Re-running `seed-phase6-tests.sql` after the load resets the CA test
  names and `total_questions`** (its upsert doesn't touch
  `question_ids`). If that happens, re-run the loader with `--apply`.

Admin question importer at `/test-platform/admin/questions` (Excel/CSV
upload, gated by a shared admin secret, not tied to student auth).

**Package store + dashboard (Phase 2A/2B)** — `/test-platform` (dashboard)
and `/test-platform/packages` (store). 9 real packages seeded: 6 test
series, 1 crash course, 2 combo bundles. Combo ownership unlocks its
component packages via `package_includes`. Store savings are computed
live from real prices (never a stored/invented discount). Display order
is fully data-driven from `packages.sort_order` — reordering, including
moving whole sections, is a SQL-only change, no code required.
Gamification tables exist (`badges`, `user_gamification`, `leaderboard`)
but nothing writes to them yet — see Pending.

**Payments (Phase 4)** — Razorpay, currently **TEST MODE only**, and
**gated off entirely in production** by `PAYMENTS_ENABLED` (must be
exactly `"true"`; the Buy button shows "Sales open soon / बिक्री जल्द
शुरू" and `create-order` refuses with a 403 otherwise — checked
server-side, not just hidden client-side). `create-order` reads price
from the database, never the browser. `verify` checks the Razorpay
signature server-side. `webhook` (`payment.captured`) is a backup path.
Both converge on the same guarded `UPDATE ... WHERE status = 'created'`
in `completeOrder()`, so however many times either path fires for an
order, the enrollment is created exactly once — verified live with a
real test-mode order, including calling `verify` twice and confirming
only one enrollment exists. Already-owned packages are blocked before
Razorpay is ever contacted. A bilingual receipt email sends on success.
Terms page at `/terms` (account sharing / suspension, refunds, access
validity), linked from every Buy button.

**Test release schedule** — `tests.release_at` (nullable `timestamptz`).
Dashboard shows "Unlocks on `<date>`" for a package's not-yet-released
tests. No test content is seeded yet, so this currently renders nothing
(correct, empty state) until real tests are imported.

**Test-taking flow (Phase 5)** — `/test-platform/tests/[testId]`
(instructions, marking scheme, Start/Resume/Reattempt, past attempts),
`/test-platform/attempts/[attemptId]` (the exam screen) and
`/test-platform/attempts/[attemptId]/result` (score, accuracy, percentile,
subject-wise table, full answer review with explanations). Released tests
on the dashboard are now clickable; a "Free Tests" section lists
`is_free_test` tests to every logged-in student.
- Access is checked server-side on every call: free test, or an active
  enrollment on a package containing the test (via `package_tests` or
  `tests.package_id`, combos included); release date enforced.
- Correct answers/explanations never reach the browser until the attempt
  is submitted (`toPublicQuestion`).
- Timer is server-authoritative (`attempts.start_time` + duration, 60s
  grace). Answers autosave on every click (plus retry + tab-close flush);
  saves after the deadline are refused; a late submit scores the last
  answers saved in time. Returning to an expired attempt auto-finalizes
  it. Hindi/English toggle, question palette, mark-for-review.
- Submit is exactly-once via the same guarded-UPDATE pattern as payments
  (`UPDATE attempts ... WHERE status = 'in_progress'`), so double-clicks
  and timer/manual races can't create two `results` rows.
- Scoring: `negative_marking_value` is a *fraction* of
  `marks_per_question` (0.33 = one-third). `attempts.score` / `percentage`
  are authoritative; `results.overall_score` is raw marks. Result page
  recomputes from `attempts.answers`, so it's correct even if the
  analytics insert failed.
- Unlimited reattempts; each is its own attempt + result row.
- Dashboard "Tests Taken" and "Average Score" now read real submitted
  attempts (gamification counters are still inert).
- Admin test builder at `/test-platform/admin/tests` (same
  admin login since Phase 9): name, duration, marks, negative fraction,
  optional release date, free flag, packages, and the ordered list of
  `questionId`s from the import sheet. Refuses unknown or duplicated
  question IDs rather than guessing.
- Lead-capture popup is suppressed on `/test-platform/*` and `/student/*`
  so it can't cover the exam screen.
- **Not yet verified against the live DB** — built and type-checked, the
  scoring logic unit-checked, and the exam UI checked in a browser with
  sample data, but no session so far has had Supabase credentials. First
  real run: import a few questions, create a free test, take it.

**My Courses + checkout polish (Phase 6, finished in the cloud session).**
- `/test-platform` is now "My Courses": one card per owned course (combo
  bundles expand to their components) with image, progress bar, validity
  and a big "Continue / जारी रखें" button; stats, free tests, referral
  card, then "Explore more courses" → `/courses`.
- Continue on a test series opens `/test-platform/course/[slug]`: "Up next"
  test, tests grouped by subject, each showing Start / score (→ result) /
  locked-until date / "Soon" (no questions attached yet).
- Checkout price breakdown now updates live when a code is applied: price,
  discount, store credit, total — and the button reads "Pay ₹<total>".
  Preview and real charge share one formula (`computeOrderTotal` in
  `src/lib/pricing.ts`), so the button always matches what Razorpay charges.
- Course cards/pages show `packages.image_url` when set (gradient otherwise).
- PWA: added iPhone home-screen meta (`appleWebApp`); the install bar is
  hidden on the exam screen, checkout and course pages so it never covers
  Prev/Next/Pay/Buy Now. Service worker still never caches pages or API
  responses (icons only).
- `seed-phase6-tests.sql` fixed before first run: it omitted
  `question_ids` (NOT NULL — the file would have failed) and
  `test_order`. Tests start with no questions; they show on course pages
  but can't be started until questions are attached.
- Slow-connection check (375px, 400 kbps, 4× CPU): login page first paint
  ≈2.7s, ~190 KB gzipped JS. The Supabase client (≈55 KB) was being
  shipped to browsers via `formatINR`; moved to `src/lib/format.ts`.

**Device limit, XP/streak/level, admin accounts (Phase 9).** SQL:
`schema-phase9-sessions-xp-admin.sql` — **required before deploying this
code** (without `user_sessions`, nobody can log in). Running it logs every
student out once; they log back in with an email code.
- **Device limit:** each login creates a `user_sessions` row; the cookie
  carries its id. Max 2 devices (`MAX_DEVICES` in `src/lib/auth-utils.ts`);
  a 3rd login revokes the oldest ("newest login wins", so a lost phone never
  locks anyone out). Logout revokes that device's row. The login screen
  states the rule. Checked against an in-memory DB stand-in: 3rd login logs
  out the 1st, logout revokes, forged and pre-Phase-9 cookies rejected.
- **XP/streak/level** (`src/lib/gamification.ts`, SQL `award_test_xp()`):
  per submitted test +10 for completing (+5 on a reattempt); first attempt
  only: + half the % score, +10 if ≥60%. Blank submissions earn nothing.
  Level n needs 50·n·(n−1) XP (L2 100, L3 300, L5 1000, max L25). Streak =
  consecutive India-time days with a submitted test; shown as 0 once broken.
  Awarded once per attempt inside `finalizeAttempt()` (after the
  exactly-once submit guard); a failure is logged and never blocks the
  result. Dashboard shows level progress and best streak; result page shows
  "+N XP". The SQL function was run on a real Postgres 16: streak/level
  transitions correct, idempotent re-run, and 20 simultaneous submits all
  counted (row lock). Attempts submitted before Phase 9 earned no XP (no
  backfill). Badges/leaderboard tables still unused.
- **Admin accounts:** admins are users with `role = 'admin'`, logging in
  with their own email code. `ADMIN_IMPORT_SECRET` is gone. Every
  `/test-platform/admin/*` page is behind a server-side role check (non-admins
  get a 404); every `/api/admin/*` route checks the role itself
  (`src/lib/admin.ts`). New admin home `/test-platform/admin`: tool links and
  add/remove admins by email (logged to `audit_logs`; you can't remove
  yourself). First admin: log in once, then run the `update users set
  role = 'admin' …` line at the bottom of the phase 9 SQL file with your
  email. My Courses shows an "Admin" button to admins.

**Test performance analysis (Phase 10).** SQL:
`schema-phase10-test-analysis.sql` — **required before deploying** (attempt
pages read the new columns).
- **During the test:** after answering, an optional "How sure?" row — Sure /
  Ruled out 2 / Ruled out 1 / Guess — saved with the answers
  (`attempts.confidence`).
- **Result page:** attempt strategy (attempted %, marks gained, lost to
  negative marking, net), guess analysis (accuracy and net marks per
  sureness level vs the 24.8% break-even, plus a personal rule such as
  "attempt only if you can rule out 2"), weakest topics, and "Why did this go
  wrong?" tags on each wrong/skipped question — concept / recall / misread /
  silly / time (`attempts.error_tags`).
- **My Performance** (`/test-platform/performance`, linked from My
  Courses): tests taken, average, total lost to negatives, score-trend chart
  (first attempts only, last 20), weakest/strongest topics across tests (≥5
  questions), error-type counts with the fix for each, guess analysis over
  all tests, list of every attempt.
- **Mentors:** admins can open any student's performance page and results
  (`/test-platform/admin` → Student performance, by email). Tagging is
  owner-only.
- Not yet: PYQ-weightage mapping of topics (bank topic names don't match
  the PYQ tracker's) and the gap-to-cutoff estimate (needs cutoff data).

**Mentorship booking (Phase 11).** SQL: `schema-phase11-mentorship-booking.sql`.
- Students who own the Mentorship package (My Courses → Continue) get
  `/test-platform/mentorship`: open 20-minute slots for the next 2 weeks,
  one booking per week, first come first served, optional "what to discuss"
  note, Join button with the meeting link, cancel up to 12 hours before,
  and past sessions with the mentor's written plan.
- Default hours (IST): Wednesday + Thursday 10:00–12:00 and 14:00–17:00
  = 30 slots/week for 25 seats. Slots start ≥2 hours from now.
- Admin `/test-platform/admin/mentorship`: upcoming/recent bookings with
  student contact + link to their performance page, write/save the plan,
  mark completed/no-show/cancel, set the one meeting link, edit weekly
  hours, block days off.
- The database enforces the rules: unique active booking per slot (two
  students clicking together → one wins) and per student per week. Verified
  on real Postgres 16 (race, per-week limit, rebook after cancel, re-run
  safe); slot generation checked against IST edge cases.
- Not built: email reminders, weekly report form, intake form (see the
  mentorship plan in chat). The Mentorship package description in the DB
  is updated by `seed-phase12-mentorship-cutoff.sql`.

**Gap to cutoff + mentee dashboard (Phase 12).** SQL:
`seed-phase12-mentorship-cutoff.sql` (after phase 11).
- Expected cutoff 110/150 stored in `app_settings`, editable in Admin →
  Mentees. Only full mocks (`tests.subject = 'Full Mock'` or ≥150 Q) are
  compared to it. Projection = average of the latest 3 full-mock first
  attempts, scaled to 150.
- Students: "Gap to expected cutoff" card on My Performance (projection,
  trend since first mock, negative marks lost per mock); every full-mock
  result says how far above/below the cutoff it is. Labelled as an
  estimate, not an official figure.
- Admin → Mentees (`/test-platform/admin/mentees`): every mentorship
  student in one table — tests, mocks, projected, gap, trend, negatives per
  mock, weakest topics, top error type, days since last test (red at 7+),
  next booked session — sorted furthest-below-cutoff first; name opens the
  full analysis. "Download CSV" (Excel-friendly, Hindi-safe).
- Mentorship: 30 seats (was 25), description/highlights/banner updated to
  the weekly format; price unchanged at ₹8,999 and still unlocks the Complete
  Prelims Pack, Premium Test Series and Crash Course. Default hours give 30
  slots/week — exactly one per seat; add a window in Admin → Mentorship if
  you want spare slots.

**Legal pages.** `/privacy`, `/refund-policy`, `/contact` (plus existing
`/terms`), linked from the footer, checkout and course pages; in the
sitemap. Refund rule: within 2 days of purchase and fewer than 3 videos
watched (3 tests for a test series; before the first session for
mentorship); failed/double payments always refunded. Owner name, address
and phone come from `content/settings.json` → `legal` (address/phone are
empty — Razorpay usually wants them; fill in before applying for live).
Video-watch counting for the refund rule arrives with the video player.

**Daily backup** — Vercel cron (`vercel.json`, `30 18 * * *` = 00:00 IST)
hits `/api/cron/daily-backup`, protected by `CRON_SECRET` (fails closed
if unset). Emails 3 CSVs (users — **no password hashes**, enrollments,
payment_orders) to bhanujoshi1910@gmail.com via Resend. Verified live:
correct row counts, correct headers, downloaded the actual CSV to
confirm no password data is present.

**Pricing engine + coupons + referrals (Phase 5).** Tested live end-to-end with temporary users,
cleaned up after: founding→regular price switch (simulated by temporarily backdating a test
package's `founding_ends_at`, both display and the actual Razorpay charge switched correctly, then
restored), a single-use coupon blocked on reuse at both `check-code` and `create-order` after being
consumed, the full referral loop (code generated on first purchase → self-referral blocked →
referee gets ₹200 off → referrer credited ₹200 on completion → credit auto-applied at the
referrer's next checkout with no code needed → balance correctly deducted), and the mentorship
seat cap (blocked the 2nd buyer once the 1 test seat was taken, confirmed the owner's flattened
entitlement chain unlocks Complete Prelims Pack + Premium Bundle + Crash Course).
- Founding/regular pricing: `packages.founding_price`/`regular_price`/`founding_ends_at` (genuine
  `timestamptz`). The effective price is computed fresh from these on every request — display
  (store/dashboard) and `create-order` (charge) both call the same `getPriceInfo()` — so the
  founding→regular switch on 30 Sep 2026 23:59:59 IST needs no redeploy and no cron. Store shows
  "Founding price ₹X, becomes ₹Y on 1 October" (bilingual) only while founding is active; no fake
  timers, no fake strike-through of an invented price — the only strike-through on the store is
  the real combo-savings comparison, unrelated to founding/regular.
- New `mentorship` product type joins `combo_bundle` as entitlement-granting in
  `getOwnedPackageIds` — buying "Prelims Mentorship with Bhanu Joshi" unlocks the Complete Prelims
  Pack and, transitively (flattened at the data level via `package_includes`, not recursive code),
  Premium Bundle and Crash Course too. Seat cap (`packages.seats_total`) enforced server-side in
  `create-order`, shown as "X seats left" on the store card.
- Coupons: `coupons` + `coupon_redemptions`. Two types — `single_use_percent` (admin generates N
  individually-unique codes like `UKD-7K3Q9P` from an unambiguous charset, no 0/O/1/I/L) and
  `multi_use_price_lock` (one named code that extends founding-price eligibility for whoever uses
  it, past the package's own cutoff). Reservation model: applying a code at checkout inserts a
  `reserved` redemption row good for 30 minutes; consumed only on verified payment; an abandoned
  reservation simply ages out of the availability count with no cleanup job needed. Admin page
  `/test-platform/admin/coupons` (same admin-secret gate): generate codes, create a price-lock
  code, table of all codes with status/used-by/order, copy buttons, CSV export.
- Referrals: `users.referral_code` (generated on a user's first paid enrollment) +
  `users.store_credit_paise`, plus `referral_redemptions` using the same reserve-then-consume
  pattern as coupons. Referee gets ₹200 off; referrer gets ₹200 store credit, auto-applied at
  their next checkout (not "a code," so it stacks with a coupon/referral code on the same order —
  the "one code per order" rule is about the coupon-or-referral field specifically). Self-referral
  blocked by user id, email, or phone match. Dashboard shows the code, a WhatsApp share button
  with a prefilled bilingual message, and the credit balance. Admin referrals list on the same
  `/test-platform/admin/coupons` page.
- Checkout has one "Have a coupon or referral code?" field. A lightweight `/api/payments/check-code`
  endpoint previews the discount without reserving (reservation is real order-creation only);
  `create-order` re-validates and reserves for real — the client-side preview is never trusted for
  the actual charge. The amount sent to Razorpay is always the server-computed total.
- Receipt email now shows price, discount (if any) and total paid.
- Wording: crash course description everywhere changed to "50 video lectures including 8-10 live
  sessions + PDF notes" (the corrected phrasing — live sessions are a subset of the 50, not
  additional). "Hours" mentions and the phrase "live crash course classes" removed from the
  package's own description (DB) and the legacy `/paid-courses` marketing page. Not touched:
  `content/courses.json` and `/paid-course` (singular) — neither contains "hours" or "live crash
  course classes", and they're pre-existing standalone marketing pages with their own different
  prices/structure, out of scope for a wording-only fix.

**Security fixes made along the way:**
- Row Level Security enabled on every table (verified via direct anon-key
  probes — insert/select were open before `enable-rls.sql`, both blocked
  after).
- `.env.local` was committed to git in an early commit, before
  `.gitignore` covered it — untracked from git (file kept locally).
  **The repo is public and the old commit still exposes the live
  Razorpay book-order key/secret — not yet rotated or scrubbed from
  history. This is still outstanding, see Pending.**
- A timezone parsing bug (naive `timestamp` columns silently misread as
  local time by JS's `Date`, not UTC) broke password-reset token
  expiry — found and fixed; new timestamp columns (`tests.release_at`)
  are deliberately `timestamptz` to avoid the same class of bug.

## Pending

- **Rotate/scrub the exposed Razorpay live key** from git history (see
  above) — flagged repeatedly, not yet actioned.
- **Question bank not in the DB yet.** The Phase 8 loader is ready and its
  dry run is clean. To apply it, run the phase 6 SQL (if not already run),
  then `schema-phase8-question-bank.sql`, then
  `npx --yes tsx scripts/load-question-bank.ts --apply`. CSAT tests
  have no questions (none in the bank).
- **Gamification is inert.** `user_gamification`/`badges`/`leaderboard`
  tables exist, but nothing increments XP, level, or streak yet. The
  test-taking flow now exists, so this can hook into `finalizeAttempt()`
  in `src/lib/tests.ts`.
- **No edit/delete for tests** in the admin builder — fix mistakes in the
  Supabase table editor for now. The 62 seeded Premium Test Series tests
  also need their questions attached: there's no admin screen for that
  yet (the builder only creates new tests).
- **Video course delivery.** `videos` table exists; no player/UI.
- **Cross-path payment idempotency untested.** Verified `verify` called
  twice is idempotent; verified logic is identical for the webhook path,
  but the webhook itself needs a live deploy + real Razorpay-triggered
  event to test directly (Razorpay can't reach localhost).
- **Razorpay still TEST MODE.** Switching to live is 3 env var value
  changes (`RAZORPAY_TEST_KEY_ID`, `RAZORPAY_TEST_KEY_SECRET`,
  `RAZORPAY_WEBHOOK_SECRET` → live values, live webhook registered
  separately) plus setting `PAYMENTS_ENABLED=true` in Vercel — no code
  changes needed.

## SQL files

All under `website/supabase/`. Run manually in the Supabase SQL Editor —
this session has no way to execute DDL directly. Every file is written
idempotent (`IF NOT EXISTS`, `ON CONFLICT ... DO UPDATE`, no
`DROP`/`DELETE`/`TRUNCATE`) so re-running is safe.

| File | Purpose | Status |
|---|---|---|
| `schema.sql` | Reference/documentation of the pre-existing schema (users, questions, packages, tests, enrollments, attempts, results, etc.) — **not meant to be run**, just a snapshot for reference | N/A |
| `enable-rls.sql` | Enables RLS + revokes anon/authenticated grants on every table | ✅ Run |
| `schema-phase2.sql` | Gamification tables (`badges`, `user_gamification`, `leaderboard`, `videos`), `packages` pricing columns | ✅ Run |
| `schema-phase2b.sql` | `packages.access_valid_till`/`metadata`, `package_includes` table | ✅ Run |
| `seed-packages.sql` | The 9 real packages + their `package_includes` rows | ✅ Run |
| `update-package-sort-order.sql` | Sets the current `sort_order` values (Combo Bundles → Test Series → Crash Course) | ✅ Run |
| `schema-phase3-password-reset.sql` | `password_reset_tokens.used_at`, `users.password_changed_at` | ✅ Run |
| `schema-phase4-payments.sql` | `payment_orders` table, `tests.release_at` | ✅ Run |
| `schema-phase5-pricing.sql` | `packages.founding_price`/`regular_price`/`founding_ends_at`/`seats_total` | ✅ Run |
| `schema-phase5-coupons.sql` | `coupons`, `coupon_redemptions` tables | ✅ Run |
| `schema-phase5-referrals.sql` | `users.referral_code`/`store_credit_paise`, `referral_redemptions`, `payment_orders.original_amount`/`discount_amount`/`credit_applied` | ✅ Run |
| `seed-phase5-pricing-update.sql` | Renames the combo to Complete Prelims Pack, sets founding/regular prices on 8 packages, deactivates Standard + Standard/Crash combo, inserts the new mentorship package + its `package_includes` | ✅ Run |
| `schema-phase6-content.sql` | `packages.slug`/`image_url`/`highlights`/`curriculum`/`faq`, `banners` table, `tests.subject`, unique `package_tests(package_id, test_id)` | ✅ Run |
| `seed-phase6-content.sql` | Slugs, highlights, curriculum (crash course lecture list), FAQ, 4 home banners | ✅ Run |
| `seed-phase6-tests.sql` | The 62 Premium Test Series tests (empty `question_ids`) + `package_tests` with `test_order` | ✅ Run |
| `schema-phase7-otp-login.sql` | `users.password_hash` nullable, unique `lower(email)`, `login_codes` table | ✅ Run |
| `schema-phase8-question-bank.sql` | Unique index on `questions(question_id)` (the loader upserts on it), `tests.question_ids` default `'{}'` | Not run — run after phase 6, before the loader's `--apply` |
| `schema-phase9-sessions-xp-admin.sql` | `user_sessions` (device limit), `user_gamification.last_active_date` + `award_test_xp()`, admin-role notes | Not run — **required before deploying Phase 9**; then make yourself admin |
| `schema-phase10-test-analysis.sql` | `attempts.confidence`, `attempts.error_tags` | Not run — **required before deploying Phase 10** |
| `schema-phase11-mentorship-booking.sql` | Mentor availability (Wed/Thu defaults), blocked days, bookings with slot + per-week uniqueness, `app_settings` | Not run |
| `seed-phase12-mentorship-cutoff.sql` | Mentorship 30 seats + weekly-format text, cutoff 110/150 setting | Not run (after phase 11) |

## Environment variables

Names only — see `.env.example` for the annotated template. Secrets live
in `.env.local` (gitignored) and must be mirrored into Vercel's
Environment Variables separately; this session has never had Vercel
access, so Vercel's actual configured state should be spot-checked
against this list.

**Site (pre-existing, not part of the test platform):**
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (live — book orders),
`NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_GOOGLE_FORM_ID`,
`NEXT_PUBLIC_INSTAMOJO_API_KEY`, `INSTAMOJO_AUTH_TOKEN`,
`INSTAMOJO_API_URL`, `NEXT_PUBLIC_CURRENT_AFFAIRS_SHEET_ID`,
`NEXT_PUBLIC_PYQ_SHEET_ID`, `NEXT_PUBLIC_YOUTUBE_API_KEY`,
`GITHUB_OAUTH_ID`, `GITHUB_OAUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_YOUTUBE_CHANNEL`, `NEXT_PUBLIC_TELEGRAM_CHANNEL`

**Test platform — Supabase:**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`

**Test platform — auth:**
`SESSION_SECRET` — was found missing from Vercel once already (broke
login/register in production); confirm it's still there after any
redeploy.

**Test platform — admin:** none (role-based since Phase 9; `ADMIN_IMPORT_SECRET` can be deleted from Vercel)

**Test platform — email (Resend):**
`RESEND_API_KEY`

**Test platform — payments (Razorpay):**
`RAZORPAY_TEST_KEY_ID`, `RAZORPAY_TEST_KEY_SECRET`,
`RAZORPAY_WEBHOOK_SECRET`, `PAYMENTS_ENABLED`

**Test platform — cron:**
`CRON_SECRET`

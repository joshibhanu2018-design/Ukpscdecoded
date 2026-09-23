# UKPSC Decoded — Test Platform Progress

Status snapshot of `/student/*` and `/test-platform/*` — the Supabase-backed
test platform built alongside the existing static site. Update this file
when phases land or SQL files get run.

## What's done

**Auth (Phase 1)** — `/student/signup`, `/student/login`, `/student/forgot-password`,
`/student/reset-password`. Bcrypt password hashing, stateless HMAC-signed
session cookies (no `sessions` table — the token carries `{sub, iat, exp}`
and is verified against `users.password_changed_at` on each request).
Admin question importer at `/test-platform/admin/questions` (Excel/CSV
upload, gated by a shared admin secret, not tied to student auth).

**Password reset (Phase 3)** — Resend-powered, bilingual email, 1-hour
single-use token (hashed at rest, never stored raw), rate-limited to 3
emails/hour/address, always returns an identical response regardless of
whether the email exists. Resetting invalidates every session for that
user (via `password_changed_at`) in the same write as the password
update.

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

**Daily backup** — Vercel cron (`vercel.json`, `30 18 * * *` = 00:00 IST)
hits `/api/cron/daily-backup`, protected by `CRON_SECRET` (fails closed
if unset). Emails 3 CSVs (users — **no password hashes**, enrollments,
payment_orders) to bhanujoshi1910@gmail.com via Resend. Verified live:
correct row counts, correct headers, downloaded the actual CSV to
confirm no password data is present.

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
- **No actual test-taking flow.** `tests`, `package_tests`, `attempts`,
  `results` all exist and are wired into the dashboard/progress logic,
  but are empty — nobody can take a test yet. This is the next big piece
  of work.
- **No question content imported.** The admin Excel importer works, but
  no real question bank has been loaded via it yet.
- **Gamification is inert.** `user_gamification`/`badges`/`leaderboard`
  tables and the dashboard stat tiles exist, but nothing increments XP,
  level, or streak — that only happens once the test-taking flow exists.
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
- **Admin auth is a shared secret**, not real per-admin roles.

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

**Test platform — admin:**
`ADMIN_IMPORT_SECRET`

**Test platform — email (Resend):**
`RESEND_API_KEY`

**Test platform — payments (Razorpay):**
`RAZORPAY_TEST_KEY_ID`, `RAZORPAY_TEST_KEY_SECRET`,
`RAZORPAY_WEBHOOK_SECRET`, `PAYMENTS_ENABLED`

**Test platform — cron:**
`CRON_SECRET`

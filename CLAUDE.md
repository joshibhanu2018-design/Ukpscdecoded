# UKPSC Decoded — guide for Claude Code

Owner: Bhanu Joshi (non-developer; explain steps plainly, one command per
line). Live site: https://www.ukpscdecoded.in (Next.js 16 in `website/`,
Supabase database, Vercel hosting, Razorpay live payments, Resend email).
The owner works on **Windows** in `C:\Users\hp\Documents\Ukpscdecoded`, in
PowerShell: use `npm.cmd` / `npx.cmd`, and `cd` into a folder before running
commands in it.

## Read first
1. `website/docs/HANDOFF.md` — where everything stands, open items, how-tos.
2. `website/docs/PROGRESS.md` — how the platform works, every SQL phase, env vars.
3. `website/docs/APP_PLAN.md` — the Android app plan (next big task).

## Rules (the repo is PUBLIC)
- Never commit `.xlsx`, `.csv`, `.env*`, API keys or question data. The
  question workbooks live in `test series questions/` (git-ignored).
- Never paste secrets into chat or ask the owner to screenshot them.
- Database changes: write an idempotent SQL file in `website/supabase/`
  (no DROP / DELETE / TRUNCATE) and give the owner the SQL to run in the
  Supabase SQL Editor. Don't write to the live database from scripts,
  except the question loader's `--apply` after the owner has seen the dry run.
- Question bank: edit the workbooks (back them up first), run
  `npx.cmd --yes tsx scripts/load-question-bank.mts` (dry run) in `website/`,
  show the summary, and only then `--apply`. "Tests below target size" must
  be "none". `scripts/audit-question-bank.mts` finds suspicious questions.
- Bad or doubtful question: fix it in the workbook, or give it a
  Review_Flag (the loader replaces it); never leave a wrong question live.
- Before finishing code changes: `npx.cmd tsc --noEmit` in `website/` must
  be clean; check pages at phone width (375 px) too.
- Git: work on a new branch (`git checkout -b <topic>`), commit, `git push -u
  origin <topic>`, then open the pull request link GitHub prints and let the
  owner click Merge. Vercel deploys `main` automatically. Update
  `website/docs/HANDOFF.md` at the end of each piece of work.

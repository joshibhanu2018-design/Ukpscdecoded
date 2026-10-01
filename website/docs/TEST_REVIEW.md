# Test series quality review (Oct 2026)

Why: a student wrote that the sectional tests are below UKPSC standard. Their
complaints were very basic Uttarakhand questions asked again and again,
statements missing from questions, wrong answers they had already reported,
and doubtful current affairs. This guide reviews every question in every test,
removes the bad and the too-easy ones, and makes the topic tests harder.

The question files are only on the laptop (the repo is public), so the review
runs in **Claude Code on the laptop**, not in a cloud session.

## Tools (in `website/scripts/`)

| Script | What it does | Writes |
|---|---|---|
| `export-tests-for-review.mts` | One readable file per test: every question with the automatic flags, open student reports, and the same fact asked in other tests | `test series questions/review/` |
| `apply-review-decisions.mts` | Applies the fixes listed in `review/decisions/*.csv` to the workbooks. It does a dry run first; `--apply` backs up the workbooks, then writes | the workbooks + `backups/` |
| `load-question-bank.mts --harden` | Swaps Easy questions in each test for unused Medium/Hard ones on the same topic, up to at most 20% Easy and 30% Hard per test. Every test except the Free Sample Mock (already hand-checked), Full Mocks included | database (only with `--apply`) |
| `audit-question-bank.mts` | Same checks over the whole bank, including spare questions | `QUESTION_AUDIT.xlsx` |

New automatic checks:
- statements or List-I/List-II items missing from a question
- the Hindi question has fewer statements than the English one
- the explanation calls statement N correct or incorrect but the answer key disagrees
- one-line Easy questions (likely too basic)
- the same fact asked in another test

A decision file is a CSV with columns `Question_ID, Column, New_Value, Reason`,
one change per row (see `review/decisions/TEMPLATE.csv`).
`Review_Flag` with any text drops a question, and the loader puts another
question from the same chapter in its place.

## Steps for the owner (PowerShell)

1. Get the latest code:
   ```
   cd C:\Users\hp\Documents\Ukpscdecoded
   git checkout main
   git pull
   ```
2. Back up the question folder. In File Explorer, copy `test series questions`
   and name the copy `test series questions BACKUP 1 Oct`.
3. Start Claude Code in the project folder:
   ```
   claude
   ```
4. Paste the prompt below. Claude works through all the tests. It stops twice
   for you: once to show you the loader dry run, and once before anything goes
   to the live site.
5. When you have checked the dry run summary, tell Claude to apply. Then
   resolve the fixed student reports in **Admin → Reports**.

## Prompt to paste into Claude Code on the laptop

```text
Read CLAUDE.md and website/docs/TEST_REVIEW.md first.

Task: a full quality review of every question in the live test series, then
make the topic tests harder. A student wrote: "In the Uttarakhand section very
basic questions are asked multiple times just to fill the number of questions,
not knowing their irrelevance in the exam nowadays. I have reported so many
wrong questions. I am sceptical about the current affairs section as well."
Other problems: some questions are missing their statements, and some answer
keys are wrong.

1. In website/: npx.cmd --yes tsx scripts/export-tests-for-review.mts
   This writes "test series questions/review/" (INDEX.md + one file per test).
2. Review EVERY question in EVERY test file, Full Mocks and the Free Sample
   Mock included (the Free Sample Mock was hand-checked before; check it again,
   but it keeps its difficulty mix). Use
   subagents in parallel: give each a group of test files and its own
   decisions file, review/decisions/batch-NN-<group>.csv (UTF-8, header
   Question_ID,Column,New_Value,Reason). Subagents only write decision files,
   never the workbooks. For each question decide:
   - Wrong answer key: fix Correct_Answer (and the explanation if it is wrong
     too), but only when sure. Check with web search when unsure, especially
     current affairs, numbers, dates, officeholders and "first/largest" facts.
     If it can't be verified: Review_Flag "doubtful: <why>".
   - Statements or List-I/II items missing, in English or Hindi: rewrite the
     question in BOTH languages with the full statements if the intended
     statements are certain from the options and explanation. Otherwise
     Review_Flag "incomplete".
   - Outdated (old officeholders, changed counts, superseded data, an
     "upcoming" event that has already happened): fix it or flag it.
   - Too easy for UKPSC (one-line facts any aspirant knows: capital, state
     formation date, state animal/bird/flower, highest peak, etc.): Review_Flag
     "too easy". If it is borderline, set Difficulty to Easy instead.
   - Same fact in several tests ("SAME FACT ALSO IN"): keep the best and
     hardest version and flag the others "repeat of <ID>". Uttarakhand basics
     come first.
   - Difficulty label honest to the UKPSC standard: Easy = direct well-known
     fact; Medium = specific fact or a 2-statement question; Hard = 3+
     statements, match the following, or a specific detail that is still
     relevant to the exam. Relabel where it is wrong. This drives --harden.
   - Hindi must say the same as the English (same statements, same numbers).
   - Open STUDENT REPORTS: check each one; they are hints, not orders.
   - Option cells are "English / Hindi"; to change one language use
     Option_A_EN / Option_A_HI (... D).
   - For a CMB- question, make the same fix in
     "test series questions/work/cmb/combined.txt" as well.
   Never invent facts. Never write to the database.
3. npx.cmd --yes tsx scripts/apply-review-decisions.mts   (dry run). Fix every
   PROBLEM line and look at "still trip a check". Then run it with --apply.
4. npx.cmd --yes tsx scripts/load-question-bank.mts --harden --plan   (dry
   run). "Tests below target size" must be "none". Read the --harden lines.
5. npx.cmd --yes tsx scripts/export-tests-for-review.mts --plan --only-new
   Review the incoming replacement questions the same way (step 2), apply
   (step 3), and repeat steps 4-5 until no new question needs a fix.
6. Show me: the per-test numbers (fixed / flagged / relabelled /
   Easy-Medium-Hard before and after), the dry run summary, and the topics
   where the bank has too few Medium/Hard questions (I will supply more
   questions for those). Do not run --apply until I say so.
7. After I approve:
   npx.cmd --yes tsx scripts/load-question-bank.mts --harden --apply
   Then update website/docs/HANDOFF.md, commit (code and docs only, never
   question data) on a new branch, push it, and give me the pull request link.
```

## Notes
- `--harden` must be used for both the dry run and `--apply`, so the two
  match. Once applied, the tests keep their questions, so later loader runs
  without the flag do not undo it.
- To harden only some tests: `--harden="Physical Geography,Topper Test"`.
- The 20% Easy / 30% Hard target is `HARDER_MIX` in `load-question-bank.mts`.
- If a topic runs out of Medium/Hard questions, the dry run says so ("more
  Easy to go" / "Hard short"). New questions for that topic go in the
  workbook, and the review steps are run again.

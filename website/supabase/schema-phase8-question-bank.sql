-- UKPSC Test Platform — Phase 8: question bank load
-- Run in the Supabase SQL Editor BEFORE `scripts/load-question-bank.ts --apply`.
-- Idempotent — safe to re-run.
--
-- 1. questions.question_id becomes unique, so the loader can upsert on it
--    (re-running the loader updates rows instead of duplicating them).
-- 2. tests.question_ids gets an empty-array default, so inserting a test
--    without questions no longer needs an explicit '{}'.

-- Optional pre-check: if this returns rows, the unique index below will
-- fail. Resolve those duplicates first (keep one row per question_id).
--   select question_id, count(*) from questions group by question_id having count(*) > 1;

create unique index if not exists questions_question_id_key on questions (question_id);

alter table tests alter column question_ids set default '{}'::uuid[];

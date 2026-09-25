-- UKPSC Test Platform — Phase 14 (Batch 2): per-attempt question snapshot,
-- question source/format/section columns for the bank browser, Free Sample Mock.
-- Not run yet. Run this BEFORE deploying Batch 2 and BEFORE re-running the
-- loader with --apply. Safe to re-run: ADD COLUMN / CREATE ... IF NOT EXISTS,
-- the backfill only touches rows that are still empty, the insert is an
-- upsert on a fixed id. No DROP/DELETE/TRUNCATE.

-- ========== attempts keep the question list they were started with ==========
-- The loader re-composes tests (Batch 2). Without a snapshot, a past result
-- would re-read the NEW tests.question_ids and show different questions
-- against the old answers. New attempts store the list when they start;
-- this backfills every existing attempt with its test's CURRENT list, which
-- is what it was taken on (tests have not been re-composed since the first load).
alter table attempts add column if not exists question_ids uuid[];

update attempts a
set question_ids = t.question_ids
from tests t
where t.id = a.test_id
  and a.question_ids is null
  and coalesce(array_length(t.question_ids, 1), 0) > 0;

-- ========== questions: where each one came from, and its format ==========
-- Set by scripts/load-question-bank.ts; used by Admin → Question Bank filters.
alter table questions add column if not exists source_file text;
alter table questions add column if not exists question_format text;
alter table questions add column if not exists section_code text;

create index if not exists questions_section_code_idx on questions (section_code);
create index if not exists questions_source_file_idx on questions (source_file);
create index if not exists tests_question_ids_gin on tests using gin (question_ids);

-- ========== Free Sample Mock ==========
-- Open to every logged-in student (is_free_test). Not in any package. The
-- loader fills it with 50 questions that are in no paid test.
insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes,
                   negative_marking_enabled, negative_marking_value, marks_per_question, is_free_test, question_ids)
values ('4cc0172f-6f95-4c69-b6dc-0944a16c5725', 'Free Sample Mock', null, 'Free Sample', 50, 40,
        true, 0.25, 1.0, true, '{}'::uuid[])
on conflict (id) do update set
  test_name = excluded.test_name, subject = excluded.subject, is_free_test = true,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

-- UKPSC Test Platform — Phase 43: finish the student-report fixes (Nov 2026)
-- Safe to re-run. No DROP / DELETE / TRUNCATE.
-- Run AFTER: npx.cmd --yes tsx scripts/load-question-bank.mts --apply
--
-- The loader only fills its own 57 tests. The Revision tests and the Warm-up
-- Mock are copies made by phases 37 and 42, so:
-- 1. Questions the loader replaced are replaced in the Revision tests too.
-- 2. The Warm-up Mock is copied from Full Mock 6 (fewest flags, no reports,
--    only 6 students have seen it), only while nobody has attempted it.
-- 3. The dropped questions are set inactive, so the Telegram daily quiz
--    (telegram_unused_questions: active and in no test) cannot post them.
--
-- A student's past attempt keeps its own copy of the question list
-- (attempts.question_ids), so old results are not affected.

-- ========== 1. Same replacements in the Revision tests ==========
with swaps(test_name, old_qid, new_qid) as (values
  ('Uttarakhand Revision 2', 'UKPCS-UKGK-CH04-0449', 'UKPCS-UKGK-CH04-0099'),
  ('Uttarakhand Revision 3', 'UKPCS-UKGK-CH01-0462', 'UKPCS-UKGK-CH01-0239'),
  ('Uttarakhand Revision 5', 'UKPCS-UKGK-CH09-0029', 'UKPCS-UKGK-CH09-0006'),
  ('Uttarakhand Revision 7', 'UKPCS-UKGK-CH12-0027', 'UKPCS-UKGK-CH12-0442'),
  ('Uttarakhand Revision 8', 'UKPCS-UKGK-CH04-0051', 'UKPCS-UKGK-CH04-0114')
),
resolved as (
  select s.test_name, o.id as old_id, n.id as new_id
  from swaps s
  join questions o on o.question_id = s.old_qid
  join questions n on n.question_id = s.new_qid
)
update tests t set
  question_ids = array_replace(t.question_ids, r.old_id, r.new_id),
  updated_at = now()
from resolved r
where t.test_name = r.test_name
  and r.old_id = any(t.question_ids)
  and not (r.new_id = any(t.question_ids));

-- ========== 2. Warm-up Mock: copy from Full Mock 6, only if not attempted yet ==========
update tests w set
  question_ids = s.question_ids,
  total_questions = cardinality(s.question_ids),
  updated_at = now()
from tests s
where w.id = '5d1a7c3e-2b8f-4e61-9a0d-7f3c2e8b4a15'
  and s.id = '8a975a03-4438-4633-bc11-8b31366821da'   -- Full Mock 6
  and cardinality(s.question_ids) > 0
  and not exists (select 1 from attempts a where a.test_id = w.id);

-- ========== 3. Dropped questions: inactive ==========
update questions set
  status = 'inactive',
  deactivated_at = now(),
  updated_at = now()
where coalesce(status, 'active') <> 'inactive'
  and question_id in (
    'UKPCS-UKGK-CH04-0449', 'UKPCS-UKGK-CH01-0462', 'UKPCS-UKGK-CH01-0347',
    'UKPCS-UKGK-CH04-0053', 'UKPCS-UKGK-CH04-0051', 'UKPCS-UKGK-CH09-0029',
    'UKPCS-HIS-ANC-0009',   'UKPCS-UKGK-CH12-0027', 'UKPCS-UKGK-CH05-0028',
    'UKPCS-UKGK-CH12-0440', 'UKPCS-UKGK-CH12-0441', 'UKPCS-UKGK-CH04-0112'
  );

-- Checks:
-- a) Every Revision test should still have 100 questions, and the second column should be 0.
select t.test_name, cardinality(t.question_ids) as questions,
       (select count(*) from questions q
         where q.id = any(t.question_ids)
           and q.question_id in ('UKPCS-UKGK-CH04-0449', 'UKPCS-UKGK-CH01-0462', 'UKPCS-UKGK-CH09-0029',
                                 'UKPCS-UKGK-CH12-0027', 'UKPCS-UKGK-CH04-0051')) as dropped_still_in
from tests t where t.test_name like 'Uttarakhand Revision _' order by t.test_name;
-- b) The Warm-up Mock should match Full Mock 6: same_questions = 150.
select cardinality(w.question_ids) as questions,
       (select count(*) from unnest(w.question_ids) u where u = any(s.question_ids)) as same_questions
from tests w, tests s
where w.id = '5d1a7c3e-2b8f-4e61-9a0d-7f3c2e8b4a15' and s.id = '8a975a03-4438-4633-bc11-8b31366821da';

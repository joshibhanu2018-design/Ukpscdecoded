-- UKPSC Test Platform — Phase 42: free Warm-up Mock + Rank Challenge early-bird price
-- Safe to re-run: one INSERT ... ON CONFLICT and two UPDATEs. No DROP / DELETE / TRUNCATE.
-- Run AFTER phases 37-41 (phase 37 clears the founding price if it is run again later).
--
-- 1. Warm-up Mock: a free 150-question full mock, open now till 11 Nov 11:59 pm.
--    Students see their rank straight after submitting; the rank list stays live
--    and changes as more students take it (first attempt only). It is a copy of
--    one Basic full mock (Full Mock 6, the strongest after the 4 Nov question review). To use another one, put its id
--    in section 1b and run this file again. Basic Full Mock ids:
--      1 059f628c-4507-4a9b-8982-2534a0d8730b   2 dec69639-4eda-49f6-a32f-19511c9b4ba4
--      3 eba11ee4-7602-412e-b61a-758daa43d122   4 2f4fdf1a-90a2-424d-aece-e828f9854dda
--      5 13ee29fd-b35d-4a96-bc1e-ce289cfba6bf   6 8a975a03-4438-4633-bc11-8b31366821da
--    Run it again after the laptop question fixes, so the warm-up gets the fixed questions.
-- 2. Only the Warm-up is free: all 6 Rank Challenge mocks are paid (Mock 1 was free).
-- 3. All Uttarakhand Rank Challenge (mock-mahasangram): ₹399 till 11 Nov 11:59 pm,
--    then ₹499. The site shows ₹499 struck through and "till 11 November".
--    Revision Test Series stays ₹999; the ₹500 upgrade is unchanged.

-- ========== 1a. Warm-up Mock ==========
insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes,
                   negative_marking_enabled, negative_marking_value, marks_per_question, is_free_test, question_ids)
values ('5d1a7c3e-2b8f-4e61-9a0d-7f3c2e8b4a15', 'Warm-up Mock (free)', null, 'Full Mock', 150, 120,
        true, 0.25, 1.0, true, '{}'::uuid[])
on conflict (id) do update set
  test_name = excluded.test_name, is_free_test = true, updated_at = now();

update tests set
  live_series = 'warmup',
  release_at = '2026-11-03 18:30:00+00',   -- 4 Nov, 12:00 am IST (open now)
  rank_until = '2026-11-11 18:29:59+00',   -- 11 Nov, 11:59 pm IST
  result_at  = '2026-11-03 18:30:00+00',   -- results and rank shown straight away
  updated_at = now()
where id = '5d1a7c3e-2b8f-4e61-9a0d-7f3c2e8b4a15';

-- ========== 1b. Questions: copy them from one Basic full mock ==========
update tests w set
  question_ids = s.question_ids,
  total_questions = cardinality(s.question_ids),
  updated_at = now()
from tests s
where w.id = '5d1a7c3e-2b8f-4e61-9a0d-7f3c2e8b4a15'
  and s.id = '8a975a03-4438-4633-bc11-8b31366821da'   -- << the Basic mock to copy (Full Mock 6, picked by the 4 Nov question review)
  and not exists (select 1 from attempts a where a.test_id = w.id)   -- never swap once students have taken it
  and cardinality(s.question_ids) > 0;

-- ========== 2. Only the Warm-up is free: Rank Challenge Mock 1 (Full Mock 7) becomes paid ==========
update tests set is_free_test = false, updated_at = now()
where id = '7a976496-51a7-48b2-8142-2a559a734982';

update packages set
  description = replace(description, 'Mock 1 free for everyone', 'free Warm-up Mock to try first'),
  updated_at = now()
where slug = 'mock-mahasangram';

-- ========== 3. Early-bird price ==========
update packages set
  founding_price = 399,
  regular_price = 499,
  founding_ends_at = '2026-11-11 23:59:59+05:30',
  updated_at = now()
where slug = 'mock-mahasangram';

-- Check:
select test_name, cardinality(question_ids) as questions, is_free_test, live_series, release_at, rank_until
from tests where id = '5d1a7c3e-2b8f-4e61-9a0d-7f3c2e8b4a15';
select slug, price, founding_price, regular_price, founding_ends_at from packages where slug = 'mock-mahasangram';

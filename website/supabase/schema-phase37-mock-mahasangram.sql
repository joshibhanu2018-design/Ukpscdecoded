-- UKPSC Test Platform — Phase 37: Mock Mahasangram (live rank challenge)
-- Run in the Supabase SQL Editor. Safe to re-run. No DROP / DELETE / TRUNCATE.
--
-- What it does:
--   * tests.live_series / rank_until / result_at: a live mock opens at release_at
--     (12 noon), only first attempts started by rank_until (6 pm) are ranked,
--     and the result, solutions and rank list appear at result_at (8 pm).
--   * users.district (shown on the rank list) and users.signup_source.
--   * Six empty mocks, "Mahasangram Mock 1" … "Mahasangram Mock 6" (150 Q,
--     120 min). Mock 1 is free for every logged-in student. The question
--     loader fills them later; until then they can't be started.
--   * Package "Mock Mahasangram - Rank Challenge" (slug mock-mahasangram, ₹500),
--     switched on only when all 6 mocks have 150 questions.
--   * coupons.package_slugs: lock a code to some packages.
--   * Returning-buyer price: a package's metadata.returning_price (set later for
--     the Revision Test Series) is what students who own another paid package
--     (not Premium / Complete Pack / Mentorship) pay. Checked at checkout.
--   * Premium, Complete Prelims Pack, Mentorship and crash course owners get the
--     mocks free through the website code (src/lib/tests.ts), not through SQL.
--
-- Times below are written in UTC (IST minus 5:30): 06:30 = 12 noon IST,
-- 12:30 = 6 pm IST, 14:30 = 8 pm IST. UTC works whichever way release_at was
-- created. To move a date: change that mock's three times and re-run.

alter table tests add column if not exists release_at timestamptz;
alter table tests add column if not exists live_series text;
alter table tests add column if not exists rank_until timestamptz;
alter table tests add column if not exists result_at timestamptz;

alter table users add column if not exists district text;

-- A coupon can be locked to some packages (null = any package), e.g. the
-- 10% code for book buyers works only on the Mahasangram / Revision Series.
alter table coupons add column if not exists package_slugs text[];
-- Example (after creating the code in Admin -> Coupons):
-- update coupons set package_slugs = array['mock-mahasangram', 'revision-test-series'] where code = 'BOOK10';
alter table users add column if not exists signup_source text;

-- ========== The six mocks ==========
insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes,
                   negative_marking_enabled, negative_marking_value, marks_per_question, is_free_test,
                   question_ids, live_series, release_at, rank_until, result_at)
values
  ('411633c8-8134-42bd-ae97-d6bd55324981', 'Mahasangram Mock 1', null, 'Full Mock', 150, 120, true, 0.25, 1.0, true,  '{}'::uuid[], 'mahasangram',
   '2026-11-15 06:30:00+00', '2026-11-15 12:30:00+00', '2026-11-15 14:30:00+00'),
  ('4f9551c2-071c-4857-a70c-ed0772e230e1', 'Mahasangram Mock 2', null, 'Full Mock', 150, 120, true, 0.25, 1.0, false, '{}'::uuid[], 'mahasangram',
   '2026-11-18 06:30:00+00', '2026-11-18 12:30:00+00', '2026-11-18 14:30:00+00'),
  ('dc5b5ff1-24fa-44a9-97a0-2cb5f6107c44', 'Mahasangram Mock 3', null, 'Full Mock', 150, 120, true, 0.25, 1.0, false, '{}'::uuid[], 'mahasangram',
   '2026-11-20 06:30:00+00', '2026-11-20 12:30:00+00', '2026-11-20 14:30:00+00'),
  ('37403a0a-4dc9-4d72-9edc-c8d1b82d4c45', 'Mahasangram Mock 4', null, 'Full Mock', 150, 120, true, 0.25, 1.0, false, '{}'::uuid[], 'mahasangram',
   '2026-11-22 06:30:00+00', '2026-11-22 12:30:00+00', '2026-11-22 14:30:00+00'),
  ('ad3f5a09-5acf-448b-972b-cefa68c4a6c8', 'Mahasangram Mock 5', null, 'Full Mock', 150, 120, true, 0.25, 1.0, false, '{}'::uuid[], 'mahasangram',
   '2026-11-25 06:30:00+00', '2026-11-25 12:30:00+00', '2026-11-25 14:30:00+00'),
  ('7eab1a0a-1a67-4441-9497-a39eb398edf2', 'Mahasangram Mock 6', null, 'Full Mock', 150, 120, true, 0.25, 1.0, false, '{}'::uuid[], 'mahasangram',
   '2026-11-27 06:30:00+00', '2026-11-27 12:30:00+00', '2026-11-27 14:30:00+00')
on conflict (id) do update set
  test_name = excluded.test_name, subject = excluded.subject, total_questions = excluded.total_questions,
  duration_minutes = excluded.duration_minutes, is_free_test = excluded.is_free_test,
  live_series = excluded.live_series, release_at = excluded.release_at,
  rank_until = excluded.rank_until, result_at = excluded.result_at, updated_at = now();
-- (question_ids is not overwritten on re-run, so loaded questions stay.)

-- ========== Package: Mock Mahasangram (₹500) ==========
insert into packages (id, package_name, description, price, package_type, total_tests, total_questions,
                      access_valid_till, sort_order, is_active, slug)
values ('00f607d5-2874-4391-bc76-29b90f60814c', 'Mock Mahasangram - Rank Challenge',
  '6 full-length mocks (150 Questions each), new questions, UKPSC Prelims pattern' || chr(10) ||
  'Same mock, same day: opens 12 noon, last start 6 pm, result and live rank list at 8 pm' || chr(10) ||
  'Ranks for everyone, stars for the top 20, 30% off for the top 3' || chr(10) ||
  'Mock 1 free for everyone',
  500, 'test_series', 6, 900, '2026-12-31', 15, false, 'mock-mahasangram')
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  total_tests = excluded.total_tests, total_questions = excluded.total_questions, updated_at = now();

update packages set
  founding_price = null, regular_price = null, founding_ends_at = null,
  highlights = '["6 full-length mocks, 150 new questions each", "Live rank list at 8 pm on each mock day", "Stars for the top 20, 30% off for the top 3", "Valid till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'Mock Mahasangram',
    'card_tagline', '6 live-ranked full mocks before 29 Nov'),
  updated_at = now()
where slug = 'mock-mahasangram';

insert into package_tests (package_id, test_id, test_order)
select '00f607d5-2874-4391-bc76-29b90f60814c'::uuid, v.test_id::uuid, v.ord
from (values
  ('411633c8-8134-42bd-ae97-d6bd55324981', 1), ('4f9551c2-071c-4857-a70c-ed0772e230e1', 2),
  ('dc5b5ff1-24fa-44a9-97a0-2cb5f6107c44', 3), ('37403a0a-4dc9-4d72-9edc-c8d1b82d4c45', 4),
  ('ad3f5a09-5acf-448b-972b-cefa68c4a6c8', 5), ('7eab1a0a-1a67-4441-9497-a39eb398edf2', 6)
) as v(test_id, ord)
on conflict (package_id, test_id) do nothing;

-- Switch the package on only when all 6 mocks have 150 questions.
update packages set
  is_active = (
    select count(*) = 6 from tests
    where live_series = 'mahasangram' and cardinality(question_ids) = 150
  ),
  updated_at = now()
where slug = 'mock-mahasangram';

-- Check:
-- select test_name, release_at, rank_until, result_at, cardinality(question_ids) from tests where live_series = 'mahasangram' order by release_at;

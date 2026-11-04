-- UKPSC Test Platform — Phase 37: Mock Mahasangram + Revision Test Series
-- Run in the Supabase SQL Editor. Safe to re-run. No DROP / DELETE / TRUNCATE.
--
-- What it does:
--   1. tests.live_series / rank_until / result_at: a live mock opens at release_at
--      (12 noon IST), only a student's FIRST attempt started by rank_until (6 pm)
--      is ranked, and the result, solutions and rank list appear at result_at (8 pm).
--   2. users.district (shown on the rank list), users.signup_source.
--   3. coupons.package_slugs: lock a code to some packages (null = any package).
--   4. Mock Mahasangram = Premium's Full Mock 7-12 (not in Basic), one every
--      3 days: 12, 15, 18, 21, 24, 27 Nov. Full Mock 7 (Mock 1) is free for all.
--      Package mock-mahasangram, ₹499 (different tests from Basic).
--   5. Revision Test Series, ₹999.
--   Existing students: anyone who owns another paid package (Basic, any crash
--   course, Uttarakhand/CA Intensive, CSAT …; not Premium / Complete Pack /
--   Mentorship) automatically gets 20% off both products when logged in
--   (metadata.returning_percent_off, checked at checkout): ₹399 and ₹799.
--   Revision Test Series contents:
--      Full Mock 7-12 + 6 CA tests of 100 Q + 8 Uttarakhand tests of 100 Q +
--      CSAT 5 and 6. The 100-Q tests are made by joining existing 50-Q tests in
--      pairs (CA Intensive tests 1+2, 3+4 … 11+12; Uttarakhand Intensive tests
--      1+2 … 15+16, in their store order). No new questions.
--   Premium and Complete Prelims Pack buyers get both products free (phase 38).
--
-- Times are written in UTC (IST minus 5:30): 06:30 = 12 noon IST, 12:30 = 6 pm,
-- 14:30 = 8 pm. To move a mock, change its three times and re-run.

alter table tests add column if not exists release_at timestamptz;
alter table tests add column if not exists live_series text;
alter table tests add column if not exists rank_until timestamptz;
alter table tests add column if not exists result_at timestamptz;

alter table users add column if not exists district text;
alter table users add column if not exists signup_source text;

alter table coupons add column if not exists package_slugs text[];
-- Example, after creating the 10% book-buyer code in Admin -> Coupons:
-- update coupons set package_slugs = array['mock-mahasangram', 'revision-test-series'] where code = 'BOOK10';

-- ========== 1. Mock Mahasangram: Full Mock 7-12 become live mocks ==========
update tests t set
  live_series = 'mahasangram',
  is_free_test = (v.mock = 1),
  release_at = v.opens::timestamptz,
  rank_until = v.last_start::timestamptz,
  result_at  = v.result::timestamptz,
  updated_at = now()
from (values
  ('7a976496-51a7-48b2-8142-2a559a734982', 1, '2026-11-12 06:30:00+00', '2026-11-12 12:30:00+00', '2026-11-12 14:30:00+00'),
  ('aa6a23d2-3297-4452-8434-5cf1bd00e648', 2, '2026-11-15 06:30:00+00', '2026-11-15 12:30:00+00', '2026-11-15 14:30:00+00'),
  ('46c5492d-4368-44d7-b235-e1d88eeafae5', 3, '2026-11-18 06:30:00+00', '2026-11-18 12:30:00+00', '2026-11-18 14:30:00+00'),
  ('68d91fd0-caeb-4e29-adb4-f2ac38639aa9', 4, '2026-11-21 06:30:00+00', '2026-11-21 12:30:00+00', '2026-11-21 14:30:00+00'),
  ('2c34dcc0-1ff2-42bc-94d4-78f286ad91f1', 5, '2026-11-24 06:30:00+00', '2026-11-24 12:30:00+00', '2026-11-24 14:30:00+00'),
  ('3865e0d9-7d4b-44ef-a2ec-0df07aad22d8', 6, '2026-11-27 06:30:00+00', '2026-11-27 12:30:00+00', '2026-11-27 14:30:00+00')
) as v(id, mock, opens, last_start, result)
where t.id = v.id::uuid;

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions,
                      access_valid_till, sort_order, is_active, slug)
values ('82a4acf8-95f4-4922-a135-dd7a97a211c9', 'Mock Mahasangram - Rank Challenge',
  '6 full-length mocks (150 Questions each), UKPSC Prelims pattern' || chr(10) ||
  'Different tests from the Basic Test Series (Basic has Full Mock 1-6; these are Full Mock 7-12)' || chr(10) ||
  'Same mock, same day: opens 12 noon, last start 6 pm, result and live rank list at 8 pm' || chr(10) ||
  'Mocks on 12, 15, 18, 21, 24 and 27 November; Mock 1 free for everyone' || chr(10) ||
  'Ranks for everyone, stars for the top 20, 30% off for the top 3' || chr(10) ||
  'Already bought Basic, a crash course or any other test series? 20% off when you log in',
  499, 'test_series', 6, 900, '2026-12-31', 15, true, 'mock-mahasangram')
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  total_tests = excluded.total_tests, total_questions = excluded.total_questions, updated_at = now();

update packages set
  founding_price = null, regular_price = null, founding_ends_at = null,
  highlights = '["6 full-length mocks, 150 questions each, different from Basic", "Live rank list at 8 pm on each mock day", "Stars for the top 20, 30% off for the top 3", "Valid till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'returning_percent_off', 20,
    'card_title', 'Mock Mahasangram',
    'card_tagline', '6 live-ranked full mocks before 29 Nov'),
  updated_at = now()
where slug = 'mock-mahasangram';

insert into package_tests (package_id, test_id, test_order)
select '82a4acf8-95f4-4922-a135-dd7a97a211c9'::uuid, v.id::uuid, v.ord
from (values
  ('7a976496-51a7-48b2-8142-2a559a734982', 1), ('aa6a23d2-3297-4452-8434-5cf1bd00e648', 2),
  ('46c5492d-4368-44d7-b235-e1d88eeafae5', 3), ('68d91fd0-caeb-4e29-adb4-f2ac38639aa9', 4),
  ('2c34dcc0-1ff2-42bc-94d4-78f286ad91f1', 5), ('3865e0d9-7d4b-44ef-a2ec-0df07aad22d8', 6)
) as v(id, ord)
on conflict (package_id, test_id) do nothing;

-- ========== 2. The 14 new 100-question tests ==========
insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes,
                   negative_marking_enabled, negative_marking_value, marks_per_question, is_free_test, question_ids)
values
  ('e8446598-df2a-4fb6-aa33-8bc271376667', 'CA Revision 1', null, 'Current Affairs', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('aaf001ed-e922-4bad-918c-6feace56a11e', 'CA Revision 2', null, 'Current Affairs', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('12cef989-ab3a-4a0d-8540-5ec5f6c29671', 'CA Revision 3', null, 'Current Affairs', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('0d8959a3-b922-4ecf-9707-5fc364a73520', 'CA Revision 4', null, 'Current Affairs', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('38bd7e4f-ad97-445e-83ca-412c10eedf5e', 'CA Revision 5', null, 'Current Affairs', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('368edd53-4d4c-4fde-bcbb-43fab1ff7a19', 'CA Revision 6', null, 'Current Affairs', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('613f6a29-49ba-44ec-8e56-dd5c9b005930', 'Uttarakhand Revision 1', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('f3fa0eb7-f12a-4fd4-9c00-0df0915759c5', 'Uttarakhand Revision 2', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('1d55c840-4723-4b11-be73-ee026b325135', 'Uttarakhand Revision 3', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('c28b9cc5-0f01-4c56-be24-636e82b833c6', 'Uttarakhand Revision 4', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('3cfb5eb4-02e6-41e3-b25c-f5fa44b8cb27', 'Uttarakhand Revision 5', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('0f1796d0-b73d-4c09-8519-d6202e6c460f', 'Uttarakhand Revision 6', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('aa095382-57d9-4530-8275-f4f8bbe893db', 'Uttarakhand Revision 7', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[]),
  ('07597287-d65e-424b-ae0d-216c5e1ec056', 'Uttarakhand Revision 8', null, 'Uttarakhand GK', 100, 80, true, 0.25, 1.0, false, '{}'::uuid[])
on conflict (id) do update set
  test_name = excluded.test_name, subject = excluded.subject,
  duration_minutes = excluded.duration_minutes, updated_at = now();

-- Fill each new test (only while it is still empty, so a re-run never changes
-- a test students have started) with two existing tests joined in store order.
with src as (
  select p.slug, t.question_ids, row_number() over (partition by p.slug order by pt.test_order, t.test_name) as rn
  from package_tests pt
  join packages p on p.id = pt.package_id
  join tests t on t.id = pt.test_id
  where p.slug in ('current-affairs-intensive', 'uttarakhand-intensive')
),
pairs as (
  select a.slug, (a.rn + 1) / 2 as k, a.question_ids || b.question_ids as qids
  from src a join src b on b.slug = a.slug and b.rn = a.rn + 1
  where a.rn % 2 = 1
),
target(id, slug, k) as (values
  ('e8446598-df2a-4fb6-aa33-8bc271376667', 'current-affairs-intensive', 1),
  ('aaf001ed-e922-4bad-918c-6feace56a11e', 'current-affairs-intensive', 2),
  ('12cef989-ab3a-4a0d-8540-5ec5f6c29671', 'current-affairs-intensive', 3),
  ('0d8959a3-b922-4ecf-9707-5fc364a73520', 'current-affairs-intensive', 4),
  ('38bd7e4f-ad97-445e-83ca-412c10eedf5e', 'current-affairs-intensive', 5),
  ('368edd53-4d4c-4fde-bcbb-43fab1ff7a19', 'current-affairs-intensive', 6),
  ('613f6a29-49ba-44ec-8e56-dd5c9b005930', 'uttarakhand-intensive', 1),
  ('f3fa0eb7-f12a-4fd4-9c00-0df0915759c5', 'uttarakhand-intensive', 2),
  ('1d55c840-4723-4b11-be73-ee026b325135', 'uttarakhand-intensive', 3),
  ('c28b9cc5-0f01-4c56-be24-636e82b833c6', 'uttarakhand-intensive', 4),
  ('3cfb5eb4-02e6-41e3-b25c-f5fa44b8cb27', 'uttarakhand-intensive', 5),
  ('0f1796d0-b73d-4c09-8519-d6202e6c460f', 'uttarakhand-intensive', 6),
  ('aa095382-57d9-4530-8275-f4f8bbe893db', 'uttarakhand-intensive', 7),
  ('07597287-d65e-424b-ae0d-216c5e1ec056', 'uttarakhand-intensive', 8)
)
update tests t set
  question_ids = pairs.qids,
  total_questions = cardinality(pairs.qids),
  updated_at = now()
from target join pairs on pairs.slug = target.slug and pairs.k = target.k
where t.id = target.id::uuid and cardinality(t.question_ids) = 0;

-- ========== 3. Revision Test Series package (₹999; 20% off for existing students) ==========
insert into packages (id, package_name, description, price, package_type, total_tests, total_questions,
                      access_valid_till, sort_order, is_active, slug, metadata)
values ('fbaf64da-9c7e-46b5-99fa-aef458a1954b', 'Revision Test Series',
  '6 full-length mocks (Mock Mahasangram, live ranks) - 150 Questions each' || chr(10) ||
  '6 Current Affairs tests - 100 Questions each' || chr(10) ||
  '8 Uttarakhand tests - 100 Questions each' || chr(10) ||
  '2 CSAT tests (2024 level) - 100 Questions each' || chr(10) ||
  'Already bought Basic, a crash course or any other test series? 20% off when you log in',
  999, 'test_series', 22, 2500, '2026-12-31', 14, true, 'revision-test-series',
  '{"returning_percent_off": 20}'::jsonb)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  total_tests = excluded.total_tests, total_questions = excluded.total_questions, updated_at = now();

update packages set
  founding_price = null, regular_price = null, founding_ends_at = null,
  highlights = '["22 tests for the last month: 6 full mocks, 6 CA, 8 Uttarakhand, 2 CSAT", "Live rank list for the 6 full mocks", "20% off if you already bought any course or test series", "Valid till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'returning_percent_off', 20,
    'card_title', 'Revision Test Series',
    'card_tagline', '22 tests for the last month, with live ranks'),
  updated_at = now()
where slug = 'revision-test-series';

-- An earlier draft used a fixed ₹500 returning price; the 20% rule replaces it.
update packages set metadata = metadata - 'returning_price'
where slug in ('mock-mahasangram', 'revision-test-series') and metadata ? 'returning_price';

insert into package_tests (package_id, test_id, test_order)
select 'fbaf64da-9c7e-46b5-99fa-aef458a1954b'::uuid, v.id::uuid, v.ord
from (values
  ('7a976496-51a7-48b2-8142-2a559a734982', 1), ('aa6a23d2-3297-4452-8434-5cf1bd00e648', 2),
  ('46c5492d-4368-44d7-b235-e1d88eeafae5', 3), ('68d91fd0-caeb-4e29-adb4-f2ac38639aa9', 4),
  ('2c34dcc0-1ff2-42bc-94d4-78f286ad91f1', 5), ('3865e0d9-7d4b-44ef-a2ec-0df07aad22d8', 6),
  ('e8446598-df2a-4fb6-aa33-8bc271376667', 7), ('aaf001ed-e922-4bad-918c-6feace56a11e', 8),
  ('12cef989-ab3a-4a0d-8540-5ec5f6c29671', 9), ('0d8959a3-b922-4ecf-9707-5fc364a73520', 10),
  ('38bd7e4f-ad97-445e-83ca-412c10eedf5e', 11), ('368edd53-4d4c-4fde-bcbb-43fab1ff7a19', 12),
  ('613f6a29-49ba-44ec-8e56-dd5c9b005930', 13), ('f3fa0eb7-f12a-4fd4-9c00-0df0915759c5', 14),
  ('1d55c840-4723-4b11-be73-ee026b325135', 15), ('c28b9cc5-0f01-4c56-be24-636e82b833c6', 16),
  ('3cfb5eb4-02e6-41e3-b25c-f5fa44b8cb27', 17), ('0f1796d0-b73d-4c09-8519-d6202e6c460f', 18),
  ('aa095382-57d9-4530-8275-f4f8bbe893db', 19), ('07597287-d65e-424b-ae0d-216c5e1ec056', 20),
  ('f49e0e05-f2cd-434b-94bb-aec89ff0597f', 21), ('bb8b9620-e13c-4854-a774-c584a6e41820', 22)
) as v(id, ord)
on conflict (package_id, test_id) do nothing;

-- (Premium / Complete Pack / Mentorship owners get the Revision Test Series as its own
-- product through packages.metadata.included_with; see schema-phase38.)

-- ========== Checks ==========
-- select test_name, release_at, rank_until, result_at, is_free_test, cardinality(question_ids)
--   from tests where live_series = 'mahasangram' order by release_at;
-- select test_name, cardinality(question_ids) from tests where test_name like '%Revision _' order by test_name;
--   (expect about 100 each; fewer means a source test was trimmed in review)
-- select slug, price, is_active from packages where slug in ('mock-mahasangram', 'revision-test-series');

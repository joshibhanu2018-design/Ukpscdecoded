-- UKPSC Test Platform — Phase 35: CSAT tests live + CSAT Test Series at ₹299
-- Run in the Supabase SQL Editor AFTER `npx.cmd --yes tsx scripts/load-csat-tests.mts --apply`
-- (that fills CSAT 1-6 with 100 questions each). Safe to re-run.
-- No DROP / DELETE / TRUNCATE.
--
-- Who gets the 6 CSAT tests:
--   * Premium Test Series buyers: CSAT 1-6 have always been in Premium (package_tests).
--   * Complete Prelims Pack and Mentorship buyers: they include Premium (package_includes).
--   * New: CSAT Test Series (slug csat-test-series), ₹299 on its own.

-- ========== Link CSAT 1-6 to the CSAT Test Series ==========
insert into package_tests (package_id, test_id, test_order)
select p.id, v.test_id::uuid, v.ord
from packages p
join (values
  ('45dbca03-8184-46e1-a241-10e7c0983388', 1),
  ('04b45cb8-9a4d-409c-a6c1-48094d5d41ae', 2),
  ('827f78a8-5641-4490-b941-eb6b3c557263', 3),
  ('fa49bf3b-ebe2-4566-967e-57b1b7854085', 4),
  ('f49e0e05-f2cd-434b-94bb-aec89ff0597f', 5),
  ('bb8b9620-e13c-4854-a774-c584a6e41820', 6)
) as v(test_id, ord) on true
where p.slug = 'csat-test-series'
on conflict (package_id, test_id) do nothing;

-- ========== CSAT Test Series: ₹299 flat, text, and switch on ==========
-- Flat price (no founding tier), so `price` is what students pay; coupons
-- such as a universal offer apply on top. It is switched on only when all 6
-- CSAT tests already have 100 questions (so buyers never get empty tests).
update packages set
  package_name = 'CSAT Test Series',
  price = 299,
  founding_price = null,
  regular_price = null,
  founding_ends_at = null,
  description = '6 full-length CSAT mock tests (Paper II), 100 questions each, in the UKPSC pattern' || chr(10) ||
    'Tests 1-2 at the 2025 level, 3-4 in between, 5-6 at the tougher 2024 level' || chr(10) ||
    'Reasoning, Maths & Data Interpretation, Decision Making, Hindi and English (Hindi + English)' || chr(10) ||
    '2 hours, 150 marks, 1/4 negative marking, with a worked solution for every question' || chr(10) ||
    'Already included in the Premium Test Series and the Complete Prelims Pack',
  highlights = '["6 full CSAT mocks, 100 questions each", "UKPSC pattern: Reasoning, Maths & DI, Decision Making, Hindi, English", "Level rises: 2025 level → 2024 level", "Worked solution for every question (Hindi + English)", "Valid till 31 December 2026"]'::jsonb,
  total_tests = 6,
  total_questions = 600,
  access_valid_till = '2026-12-31',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'CSAT Test Series',
    'card_tagline', '6 full CSAT mocks (100 Q each) with solutions'),
  is_active = (
    select count(*) = 6
    from tests
    where id in (
      '45dbca03-8184-46e1-a241-10e7c0983388', '04b45cb8-9a4d-409c-a6c1-48094d5d41ae',
      '827f78a8-5641-4490-b941-eb6b3c557263', 'fa49bf3b-ebe2-4566-967e-57b1b7854085',
      'f49e0e05-f2cd-434b-94bb-aec89ff0597f', 'bb8b9620-e13c-4854-a774-c584a6e41820')
      and cardinality(question_ids) = 100
  ),
  updated_at = now()
where slug = 'csat-test-series';

-- ========== Premium Test Series: CSAT is no longer "coming soon" ==========
update packages set
  description = replace(description, ' — coming soon', ''),
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', replace(coalesce(metadata->>'card_tagline', ''), ' (coming soon)', '')),
  updated_at = now()
where slug = 'premium-test-series'
  and (description like '% — coming soon%' or metadata->>'card_tagline' like '%(coming soon)%');

-- ========== Check ==========
-- csat-test-series should show is_active = true, price 299, 6 tests;
-- every CSAT test 100 questions, 120 minutes, 1.5 marks.
select p.slug, p.package_name, p.is_active, p.price, count(pt.test_id) as tests
from packages p left join package_tests pt on pt.package_id = p.id
where p.slug in ('csat-test-series', 'premium-test-series')
group by p.slug, p.package_name, p.is_active, p.price;

select test_name, cardinality(question_ids) as questions, duration_minutes, marks_per_question, negative_marking_value
from tests where subject = 'CSAT' order by test_name;

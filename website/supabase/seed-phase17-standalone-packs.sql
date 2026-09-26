-- UKPSC Test Platform — Phase 17: tests for the standalone packs.
-- Idempotent: inserts use ON CONFLICT DO NOTHING, the rest are plain UPDATEs.
-- No DROP / DELETE / TRUNCATE. Run in the Supabase SQL Editor; safe to
-- re-run.
--
-- Before this only the Premium Test Series had package_tests rows, so a
-- buyer of Basic or Uttarakhand Intensive would have got an empty course.
-- (Current Affairs Intensive was linked by schema-phase16.)

-- ========== Basic: Full Mock 1-6 + the "I" sectional of each subject = 12 ==========
insert into package_tests (package_id, test_id, test_order)
select p.id, t.id, v.ord
from packages p
join (values
  ('Full Mock 1', 1), ('Full Mock 2', 2), ('Full Mock 3', 3),
  ('Full Mock 4', 4), ('Full Mock 5', 5), ('Full Mock 6', 6),
  ('Polity Sectional I', 7), ('History Sectional I', 8), ('Geography Sectional I', 9),
  ('Science & Tech Sectional I', 10), ('Economy & Environment Sectional I', 11),
  ('Uttarakhand GK Sectional I', 12)
) as v(test_name, ord) on true
join tests t on t.test_name = v.test_name
join package_tests premium_link on premium_link.test_id = t.id
join packages premium on premium.id = premium_link.package_id and premium.slug = 'premium-test-series'
where p.slug = 'basic-test-series'
on conflict (package_id, test_id) do nothing;

update packages set
  description = '6 Full Mock Tests (150 Questions each)' || chr(10) ||
    '6 Sectional Tests (50 Questions each): Polity, History, Geography, Science & Tech, Economy & Environment, Uttarakhand GK',
  highlights = '["6 Full Mock Tests (150 Q each)", "6 Sectional Tests (50 Q each), one per subject", "Polity, History, Geography, Science & Tech, Economy & Environment, Uttarakhand GK", "Valid till 31 December 2026"]'::jsonb,
  total_tests = 12,
  total_questions = 1200,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'Basic Test Series',
    'card_tagline', '6 Full Mocks + 6 Sectional (one per subject)'),
  updated_at = now()
where slug = 'basic-test-series';

-- ========== Uttarakhand Intensive: all 20 Uttarakhand tests ==========
-- The Premium Test Series' Uttarakhand GK tests except the two
-- "Uttarakhand GK Sectional" tests (those are in the Sectional tab), in the
-- same order: 14 topic tests + Mixed Mock A-D + Topper Test + Grand Mock.
insert into package_tests (package_id, test_id, test_order)
select uk.id, pt.test_id, row_number() over (order by pt.test_order)
from packages uk
join packages premium on premium.slug = 'premium-test-series'
join package_tests pt on pt.package_id = premium.id
join tests t on t.id = pt.test_id
where uk.slug = 'uttarakhand-intensive'
  and t.subject = 'Uttarakhand GK'
  and t.test_name not ilike '%sectional%'
on conflict (package_id, test_id) do nothing;

update packages set
  description = '20 Uttarakhand GK Tests (50 Questions each)' || chr(10) ||
    '14 topic tests: Uttarakhand (Post-Independence), Uttarakhand Polity, history, geography, forests, demography, polity, economy & budget, agriculture & energy, festivals & folk culture, art & literature, tourism, Uttarakhand current affairs' || chr(10) ||
    '4 Mixed Mocks + Topper Test + Grand Uttarakhand Mock',
  highlights = '["20 tests covering the full Uttarakhand GK syllabus", "14 topic tests: statehood, history, geography, polity, economy, culture, tourism & more", "4 Mixed Mocks + Topper Test + Grand Uttarakhand Mock", "Valid till 31 December 2026"]'::jsonb,
  total_tests = 20,
  total_questions = 1000,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'Uttarakhand Intensive',
    'card_tagline', '20 Uttarakhand GK tests: 14 topics + 6 mocks'),
  updated_at = now()
where slug = 'uttarakhand-intensive';

-- ========== CSAT: hidden until CSAT questions exist ==========
-- CSAT 1-6 have no questions yet. Hidden from the store (never deleted);
-- set is_active = true again once they're loaded.
update packages set is_active = false, updated_at = now()
where slug = 'csat-test-series';

-- The Premium Test Series still includes the 6 CSAT tests; its page shows
-- the CSAT tab as "Coming soon" while they're empty. Say so in the text.
update packages set
  description = replace(description, '6 CSAT Tests (100 Questions each)', '6 CSAT Tests (100 Questions each) — coming soon'),
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', '12 Full Mocks + 12 Sectional + 20 Uttarakhand + 12 Current Affairs + 6 CSAT (coming soon)'),
  updated_at = now()
where slug = 'premium-test-series'
  and description not like '%CSAT Tests (100 Questions each) — coming soon%';

-- Check:
-- select p.slug, p.is_active, count(pt.test_id) from packages p
--   left join package_tests pt on pt.package_id = p.id group by p.slug, p.is_active order by p.slug;
-- basic-test-series 12, uttarakhand-intensive 20, current-affairs-intensive 12, premium-test-series 62

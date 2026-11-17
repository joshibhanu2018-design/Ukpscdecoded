-- UKPSC Decoded — Phase 47e: three test series sold on their own in Solo Packs (17 Nov 2026)
-- Safe to re-run. No DROP / DELETE / TRUNCATE. Only existing packages are updated;
-- no test, question, attempt or enrollment is touched.
--
-- "Subject Packs" is now "Solo Packs" (/solo-packs). The metadata tab key stays
-- 'individual'. These three test series join it, next to the Uttarakhand GK Pack,
-- CSAT and Current Affairs 2026:
--   uttarakhand-intensive      Uttarakhand Intensive Test Series   20 tests   ₹599
--   lower-pcs-csat-tests       CSAT Test Series                     18 tests   ₹499  (CSAT 1-6 + 12 sectionals, added before the exam)
--   current-affairs-intensive  Current Affairs Test Series          12 tests   ₹399
-- The Uttarakhand / CA Revision tests stay only in the Revision Test Series (phase 47c).
-- The old 6-test csat-test-series stays hidden; its buyers keep access.

-- ========== Uttarakhand Intensive Test Series ==========
update packages set
  is_active = true,
  package_type = 'test_series',
  price = 599, regular_price = null, founding_price = null, founding_ends_at = null,
  access_valid_till = '2027-04-30', validity_days = null,
  sort_order = 23,
  description = '20 Uttarakhand GK tests (50 questions each), for every UKPSC exam: Lower PCS, RO/ARO, TRI and Upper PCS
14 topic tests: freedom struggle to statehood, history, geography, forests, demography & society, polity, economy, budget & state schemes, agriculture & energy, festivals & folk culture, art & literature, tourism, Uttarakhand current affairs
4 Mixed Mocks + Topper Test + Grand Uttarakhand Mock
Valid till 30 April 2027',
  highlights = '["20 tests covering the full Uttarakhand GK syllabus", "14 topic tests: statehood, history, geography, polity, economy, culture, tourism & more", "4 Mixed Mocks + Topper Test + Grand Uttarakhand Mock", "Analysis after every test", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'individual', 'listed', true,
    'card_title', 'Uttarakhand Intensive Test Series',
    'card_tagline', '20 Uttarakhand GK tests: 14 topics + 6 mocks',
    'separate_total', false),
  updated_at = now()
where slug = 'uttarakhand-intensive';

-- ========== CSAT Test Series ==========
update packages set
  is_active = true,
  package_name = 'CSAT Test Series',
  package_type = 'test_series',
  price = 499, regular_price = null, founding_price = null, founding_ends_at = null,
  access_valid_till = '2027-04-30', validity_days = null,
  sort_order = 24,
  total_tests = 18,
  description = '18 General Aptitude (CSAT) tests for Lower PCS, RO/ARO, TRI and Upper PCS
CSAT 1-6 (live now)
12 CSAT sectionals on the Lower PCS pattern: series, analogy, coding-decoding, blood relations, ranking, clock & calendar, syllogism, non-verbal, arithmetic and a full aptitude test (being added before the exam)
Valid till 30 April 2027',
  highlights = '["18 CSAT (General Aptitude) tests", "12 topic-wise sectionals on the Lower PCS pattern", "Reasoning + arithmetic, with analysis after every test", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'individual', 'listed', true,
    'card_title', 'CSAT Test Series',
    'card_tagline', '18 aptitude tests: CSAT 1-6 + 12 topic sectionals',
    'separate_total', false),
  updated_at = now()
where slug = 'lower-pcs-csat-tests';

-- ========== Current Affairs Test Series ==========
update packages set
  is_active = true,
  package_type = 'test_series',
  price = 399, regular_price = null, founding_price = null, founding_ends_at = null,
  access_valid_till = '2027-04-30', validity_days = null,
  sort_order = 25,
  description = '12 current affairs tests for every UKPSC exam: Lower PCS, RO/ARO, TRI and Upper PCS
National and international themes, Uttarakhand current affairs and Budget
Valid till 30 April 2027',
  highlights = '["12 current affairs tests", "National, international and Uttarakhand current affairs", "Uttarakhand Budget questions", "Analysis after every test", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'individual', 'listed', true,
    'card_title', 'Current Affairs Test Series',
    'card_tagline', '12 current affairs tests, national + Uttarakhand',
    'separate_total', false),
  updated_at = now()
where slug = 'current-affairs-intensive';

-- Check: Solo Packs should list 6 products; the 3 test series with 20, 18 and 12 tests.
-- select slug, coalesce(metadata->>'card_title', package_name) name, price, access_valid_till,
--        (select count(*) from package_tests pt where pt.package_id = p.id) tests
-- from packages p where metadata->>'exam_tab' = 'individual' and metadata->>'listed' = 'true' order by sort_order;
select 'phase 47e ready' as status;

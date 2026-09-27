-- UKPSC Test Platform — Phase 23: Uttarakhand Crash Course + store repair
-- Safe to re-run: UPDATEs and one guarded INSERT only. No DROP / DELETE / TRUNCATE.
--
-- Repairs the rows added by hand on 27 Sep 2026 (prices were entered in
-- paise, so they showed as ₹1,89,900 and ₹3,99,900, with the wrong
-- package_type) and makes the Uttarakhand Crash Course a proper video course:
-- ₹1899, 25 videos + 3 live sessions, access till 31 December 2026.

-- 1. The duplicate "Complete Prelims Package" row: hide it. The real bundle
--    is 'complete-prelims-pack'.
update packages set is_active = false, updated_at = now()
where slug = 'complete-prelims-combo';

-- 2. Uttarakhand Crash Course: create it if the hand-added row doesn't exist…
insert into packages (id, package_name, price, package_type, is_active, slug, created_at, updated_at)
select gen_random_uuid(), 'Uttarakhand Crash Course', 1899, 'video_course', true, 'uttarakhand-crash-course', now(), now()
where not exists (select 1 from packages where slug = 'uttarakhand-crash-course');

-- …and give it the right price, type, dates and text (FAQ copied from the Crash Course).
update packages uk set
  package_name = 'Uttarakhand Crash Course',
  package_type = 'video_course',
  price = 1899,
  founding_price = null,
  regular_price = null,
  founding_ends_at = null,
  discount_percentage = null,
  original_price = null,
  access_valid_till = '2026-12-31',
  validity_days = null,
  total_tests = null,
  total_questions = null,
  seats_total = null,
  is_active = true,
  sort_order = cc.sort_order + 1,
  description = '25 video lectures: Uttarakhand static GK + Uttarakhand current affairs (the Uttarakhand lectures of the Crash Course)
3 live sessions on Google Meet
PDF notes included · Recordings till 31 December 2026',
  highlights = '["25 video lectures: Uttarakhand static GK + Uttarakhand current affairs", "3 live sessions on Google Meet", "PDF notes included", "Recordings till 31 December 2026"]'::jsonb,
  curriculum = '[]'::jsonb,
  faq = coalesce(cc.faq, '[]'::jsonb),
  metadata = jsonb_build_object(
    'card_title', 'Uttarakhand Crash Course',
    'card_tagline', '25 Uttarakhand video lectures + 3 live sessions + PDF notes',
    'class_start', cc.metadata->>'class_start',
    'class_end', cc.metadata->>'class_end'),
  updated_at = now()
from packages cc
where uk.slug = 'uttarakhand-crash-course' and cc.slug = 'crash-course';

-- 3. Crash Course card: say it already has the Uttarakhand lectures.
update packages set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', '50 video lectures + 6 live sessions + PDF notes · includes all Uttarakhand lectures'),
  updated_at = now()
where slug = 'crash-course';

-- 4. Premium Test Series: put back its real bullet points and place.
update packages set
  highlights = '["62 tests: Full Mocks, Sectional, Uttarakhand Intensive, Current Affairs, CSAT", "Detailed solutions on every test", "Covers Prelims + Uttarakhand GK + CSAT", "Valid till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) - 'recommended',
  sort_order = 3,
  updated_at = now()
where slug = 'premium-test-series';

-- Check: the store, in order. Prices are in rupees.
select slug, package_name, package_type, price, founding_price, regular_price, access_valid_till, sort_order, is_active
from packages
where is_active or slug = 'complete-prelims-combo'
order by is_active desc, sort_order;

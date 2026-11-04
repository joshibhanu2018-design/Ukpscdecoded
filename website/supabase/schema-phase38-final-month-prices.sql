-- UKPSC Test Platform — Phase 38: final-month prices + Revision Series access
-- Run in the Supabase SQL Editor AFTER phase 37. Safe to re-run.
--
-- 1. Last-month prices till 29 Nov 2026, 11:59 pm (shown with the old price
--    struck through and "till 29 November"; after that the old price returns):
--      Crash Course ₹2,222 · Uttarakhand / National Crash Course ₹1,188 ·
--      Complete Prelims Pack ₹3,299 · Premium Test Series ₹1,399
--    The struck-through price is what each one sold for until now.
-- 2. Premium / Complete Prelims Pack / Mentorship owners get the Revision Test
--    Series and Mock Mahasangram as products of their own (metadata.included_with).
-- 3. Mock Mahasangram owners upgrade to the Revision Test Series for ₹500
--    (metadata.upgrade_from); other past buyers keep 20% off both.
-- 4. Undo from phase 37: the 14 new CA/Uttarakhand revision tests are taken back
--    out of the Premium Test Series list (Bhanu asked for this on 4 Nov). This is
--    the one DELETE in this file and it removes only those 14 link rows; no test,
--    question or attempt is deleted.

-- ========== 1. Last-month prices ==========
update packages p set
  regular_price = case
    when p.founding_price = v.new_price then p.regular_price  -- already done (re-run)
    when p.founding_price is not null and p.founding_ends_at > now() then p.founding_price
    else coalesce(p.regular_price, p.price)
  end,
  founding_price = v.new_price,
  founding_ends_at = '2026-11-29 23:59:59+05:30',
  updated_at = now()
from (values
  ('crash-course', 2222),
  ('uttarakhand-crash-course', 1188),
  ('national-crash-course', 1188),
  ('complete-prelims-pack', 3299),
  ('premium-test-series', 1399)
) as v(slug, new_price)
where p.slug = v.slug;

-- ========== 2 + 3. Revision Series / Mahasangram access and upgrade ==========
update packages set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'included_with', jsonb_build_array('premium-test-series', 'complete-prelims-pack', 'prelims-mentorship'),
    'upgrade_from', jsonb_build_object('mock-mahasangram', 500)),
  description = '6 full-length mocks with live ranks (Mock Mahasangram) - 150 Questions each' || chr(10) ||
    'Complete Uttarakhand GK revision: 8 tests, 800 Questions' || chr(10) ||
    'Complete Current Affairs revision: 6 tests, 600 Questions' || chr(10) ||
    '2 CSAT tests (2024 level)' || chr(10) ||
    'Mock Mahasangram students: upgrade for ₹500 · Other past buyers: 20% off' || chr(10) ||
    'Premium Test Series / Complete Prelims Pack students: included free (these questions come from your Premium, Uttarakhand and Current Affairs tests)',
  updated_at = now()
where slug = 'revision-test-series';

update packages set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'included_with', jsonb_build_array('premium-test-series', 'complete-prelims-pack', 'prelims-mentorship')),
  updated_at = now()
where slug = 'mock-mahasangram';

-- ========== 4. Take the 14 revision tests back out of Premium ==========
delete from package_tests pt
using packages p
where pt.package_id = p.id
  and p.slug = 'premium-test-series'
  and pt.test_id in (
    'e8446598-df2a-4fb6-aa33-8bc271376667', 'aaf001ed-e922-4bad-918c-6feace56a11e',
    '12cef989-ab3a-4a0d-8540-5ec5f6c29671', '0d8959a3-b922-4ecf-9707-5fc364a73520',
    '38bd7e4f-ad97-445e-83ca-412c10eedf5e', '368edd53-4d4c-4fde-bcbb-43fab1ff7a19',
    '613f6a29-49ba-44ec-8e56-dd5c9b005930', 'f3fa0eb7-f12a-4fd4-9c00-0df0915759c5',
    '1d55c840-4723-4b11-be73-ee026b325135', 'c28b9cc5-0f01-4c56-be24-636e82b833c6',
    '3cfb5eb4-02e6-41e3-b25c-f5fa44b8cb27', '0f1796d0-b73d-4c09-8519-d6202e6c460f',
    'aa095382-57d9-4530-8275-f4f8bbe893db', '07597287-d65e-424b-ae0d-216c5e1ec056');

-- (Notes-only lessons need no SQL: lessons.youtube_id is already optional since phase 27.)

-- ========== Checks ==========
-- select slug, founding_price as now_price, regular_price as was_price, founding_ends_at from packages
--   where slug in ('crash-course','uttarakhand-crash-course','national-crash-course','complete-prelims-pack','premium-test-series');
-- select slug, price, metadata->'included_with', metadata->'upgrade_from' from packages where slug in ('mock-mahasangram','revision-test-series');

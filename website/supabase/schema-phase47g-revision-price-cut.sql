-- UKPSC Decoded — Phase 47g (18 Nov 2026): last-days price cut. Safe to re-run. UPDATEs only.
--
-- 1. Revision Test Series 2026: ₹799 (was ₹999) till 29 Nov, 11:59 pm.
-- 2. All Uttarakhand Rank Challenge 2026 (Mock Mahasangram): ₹399 (was ₹499)
--    till 25 Nov, 11:59 pm (the last live mock; sales close then anyway).
--    The site shows the old price struck through, and the top bar says "Prices cut!".
-- 3. Rank Challenge students now upgrade to the Revision Series for ₹400 (was ₹500),
--    so Rank Challenge + upgrade = ₹799, the same as buying Revision directly.
--    Other past buyers keep 20% off (now 20% off ₹799 = ₹639).

-- ========== 1. Revision Test Series ==========
update packages set
  regular_price = 999,
  founding_price = 799,
  founding_ends_at = '2026-11-29 23:59:59+05:30',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'upgrade_from', jsonb_build_object('mock-mahasangram', 400)),
  description = replace(description, 'upgrade for ₹500', 'upgrade for ₹400'),
  updated_at = now()
where slug = 'revision-test-series';

-- ========== 2. Rank Challenge ==========
update packages set
  regular_price = 499,
  founding_price = 399,
  founding_ends_at = '2026-11-25 23:59:59+05:30',
  updated_at = now()
where slug = 'mock-mahasangram';

-- Check (should show 799 / 999 and 399 / 499, upgrade 400):
select slug, price, founding_price as now_price, regular_price as was_price, founding_ends_at,
       metadata->'upgrade_from' as upgrade_from
from packages where slug in ('revision-test-series', 'mock-mahasangram');

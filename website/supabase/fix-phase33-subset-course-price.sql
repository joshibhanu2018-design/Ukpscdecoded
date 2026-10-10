-- UKPSC Test Platform — Phase 33: Uttarakhand + National Crash Course at ₹1699
-- Safe to re-run: one UPDATE. No DROP / DELETE / TRUNCATE.
-- Both are flat-priced (no founding tier), so `price` is what students pay;
-- coupons such as the WEEKEND12 universal offer apply on top.

update packages set
  price = 1699,
  founding_price = null,
  regular_price = null,
  founding_ends_at = null,
  updated_at = now()
where slug in ('uttarakhand-crash-course', 'national-crash-course');

-- Check:
select slug, package_name, price, founding_price, regular_price
from packages where slug in ('uttarakhand-crash-course', 'national-crash-course');

-- UKPSC Test Platform — Phase 39: BOOK10, a private 10% code for book buyers
-- Safe to re-run: one INSERT (skipped if BOOK10 exists) and one UPDATE.
-- No DROP / DELETE / TRUNCATE. Needs phase 37 (coupons.package_slugs).
--
-- * 10% off any course or test series on the website, once per student,
--   till 29 Nov 2026, 11:59 pm. Applies on top of the price cut.
-- * Not shown in the site-wide offer bar or prefilled at checkout (locked
--   codes are private), so only people who get the WhatsApp message know it.
-- * Works on every package that is on sale when this runs. A package added
--   later is not included: re-run the UPDATE below to add it.

insert into coupons (code, type, percent_off, max_uses, expires_at)
values ('BOOK10', 'single_use_percent', 10, 1000000, '2026-11-29 23:59:59+05:30')
on conflict (code) do nothing;

update coupons set package_slugs = (
  select array_agg(slug order by slug) from packages where is_active and slug is not null
)
where code = 'BOOK10';

-- Check:
select code, percent_off, max_uses, used_count, expires_at, package_slugs from coupons where code = 'BOOK10';

-- To make it Revision + Mahasangram only instead, run:
-- update coupons set package_slugs = array['revision-test-series', 'mock-mahasangram'] where code = 'BOOK10';

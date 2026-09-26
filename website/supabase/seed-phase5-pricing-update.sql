-- UKPSC Test Platform — Phase 5d: pricing update + mentorship package
-- Run FOURTH of the phase 5 files (after pricing, coupons, referrals
-- schema files). Not run yet.
--
-- Safety: no DROP/DELETE/TRUNCATE. Deactivates two packages
-- (is_active = false) rather than deleting them, per instruction —
-- existing enrollment history referencing them stays intact. Every
-- UPDATE targets a specific known id; the mentorship INSERT uses
-- ON CONFLICT (id) DO UPDATE so re-running this file is safe.
--
-- Global founding cutoff: 30 Sep 2026 23:59:59 IST.

-- ========== Rename the existing combo -> Complete Prelims Pack ==========
-- Same id, same package_includes rows (Premium Bundle + Crash Course) —
-- only the name, description and pricing change.
update packages set
  package_name = 'Complete Prelims Pack',
  description = 'Everything in Premium Test Series (62 tests across Full Mock, Sectional, Uttarakhand GK, Current Affairs and CSAT)
Plus the full Crash Course (50 video lectures including 8-10 live sessions + PDF notes)',
  founding_price = 3999,
  regular_price = 4499,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = '47519f69-eb7b-42cd-8e85-1b3f28e980f7'; -- was "Premium Test Series + Crash Course"

-- ========== Premium Bundle (62 tests) ==========
update packages set
  founding_price = 1599,
  regular_price = 1999,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = 'fa2c4a38-d430-42ce-905d-375bd8af5ca9';

-- ========== Crash Course ==========
update packages set
  description = '50 video lectures including 8-10 live sessions + PDF notes
Classes: 2 October - 2 November 2026
Recordings available till 31 December 2026',
  founding_price = 2999,
  regular_price = 3499,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4';

-- ========== Basic ==========
update packages set
  founding_price = 499,
  regular_price = 566,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = '6e868c4b-08a2-4bbe-a78a-2144a69a4288';

-- ========== Uttarakhand Intensive ==========
update packages set
  founding_price = 599,
  regular_price = 699,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = '368ea0df-d24c-4857-a3c3-66ba5858f1d2';

-- ========== Current Affairs Intensive ==========
update packages set
  founding_price = 399,
  regular_price = 499,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = 'c100e8b1-0929-429d-9e16-d2255f1bddad';

-- ========== CSAT ==========
update packages set
  founding_price = 249,
  regular_price = 299,
  founding_ends_at = '2026-09-30 23:59:59+05:30',
  updated_at = now()
where id = 'fb0bccf7-9649-4161-9e5c-c441c743f6a8';

-- ========== Deactivate — kept, never deleted ==========
update packages set is_active = false, updated_at = now()
  where id = '4d7dff5c-641b-4f8a-b8ac-57766d5fa757'; -- Standard

update packages set is_active = false, updated_at = now()
  where id = '91261f68-c543-406c-8c2c-485beac736cb'; -- Standard Test Series + Crash Course

-- ========== New: Prelims Mentorship with Bhanu Joshi ==========
-- Same price both phases (8999) — no founding discount, kept for schema
-- consistency; the store won't show founding messaging since
-- founding_price = regular_price. 25 seats, counted against paid
-- enrollments at checkout time (src/lib/orders.ts).
-- sort_order 20 places its section after everything else (Combo
-- Bundles/Test Series/Crash Course) — change via a sort-order SQL file
-- like the others if you want it positioned differently.
insert into packages (
  id, package_name, description, price, package_type,
  founding_price, regular_price, founding_ends_at, seats_total,
  total_tests, total_questions, access_valid_till, sort_order, is_active
)
values (
  'd06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae',
  'Prelims Mentorship with Bhanu Joshi',
  'Everything in the Complete Prelims Pack (Premium Test Series + Crash Course)
3 one-on-one calls with Bhanu Joshi
Personal test review',
  8999, 'mentorship',
  8999, 8999, '2026-09-30 23:59:59+05:30', 25,
  62, 4600, '2026-12-31', 20, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, founding_price = excluded.founding_price,
  regular_price = excluded.regular_price, founding_ends_at = excluded.founding_ends_at,
  seats_total = excluded.seats_total, total_tests = excluded.total_tests,
  total_questions = excluded.total_questions, access_valid_till = excluded.access_valid_till,
  sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

-- Flattened entitlement: buying mentorship unlocks the Complete Prelims
-- Pack AND its two components directly, so a single-level
-- package_includes lookup (no recursive resolution needed in code)
-- grants everything. See getOwnedPackageIds in src/lib/packages.ts,
-- which treats 'mentorship' the same as 'combo_bundle' for unlocking.
insert into package_includes (combo_package_id, included_package_id) values
  ('d06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae', '47519f69-eb7b-42cd-8e85-1b3f28e980f7'), -- Mentorship -> Complete Prelims Pack
  ('d06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9'), -- Mentorship -> Premium Bundle
  ('d06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae', 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4')  -- Mentorship -> Crash Course
on conflict (combo_package_id, included_package_id) do nothing;

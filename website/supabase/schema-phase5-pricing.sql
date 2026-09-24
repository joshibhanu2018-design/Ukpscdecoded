-- UKPSC Test Platform — Phase 5a: founding/regular price engine + seats
-- Run FIRST of the phase 5 files. Not run yet. Safe: no DROP/DELETE/
-- TRUNCATE, ADD COLUMN IF NOT EXISTS. Does not touch existing rows.
--
-- Price shown/charged = founding_price while now() < founding_ends_at,
-- else regular_price. This is computed in application code
-- (src/lib/pricing.ts) from these columns on every request — never a
-- static value flipped by a cron, so no redeploy is needed for the
-- switch to take effect.

alter table packages add column if not exists founding_price numeric(10, 2);
alter table packages add column if not exists regular_price numeric(10, 2);
alter table packages add column if not exists founding_ends_at timestamptz;
alter table packages add column if not exists seats_total integer;

comment on column packages.founding_price is 'Price while now() < founding_ends_at. Null = no founding pricing, always regular_price (or price, for legacy rows).';
comment on column packages.regular_price is 'Price once founding_ends_at has passed.';
comment on column packages.founding_ends_at is 'timestamptz deliberately (not the naive timestamp type used elsewhere) — see the password-reset timezone bug for why that matters.';
comment on column packages.seats_total is 'Hard cap on paid enrollments for this package (e.g. mentorship). Null = unlimited.';

-- 'mentorship' joins 'combo_bundle' as an entitlement-granting product
-- type — see getOwnedPackageIds in src/lib/packages.ts. Existing check
-- constraints on packages, if any, don't restrict package_type, so no
-- migration needed there.

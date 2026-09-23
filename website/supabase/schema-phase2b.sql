-- UKPSC Test Platform — Phase 2B: package store schema
-- Not run yet. Run this BEFORE seed-packages.sql (seed-packages.sql
-- inserts package_includes rows for the combo bundles, which needs this
-- table to exist first).
--
-- Safety: no DROP/DELETE/TRUNCATE. ALTER uses ADD COLUMN IF NOT EXISTS,
-- CREATE TABLE uses IF NOT EXISTS. Does not touch `users` or any existing
-- rows.

-- ========== packages: fixed-date expiry ==========
-- validity_days (existing column) models "N days from purchase," but your
-- 2026 packages need to all expire on a fixed calendar date regardless of
-- when someone buys them. access_valid_till carries that fixed date; when
-- set, the enrollment/purchase flow should use it directly instead of
-- computing purchase_date + validity_days. Nullable, so packages without
-- a fixed cutoff keep using validity_days as before.
alter table packages add column if not exists access_valid_till date;

comment on column packages.access_valid_till is 'Fixed expiry date for this package''s enrollments, e.g. 2026-12-31. Takes precedence over validity_days when set.';

-- ========== packages: structured extras (class dates, etc.) ==========
-- Generic JSONB escape hatch for per-package structured facts the fixed
-- columns don't cover — e.g. a crash course's {"class_start": "2026-10-02",
-- "class_end": "2026-11-02"}. Avoids adding a new column for every
-- product-specific fact.
alter table packages add column if not exists metadata jsonb not null default '{}'::jsonb;

-- ========== package_includes: combo bundle -> component packages ==========
-- A combo bundle (product_type = 'combo_bundle') references the packages
-- it grants access to. Buying the combo means the enrollment logic (next
-- phase) creates access to every included package, not just the combo
-- row itself.
create table if not exists package_includes (
  id uuid primary key default extensions.uuid_generate_v4(),
  combo_package_id uuid not null references packages(id) on delete cascade,
  included_package_id uuid not null references packages(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (combo_package_id, included_package_id)
);

create index if not exists package_includes_combo_idx on package_includes(combo_package_id);
create index if not exists package_includes_included_idx on package_includes(included_package_id);

alter table package_includes enable row level security;
revoke all on package_includes from anon, authenticated;

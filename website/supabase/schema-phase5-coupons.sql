-- UKPSC Test Platform — Phase 5b: coupons
-- Run SECOND of the phase 5 files (after schema-phase5-pricing.sql).
-- Not run yet. Safe: no DROP/DELETE/TRUNCATE.
--
-- Reservation model: redeeming a coupon at checkout doesn't touch
-- coupons.used_count directly. It inserts a coupon_redemptions row with
-- status='reserved' and reserved_until = now() + 30 minutes. Availability
-- checks (src/lib/coupons.ts) count used_count PLUS any other row with
-- status='reserved' AND reserved_until > now() — so a coupon can't be
-- oversold during the 30-minute window multiple pending orders might be
-- holding it, without needing an active cleanup job: an expired
-- reservation is simply invisible to the availability count from that
-- point on. On successful payment the row flips to 'consumed' and
-- coupons.used_count increments in the same transaction-equivalent
-- (application-level guarded update, same pattern as payment_orders).

create table if not exists coupons (
  id uuid primary key default extensions.uuid_generate_v4(),
  code text not null unique,
  type text not null check (type in ('single_use_percent', 'multi_use_price_lock')),
  percent_off numeric(5, 2), -- single_use_percent: e.g. 10.00
  price_lock_until timestamptz, -- multi_use_price_lock: founding price honored until this moment
  max_uses integer, -- null = unlimited (until expires_at) — used by multi_use_price_lock
  used_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists coupon_redemptions (
  id uuid primary key default extensions.uuid_generate_v4(),
  coupon_id uuid not null references coupons(id) on delete cascade,
  order_id uuid not null references payment_orders(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  status text not null default 'reserved' check (status in ('reserved', 'consumed', 'released')),
  discount_amount integer not null, -- paise, snapshot at reservation time
  reserved_until timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (order_id) -- one code per order, enforced at the DB level too
);

create index if not exists coupons_code_idx on coupons(code);
create index if not exists coupon_redemptions_coupon_id_idx on coupon_redemptions(coupon_id);
create index if not exists coupon_redemptions_status_idx on coupon_redemptions(status, reserved_until);

alter table coupons enable row level security;
alter table coupon_redemptions enable row level security;
revoke all on coupons, coupon_redemptions from anon, authenticated;

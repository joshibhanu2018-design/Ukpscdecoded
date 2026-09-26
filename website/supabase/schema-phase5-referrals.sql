-- UKPSC Test Platform — Phase 5c: referrals + order discount tracking
-- Run THIRD of the phase 5 files (after pricing and coupons). Not run
-- yet. Safe: no DROP/DELETE/TRUNCATE.

-- ========== users: referral code + store credit ==========
-- referral_code is generated once a user's first payment completes (see
-- src/lib/referrals.ts) — null until then, since only students with a
-- paid enrollment get one.
alter table users add column if not exists referral_code text unique;
alter table users add column if not exists store_credit_paise integer not null default 0;

comment on column users.referral_code is 'Personal referral code (e.g. REF-BHANU4K), set on first paid enrollment.';
comment on column users.store_credit_paise is 'Accumulated referral credit in paise, auto-applied at the next checkout.';

create index if not exists users_referral_code_idx on users(referral_code);

-- ========== referral_redemptions ==========
-- Same reserve-then-consume pattern as coupon_redemptions: reserved when
-- the referee's order is created, consumed (and the referrer credited)
-- only after verified payment, naturally expires if payment never
-- completes.
create table if not exists referral_redemptions (
  id uuid primary key default extensions.uuid_generate_v4(),
  referrer_user_id uuid not null references users(id) on delete cascade,
  referee_user_id uuid not null references users(id) on delete cascade,
  order_id uuid not null references payment_orders(id) on delete cascade,
  referee_discount_amount integer not null, -- paise, flat ₹200
  referrer_credit_amount integer not null, -- paise, flat ₹200
  status text not null default 'reserved' check (status in ('reserved', 'consumed', 'released')),
  reserved_until timestamptz not null,
  credited_at timestamptz,
  created_at timestamptz not null default now(),
  unique (order_id) -- one code per order — referral and coupon share this rule
);

create index if not exists referral_redemptions_referrer_idx on referral_redemptions(referrer_user_id);
create index if not exists referral_redemptions_status_idx on referral_redemptions(status, reserved_until);

alter table referral_redemptions enable row level security;
revoke all on referral_redemptions from anon, authenticated;

-- ========== payment_orders: what discount (if any) applied ==========
-- Lets the receipt email and admin/backup views show original price,
-- discount and final amount without re-deriving it from the redemption
-- tables every time.
alter table payment_orders add column if not exists original_amount integer;
alter table payment_orders add column if not exists discount_amount integer not null default 0;
alter table payment_orders add column if not exists credit_applied integer not null default 0;

comment on column payment_orders.original_amount is 'Pre-discount price in paise (founding or regular, whichever was active). Null on rows created before this column existed.';
comment on column payment_orders.discount_amount is 'Total discount in paise — coupon/referral portion + credit_applied. amount = original_amount - discount_amount.';
comment on column payment_orders.credit_applied is 'The store-credit portion of discount_amount specifically — how much to actually deduct from the buyer''s users.store_credit_paise on payment completion (not recomputed then, since the balance may have moved).';

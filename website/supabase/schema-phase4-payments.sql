-- UKPSC Test Platform — Phase 4: Razorpay payments
-- Not run yet. Safe: no DROP/DELETE/TRUNCATE, ADD COLUMN IF NOT EXISTS,
-- CREATE TABLE IF NOT EXISTS. Does not touch existing rows.

-- ========== payment_orders: tracks every Razorpay order end-to-end ==========
-- One row per checkout attempt. status starts 'created' at order-creation
-- time (before any money has moved) and transitions to 'paid' exactly
-- once — the transition is done with a guarded UPDATE ... WHERE
-- status = 'created' in application code (src/lib/orders.ts), so whichever
-- of the verify endpoint or the webhook processes the payment first wins
-- the race and creates the enrollment; the other sees the row already
-- 'paid' and no-ops. That's what makes both paths idempotent /
-- never-double-enroll.
create table if not exists payment_orders (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  package_id uuid not null references packages(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  amount integer not null, -- paise, matches the Razorpay API's unit
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_user_id_idx on payment_orders(user_id);
create index if not exists payment_orders_razorpay_order_id_idx on payment_orders(razorpay_order_id);
create index if not exists payment_orders_status_idx on payment_orders(status);

alter table payment_orders enable row level security;
revoke all on payment_orders from anon, authenticated;

-- ========== tests: release schedule ==========
-- timestamptz (not the naive `timestamp` most other columns here use) —
-- deliberately, to avoid the local-timezone parsing bug found and fixed
-- in the password reset work (naive timestamps get silently misread as
-- local time by JS's Date parser). Null or in the past = unlocked now;
-- in the future = the dashboard shows "Unlocks on <date>".
alter table tests add column if not exists release_at timestamptz;

comment on column tests.release_at is 'When this test becomes visible/available. Null or past = unlocked. timestamptz deliberately, not the naive timestamp type used elsewhere.';

create index if not exists tests_release_at_idx on tests(release_at);

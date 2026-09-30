-- UKPSC Decoded — Phase 24: universal offer codes + offer emails
-- Safe to run more than once. No DROP / DELETE / TRUNCATE.
--
-- A "universal offer code" is a normal coupons row (type single_use_percent)
-- with a large max_uses; the app allows it once per student. Nothing in the
-- coupons table changes.
--
-- marketing_opt_out: set when a student clicks "Unsubscribe" in an offer
-- email; they then get no more offer emails (login codes and receipts still
-- go out).
-- offer_emails: who was already emailed about which offer, so pressing
-- "Send" again never emails the same student twice.

alter table users add column if not exists marketing_opt_out boolean not null default false;

create table if not exists offer_emails (
  id uuid primary key default extensions.uuid_generate_v4(),
  coupon_id uuid not null references coupons(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  sent_at timestamptz not null default now(),
  unique (coupon_id, user_id)
);

create index if not exists offer_emails_coupon_id_idx on offer_emails(coupon_id);

alter table offer_emails enable row level security;
revoke all on offer_emails from anon, authenticated;

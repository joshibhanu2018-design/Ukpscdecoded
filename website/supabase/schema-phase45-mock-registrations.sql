-- UKPSC Test Platform — Phase 45: free mock registration popup
-- Safe to re-run. No DROP / DELETE / TRUNCATE.
--
-- The site-wide popup (components/FreeMockPopup.tsx) signs students up for the
-- free Warm-up Mock. Every submission is kept here, separately from accounts,
-- and listed in Admin -> Mock Registrations (with a CSV download).

create table if not exists mock_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  district text,
  source text not null default 'popup',
  page text,
  created_at timestamptz not null default now()
);
create index if not exists mock_registrations_created_at on mock_registrations (created_at desc);
alter table mock_registrations enable row level security;

-- Check:
-- select count(*) from mock_registrations;

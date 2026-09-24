-- UKPSC Test Platform — Phase 11: mentorship session booking
-- Not run yet. Safe: CREATE ... IF NOT EXISTS, ON CONFLICT DO NOTHING.
-- Only students who own the Mentorship package can book (checked in the app).

-- ========== weekly availability windows (IST) ==========
-- weekday: 0 = Sunday … 3 = Wednesday, 4 = Thursday … 6 = Saturday.
-- Each window is cut into slot_minutes slots. Edit from /test-platform/admin/mentorship.
create table if not exists mentor_availability (
  id uuid primary key default extensions.uuid_generate_v4(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null check (end_time > start_time),
  slot_minutes integer not null default 20 check (slot_minutes between 10 and 120),
  created_at timestamptz not null default now(),
  unique (weekday, start_time)
);

-- Default: Wednesday + Thursday, morning 10:00–12:00 and afternoon 14:00–17:00,
-- 20-minute slots = 15 slots a day, 30 a week (enough for 25 seats).
insert into mentor_availability (weekday, start_time, end_time, slot_minutes) values
  (3, '10:00', '12:00', 20), (3, '14:00', '17:00', 20),
  (4, '10:00', '12:00', 20), (4, '14:00', '17:00', 20)
on conflict (weekday, start_time) do nothing;

-- Days you're unavailable (holiday, exam day) — no slots are offered.
create table if not exists mentor_blocked_dates (
  day date primary key,
  note text
);

-- ========== bookings ==========
create table if not exists mentor_bookings (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  week_start date not null,           -- Monday of the slot's week (IST): one booking per student per week
  status text not null default 'booked' check (status in ('booked', 'cancelled', 'completed', 'no_show')),
  student_note text,                  -- what the student wants to discuss
  mentor_notes text,                  -- the written plan after the session
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- First come, first served, enforced by the database: two students
-- clicking the same slot at the same moment — exactly one insert succeeds.
create unique index if not exists mentor_bookings_slot_taken on mentor_bookings (slot_start) where status = 'booked';
-- One active booking per student per week.
create unique index if not exists mentor_bookings_one_per_week on mentor_bookings (user_id, week_start) where status = 'booked';
create index if not exists mentor_bookings_user_idx on mentor_bookings (user_id, slot_start desc);

-- ========== small key/value settings (meeting link etc.) ==========
create table if not exists app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table mentor_availability enable row level security;
alter table mentor_blocked_dates enable row level security;
alter table mentor_bookings enable row level security;
alter table app_settings enable row level security;
revoke all on mentor_availability, mentor_blocked_dates, mentor_bookings, app_settings from anon, authenticated;

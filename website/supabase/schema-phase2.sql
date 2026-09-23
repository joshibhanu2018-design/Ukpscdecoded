-- UKPSC Test Platform — Phase 2A: gamification + package pricing
-- Not run yet. Review, then run once in the Supabase SQL Editor.
--
-- IMPORTANT — read before running:
-- Four of the seven tables in the Phase 2A brief already exist in this
-- project (confirmed live via introspection on 2026-09-23), from whatever
-- built the schema documented in supabase/schema.sql:
--
--   requested `packages`      -> already exists, same shape minus 3 columns
--   requested `enrollments`   -> already exists, already matches 1:1
--   requested `test_attempts` -> already exists as `attempts`, same shape
--   requested `test_results`  -> already exists as `results`, same shape
--     (results is actually a superset — it also has question_performance)
--
-- Creating new `test_attempts`/`test_results` tables alongside the live
-- `attempts`/`results` would fork the data model into two disconnected
-- systems (which one does the app read/write? which one is "truth"?) for
-- no functional gain — confirmed you want one unified system, so this
-- file leaves `attempts`/`results` untouched (they already satisfy the
-- ask).
--
-- This file:
--   - ALTERs `packages` to add discount_percentage, original_price,
--     duration_minutes (missing from the live table)
--   - ALTERs `enrollments` to add product_type, video_hours_used,
--     video_hours_limit (so video-course entitlements can plug in later)
--   - CREATEs `videos` (content for video_course/combo packages)
--   - CREATEs `badges`, `user_gamification`, `leaderboard` (genuinely new)
--
-- Safety, checked against the live DB on 2026-09-23:
--   - No DROP / DELETE / TRUNCATE anywhere in this file.
--   - Every ALTER uses ADD COLUMN IF NOT EXISTS; every CREATE TABLE uses
--     IF NOT EXISTS — safe to run even if partially applied already.
--   - New NOT NULL columns (video_hours_used) carry a DEFAULT, which
--     Postgres backfills instantly without rewriting/locking the table.
--   - `users` is never touched — your test user (Varun Joshi) and every
--     other row are untouched. packages/enrollments/attempts/results are
--     all currently empty (0 rows), so this is zero-risk to run today
--     regardless.

-- ========== packages: add Phase 2A pricing/duration columns ==========
alter table packages add column if not exists discount_percentage numeric(5, 2) default 0;
alter table packages add column if not exists original_price numeric(10, 2);
alter table packages add column if not exists duration_minutes integer;

comment on column packages.discount_percentage is 'Percentage off original_price, 0-100. Not DB-enforced to avoid breaking existing rows — validate in application code.';
comment on column packages.package_type is 'Expected values: test_series, video_course, combo (not DB-enforced, same reason).';

create index if not exists packages_package_type_idx on packages(package_type);
create index if not exists packages_is_active_idx on packages(is_active);

-- attempts, results: no changes — already match the Phase 2A brief
-- (user_id/test_id/enrollment_id, answers jsonb, score, percentage,
-- status on attempts; overall_score/accuracy/percentile,
-- subject_accuracy/topic_accuracy jsonb on results).

-- ========== enrollments: product_type + video-course entitlements ==========
-- product_type is a denormalized snapshot of packages.package_type taken
-- at purchase time, so access checks don't need to join packages (and
-- keep working even if a package's type changes later). video_hours_used
-- / video_hours_limit mirror the existing attempts_used jsonb pattern —
-- per-enrollment consumption tracking, this time for video-course access.
-- All three are nullable/defaulted, so existing rows are unaffected.
alter table enrollments add column if not exists product_type varchar(50);
alter table enrollments add column if not exists video_hours_used numeric(6, 2) not null default 0;
alter table enrollments add column if not exists video_hours_limit numeric(6, 2);

comment on column enrollments.product_type is 'Snapshot of packages.package_type at purchase time: test_series, video_course, or combo.';

create index if not exists enrollments_product_type_idx on enrollments(product_type);

-- ========== videos: content for video_course / combo packages ==========
create table if not exists videos (
  id uuid primary key default extensions.uuid_generate_v4(),
  package_id uuid not null references packages(id) on delete cascade,
  title varchar(255) not null,
  description text,
  video_url text not null,
  duration_minutes integer,
  order_index integer not null default 0,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_package_id_idx on videos(package_id);
create index if not exists videos_package_order_idx on videos(package_id, order_index);

-- ========== badges: catalog of earnable badges ==========
create table if not exists badges (
  id uuid primary key default extensions.uuid_generate_v4(),
  badge_name varchar(255) not null unique,
  description text,
  icon_url text,
  criteria jsonb not null default '{}'::jsonb, -- e.g. {"type": "streak", "value": 7}
  reward_xp integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists badges_badge_name_idx on badges(badge_name);

-- ========== user_gamification: one row per user ==========
create table if not exists user_gamification (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null unique references users(id) on delete cascade,
  level integer not null default 1 check (level between 1 and 25),
  total_xp integer not null default 0 check (total_xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  best_streak integer not null default 0 check (best_streak >= 0),
  global_rank integer,
  monthly_rank integer,
  weekly_rank integer,
  total_tests_taken integer not null default 0 check (total_tests_taken >= 0),
  badges jsonb not null default '[]'::jsonb, -- array of {badge_id, earned_at}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_gamification_total_xp_idx on user_gamification(total_xp desc);
create index if not exists user_gamification_level_idx on user_gamification(level);
create index if not exists user_gamification_global_rank_idx on user_gamification(global_rank);

-- ========== leaderboard: cached/denormalized for fast reads ==========
create table if not exists leaderboard (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null unique references users(id) on delete cascade,
  username varchar(255) not null, -- denormalized copy of users.full_name, refreshed on recompute
  total_score numeric(12, 2) not null default 0,
  tests_taken integer not null default 0,
  avg_score numeric(6, 2),
  global_rank integer,
  weekly_rank integer,
  monthly_rank integer,
  level integer not null default 1,
  streak integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists leaderboard_global_rank_idx on leaderboard(global_rank);
create index if not exists leaderboard_weekly_rank_idx on leaderboard(weekly_rank);
create index if not exists leaderboard_monthly_rank_idx on leaderboard(monthly_rank);
create index if not exists leaderboard_total_score_idx on leaderboard(total_score desc);

-- ========== RLS ==========
-- Same deny-by-default posture as the rest of the schema (see
-- supabase/enable-rls.sql): the app only ever talks to Supabase through
-- the service-role key from server-side API routes, which bypasses RLS.
-- Even though leaderboard/badges data isn't secret, it's still locked
-- down here for consistency — serve it through an API route, not directly
-- from the anon key, so there's one access path to reason about.
alter table videos enable row level security;
alter table badges enable row level security;
alter table user_gamification enable row level security;
alter table leaderboard enable row level security;

revoke all on videos, badges, user_gamification, leaderboard from anon, authenticated;

-- UKPSC Test Platform — Phase 9: device limit, XP/streak/level, admin accounts
-- Not run yet. Safe: no DROP TABLE/DELETE/TRUNCATE; CREATE ... IF NOT
-- EXISTS / CREATE OR REPLACE / ADD COLUMN IF NOT EXISTS.
--
-- AFTER RUNNING: every student is logged out once (old login cookies carry
-- no device id) and simply logs in again with an email code.

-- ========== user_sessions: one row per logged-in device ==========
-- The login cookie carries this row's id. Logging in on a 3rd device
-- revokes the oldest active row, which logs that device out on its next
-- page load (see MAX_DEVICES in src/lib/auth-utils.ts).
create table if not exists user_sessions (
  id uuid primary key default extensions.uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  user_agent text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_reason text -- 'logout' | 'device_limit' | 'admin'
);

create index if not exists user_sessions_active_idx on user_sessions (user_id, created_at desc) where revoked_at is null;

alter table user_sessions enable row level security;
revoke all on user_sessions from anon, authenticated;

-- ========== gamification: XP / level / streak from test results ==========
-- Streak = consecutive days (IST) with at least one submitted test.
alter table user_gamification add column if not exists last_active_date date;

-- Level n needs 50*n*(n-1) XP: L2 = 100, L3 = 300, L4 = 600, L5 = 1000 …
-- L25 = 30,000. Keep in sync with levelFromXp() in src/lib/gamification.ts.
--
-- Called once per submitted attempt (the submit itself is exactly-once, see
-- finalizeAttempt in src/lib/tests.ts). Runs as one transaction with a row
-- lock, so two tests submitted at the same moment can't lose XP.
create or replace function award_test_xp(p_user_id uuid, p_xp integer, p_today date)
returns table (total_xp integer, level integer, current_streak integer, best_streak integer)
language plpgsql
as $$
#variable_conflict use_column
declare
  g user_gamification%rowtype;
  v_streak integer;
  v_xp integer;
  v_level integer;
begin
  insert into user_gamification (user_id) values (p_user_id) on conflict (user_id) do nothing;
  select * into g from user_gamification ug where ug.user_id = p_user_id for update;

  if g.last_active_date = p_today then
    v_streak := greatest(g.current_streak, 1);
  elsif g.last_active_date = p_today - 1 then
    v_streak := g.current_streak + 1;
  else
    v_streak := 1;
  end if;

  v_xp := g.total_xp + greatest(p_xp, 0);
  v_level := least(25, greatest(1, floor((1 + sqrt(1 + v_xp / 12.5)) / 2)::integer));

  update user_gamification ug set
    total_xp = v_xp,
    level = v_level,
    current_streak = v_streak,
    best_streak = greatest(g.best_streak, v_streak),
    total_tests_taken = g.total_tests_taken + 1,
    last_active_date = greatest(coalesce(g.last_active_date, p_today), p_today),
    updated_at = now()
  where ug.user_id = p_user_id;

  return query select v_xp, v_level, v_streak, greatest(g.best_streak, v_streak);
end;
$$;

revoke execute on function award_test_xp(uuid, integer, date) from public, anon, authenticated;

-- ========== admin accounts ==========
-- Admins are ordinary users with users.role = 'admin'. They log in with
-- the same email code as students; /test-platform/admin checks the role.
-- The old shared ADMIN_IMPORT_SECRET is no longer used.
--
-- Make YOURSELF the first admin: log in on the site once (so your account
-- exists), then run the line below with your email. Add further admins
-- from /test-platform/admin afterwards.
--
--   update users set role = 'admin' where lower(email) = lower('you@example.com');

-- SECURITY FIX — run this now in the Supabase SQL Editor.
--
-- Row Level Security is currently OFF (or has an overly permissive policy)
-- on these tables. Verified directly: the public anon key — which ships in
-- every visitor's browser bundle — can INSERT and SELECT rows in `users`
-- right now, bypassing the API entirely. That means anyone can read every
-- password_hash and create arbitrary accounts without going through
-- /api/auth/register.
--
-- The app only ever talks to Supabase through the service role key on the
-- server (supabaseAdmin() in src/lib/supabase.ts), which bypasses RLS by
-- design — so enabling RLS with zero policies below blocks the anon/
-- authenticated roles completely without breaking the app.

alter table users enable row level security;
alter table questions enable row level security;
alter table packages enable row level security;
alter table tests enable row level security;
alter table package_tests enable row level security;
alter table enrollments enable row level security;
alter table attempts enable row level security;
alter table results enable row level security;
alter table password_reset_tokens enable row level security;
alter table audit_logs enable row level security;

-- Belt-and-suspenders: also drop any direct grants to anon/authenticated,
-- in case a permissive policy or grant is what let the probe through.
revoke all on users, questions, packages, tests, package_tests, enrollments,
  attempts, results, password_reset_tokens, audit_logs
  from anon, authenticated;

-- Views run with the querying role's privileges for the tables underneath,
-- so the revokes above should cover test_performance_summary and
-- active_enrollments too — but sanity-check with the anon key afterwards:
--   curl "$SUPABASE_URL/rest/v1/users?select=id&limit=1" \
--     -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
-- should return 401/403 or an empty-with-no-rows-permitted error, not `[]`
-- with real data ever appearing when rows exist.

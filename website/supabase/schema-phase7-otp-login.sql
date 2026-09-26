-- UKPSC Test Platform — Phase 7: passwordless email OTP login
-- Not run yet. Safe: no DROP TABLE/DELETE/TRUNCATE; CREATE TABLE IF NOT
-- EXISTS; the one ALTER only relaxes a constraint. Existing users and
-- their password hashes are untouched.

-- ========== users: password becomes optional ==========
-- Accounts created by OTP login have no password. Existing accounts keep
-- their hash (unused by the new login screen, harmless to keep).
alter table users alter column password_hash drop not null;

-- One account per email, case-insensitively. Stops two parallel first
-- logins creating duplicate accounts, and speeds up the login lookup.
-- If this line FAILS, duplicates already exist — find them with:
--   select lower(email), count(*) from users group by 1 having count(*) > 1;
-- merge/delete the extras by hand, then re-run this file.
create unique index if not exists users_email_lower_unique on users (lower(email));

-- ========== login_codes: one row per emailed 6-digit code ==========
-- code_hash = HMAC-SHA256(SESSION_SECRET, email + ":" + code). Keyed with
-- the server secret, so a leaked table can't be brute-forced offline
-- (a plain hash of a 6-digit code falls to 1,000,000 guesses).
create table if not exists login_codes (
  id uuid primary key default extensions.uuid_generate_v4(),
  email text not null,                  -- always stored lower-cased
  code_hash text not null,
  ip text,                              -- requester IP, for the per-IP rate limit
  attempts integer not null default 0,  -- wrong guesses against this code (max 5)
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists login_codes_email_created_idx on login_codes (email, created_at desc);
create index if not exists login_codes_ip_created_idx on login_codes (ip, created_at desc);

alter table login_codes enable row level security;
revoke all on login_codes from anon, authenticated;

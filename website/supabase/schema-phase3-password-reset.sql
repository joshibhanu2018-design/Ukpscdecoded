-- UKPSC Test Platform — Phase 3: password reset schema
-- Not run yet. Safe to run: no DROP/DELETE/TRUNCATE, ADD COLUMN IF NOT
-- EXISTS, CREATE INDEX IF NOT EXISTS. Does not touch existing rows.

-- ========== password_reset_tokens: single-use tracking ==========
-- The existing table has no way to mark a token consumed. used_at is set
-- once the token is redeemed; a token is valid only when used_at is null
-- AND expires_at is in the future. `token` stores a SHA-256 hash of the
-- random value emailed to the user — the raw token is never persisted.
alter table password_reset_tokens add column if not exists used_at timestamptz;

create unique index if not exists password_reset_tokens_token_idx on password_reset_tokens(token);
create index if not exists password_reset_tokens_user_id_idx on password_reset_tokens(user_id);
-- Powers both the rate-limit check (count rows created in the last hour
-- for a user) and general cleanup queries.
create index if not exists password_reset_tokens_created_at_idx on password_reset_tokens(created_at);

comment on column password_reset_tokens.token is 'SHA-256 hex hash of the raw token emailed to the user — never the raw value.';
comment on column password_reset_tokens.used_at is 'Set once the token is redeemed. A token is valid only when this is null and expires_at is in the future.';

-- ========== users: session invalidation on password change ==========
-- Auth here is stateless HMAC-signed session cookies (see
-- src/lib/auth-utils.ts) — there's no sessions table to delete rows from
-- to "log out" a user. password_changed_at is the mechanism instead: every
-- session token now carries an issued-at time, and a token issued before
-- the user's password_changed_at is rejected. Resetting the password sets
-- this to now(), which invalidates every session issued before that
-- moment — i.e. logs out everywhere — with no per-session bookkeeping.
alter table users add column if not exists password_changed_at timestamptz;

comment on column users.password_changed_at is 'Session tokens issued before this timestamp are rejected — set on every password reset to invalidate existing sessions.';

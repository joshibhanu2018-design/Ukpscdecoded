import { createHash, randomBytes } from "crypto";
import { supabaseAdmin } from "./supabase";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const RATE_LIMIT_MAX = 3;

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * password_reset_tokens.expires_at is a Postgres `timestamp without time
 * zone` column — PostgREST returns it with no UTC suffix (e.g.
 * "2026-09-23T13:07:59.418"), and JS's Date parser treats a
 * timezone-less ISO string as LOCAL time, not UTC. On a non-UTC server
 * (confirmed: IST, UTC+5:30) that silently shifts the parsed time by
 * hours, making a token created seconds ago look already expired. The
 * value is always written as UTC (see createPasswordResetToken), so it
 * must be parsed as UTC too.
 */
function parseUtcTimestamp(value: string): Date {
  return new Date(/[Z+-]\d{2}:?\d{2}$|Z$/.test(value) ? value : `${value}Z`);
}

/**
 * Count of reset tokens created for this user in the last hour, used or
 * not — rate-limiting counts emails sent, not currently-valid tokens.
 * Fails open (returns 0) on a DB error so a transient failure doesn't
 * lock out a legitimate user; createPasswordResetToken will still fail
 * loudly if the database is actually unreachable.
 */
export async function countRecentResetRequests(userId: string): Promise<number> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  const { count, error } = await supabaseAdmin()
    .from("password_reset_tokens")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) {
    console.error("[password-reset] Could not count recent reset requests:", error);
    return 0;
  }
  return count ?? 0;
}

/** Creates a reset token row (hashed) and returns the raw token for the email link. */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const { error } = await supabaseAdmin()
    .from("password_reset_tokens")
    .insert({ user_id: userId, token: hashToken(rawToken), expires_at: expiresAt });

  if (error) throw new Error(`Could not create reset token: ${error.message}`);

  return rawToken;
}

export type ResetTokenLookup = { id: string; user_id: string };

/**
 * Validates and atomically consumes a reset token: must exist, be unused,
 * and not be expired. The update is guarded with `.is("used_at", null)`
 * and checked for an affected row, so two concurrent requests with the
 * same token can't both succeed.
 */
export async function consumePasswordResetToken(rawToken: string): Promise<ResetTokenLookup | null> {
  const tokenHash = hashToken(rawToken);
  const db = supabaseAdmin();

  const { data, error } = await db
    .from("password_reset_tokens")
    .select("id, user_id, expires_at, used_at")
    .eq("token", tokenHash)
    .maybeSingle();

  if (error || !data) return null;
  if (data.used_at) return null;
  if (parseUtcTimestamp(data.expires_at) < new Date()) return null;

  const { data: updated, error: updateError } = await db
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", data.id)
    .is("used_at", null)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) return null;

  return { id: data.id, user_id: data.user_id };
}

import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "./supabase";

export const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_ATTEMPTS_PER_CODE = 5;
export const MAX_CODES_PER_EMAIL = 3; // per EMAIL_WINDOW_MS
export const EMAIL_WINDOW_MS = 15 * 60 * 1000;
export const MAX_CODES_PER_IP = 10; // per IP_WINDOW_MS
export const IP_WINDOW_MS = 60 * 60 * 1000;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

function hashCode(email: string, code: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  return createHmac("sha256", secret).update(`${email}:${code}`).digest("hex");
}

const SIGNUP_TICKET_TTL_MS = 15 * 60 * 1000;

/**
 * Proof that `email` just passed OTP verification, for a first-time user
 * who still has to type their name. The code itself is consumed at
 * verification, so the name step can't be used to get more guesses.
 */
export function createSignupTicket(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + SIGNUP_TICKET_TTL_MS, p: "signup" })).toString(
    "base64url"
  );
  return `${payload}.${hmac(payload)}`;
}

export function readSignupTicket(ticket: unknown): string | null {
  if (typeof ticket !== "string") return null;
  const [payload, sig] = ticket.split(".");
  if (!payload || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(hmac(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.p !== "signup" || typeof data.email !== "string" || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    return data.email;
  } catch {
    return null;
  }
}

function hmac(value: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  return createHmac("sha256", secret).update(`otp-ticket:${value}`).digest("base64url");
}

export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** First hop of X-Forwarded-For (set by Vercel), falling back to X-Real-IP. */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

export type RateLimitResult = { ok: true } | { ok: false; reason: "email" | "ip" };

/**
 * Counts codes already issued, not codes still valid — the limits are on
 * emails sent. Fails CLOSED on a DB error (unlike password reset): an
 * outage shouldn't turn into an unlimited email cannon.
 */
export async function checkRateLimits(email: string, ip: string): Promise<RateLimitResult> {
  const db = supabaseAdmin();
  const [byEmail, byIp] = await Promise.all([
    db
      .from("login_codes")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", new Date(Date.now() - EMAIL_WINDOW_MS).toISOString()),
    db
      .from("login_codes")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", new Date(Date.now() - IP_WINDOW_MS).toISOString()),
  ]);

  if (byEmail.error || byIp.error) throw new Error(`rate limit check failed: ${(byEmail.error ?? byIp.error)?.message}`);
  if ((byEmail.count ?? 0) >= MAX_CODES_PER_EMAIL) return { ok: false, reason: "email" };
  if ((byIp.count ?? 0) >= MAX_CODES_PER_IP) return { ok: false, reason: "ip" };
  return { ok: true };
}

/** Stores a new code and returns the plain code (to email — never stored). */
export async function issueCode(email: string, ip: string): Promise<string> {
  const code = generateCode();
  const { error } = await supabaseAdmin()
    .from("login_codes")
    .insert({
      email,
      ip,
      code_hash: hashCode(email, code),
      expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
    });
  if (error) throw new Error(`Could not store login code: ${error.message}`);
  return code;
}

export type VerifyResult =
  | { ok: true; codeId: string }
  | { ok: false; reason: "no_code" | "expired" | "too_many_attempts" | "wrong"; attemptsLeft?: number };

/**
 * Checks `code` against the newest unused code for this email (requesting
 * a new code supersedes older ones). Does NOT consume it — the caller
 * consumes only once login actually succeeds (a first-time user may still
 * need to send their name), via consumeCode().
 *
 * Every check first claims one of the code's 5 attempts with a
 * compare-and-set UPDATE, and only then compares. Checking first and
 * counting after would let a burst of parallel requests all read
 * "attempts = 0" and each get a free guess. A correct guess also spends
 * an attempt, which is harmless.
 */
export async function verifyCode(email: string, code: string): Promise<VerifyResult> {
  const db = supabaseAdmin();

  for (let tries = 0; tries < 3; tries++) {
    const { data: row, error } = await db
      .from("login_codes")
      .select("id, code_hash, attempts, expires_at")
      .eq("email", email)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !row) return { ok: false, reason: "no_code" };
    if (new Date(row.expires_at).getTime() < Date.now()) return { ok: false, reason: "expired" };
    if (row.attempts >= MAX_ATTEMPTS_PER_CODE) return { ok: false, reason: "too_many_attempts" };

    const { data: claimed } = await db
      .from("login_codes")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id)
      .eq("attempts", row.attempts)
      .select("attempts");
    if (!claimed || claimed.length === 0) continue; // lost a race with a parallel guess — re-read

    const expected = Buffer.from(row.code_hash, "hex");
    const actual = Buffer.from(hashCode(email, /^\d{6}$/.test(code) ? code : "x"), "hex");
    if (expected.length === actual.length && timingSafeEqual(expected, actual)) {
      return { ok: true, codeId: row.id };
    }

    const used = row.attempts + 1;
    if (used >= MAX_ATTEMPTS_PER_CODE) return { ok: false, reason: "too_many_attempts" };
    return { ok: false, reason: "wrong", attemptsLeft: MAX_ATTEMPTS_PER_CODE - used };
  }

  return { ok: false, reason: "wrong" };
}

/** Single-use: true only for the caller that actually marks it used. */
export async function consumeCode(codeId: string): Promise<boolean> {
  const { data } = await supabaseAdmin()
    .from("login_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", codeId)
    .is("used_at", null)
    .select("id");
  return !!data && data.length > 0;
}

/**
 * Case-insensitive lookup. Accounts made by the old signup form were
 * lower-cased, but ilike (with LIKE wildcards escaped — "_" is common in
 * emails) also catches any mixed-case rows created another way.
 */
export async function findUserIdByEmail(email: string): Promise<string | null> {
  const escaped = email.replace(/[\\%_]/g, (c) => `\\${c}`);
  const { data, error } = await supabaseAdmin().from("users").select("id").ilike("email", escaped).limit(1);
  if (error) throw new Error(`user lookup failed: ${error.message}`);
  return data?.[0]?.id ?? null;
}

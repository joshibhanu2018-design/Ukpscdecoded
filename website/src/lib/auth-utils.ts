import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "./supabase";

const SALT_ROUNDS = 12;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const SESSION_COOKIE_NAME = "ukpsc_session";

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Add a long random string to .env.local.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

type SessionPayload = { sub: string; iat: number; exp: number };

/**
 * Stateless, HMAC-signed session token: base64url(payload).base64url(signature).
 * No sessions table required — the DB schema this project already has doesn't
 * include one, so the token itself carries (userId, issuedAt, expiry) and is
 * verified on each request instead of looked up. `iat` lets getUserFromSession
 * reject tokens issued before the user's last password change (see
 * password_changed_at below) — that's how "log out all sessions" works
 * without a session table to delete rows from.
 */
export function createSessionToken(userId: string): { token: string; expiresAt: Date } {
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_TTL_MS);
  const payload = Buffer.from(JSON.stringify({ sub: userId, iat: now, exp: expiresAt.getTime() })).toString(
    "base64url"
  );
  const signature = sign(payload);
  return { token: `${payload}.${signature}`, expiresAt };
}

function decodeSessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.sub !== "string" || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    return { sub: data.sub, iat: typeof data.iat === "number" ? data.iat : 0, exp: data.exp };
  } catch {
    return null;
  }
}

export function verifySessionToken(token: string | undefined | null): string | null {
  return decodeSessionToken(token)?.sub ?? null;
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

export async function getUserFromSession(token: string | undefined | null): Promise<User | null> {
  const decoded = decodeSessionToken(token);
  if (!decoded) return null;

  const { data, error } = await supabaseAdmin()
    .from("users")
    .select("id, full_name, email, phone, role, created_at, password_changed_at")
    .eq("id", decoded.sub)
    .maybeSingle();

  if (error || !data) return null;

  if (data.password_changed_at && decoded.iat < new Date(data.password_changed_at).getTime()) {
    return null; // session was issued before the last password reset
  }

  const { password_changed_at: _passwordChangedAt, ...user } = data;
  return user as User;
}

/**
 * Updates the user's password and, in the same write, invalidates every
 * session issued before now (see decodeSessionToken/getUserFromSession).
 */
export async function updatePassword(userId: string, newPasswordHash: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("users")
    .update({ password_hash: newPasswordHash, password_changed_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(`Could not update password: ${error.message}`);
}

import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "./supabase";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const LAST_SEEN_REFRESH_MS = 60 * 60 * 1000; // bump last_seen_at at most hourly

/** Devices a student can stay logged in on at once; a new login beyond this logs out the oldest. */
export const MAX_DEVICES = 2;

export const SESSION_COOKIE_NAME = "ukpsc_session";

export type User = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

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

type SessionPayload = { sub: string; sid: string; iat: number; exp: number };

/**
 * Login cookie: base64url({sub, sid, iat, exp}).HMAC. `sid` points at a
 * user_sessions row — one per device. The signature stops forgery; the row
 * is what lets a device be logged out (logout, or the device limit).
 */
function encodeSessionToken(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
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
    // Cookies from before the device limit have no sid — treat as logged out.
    if (typeof data.sid !== "string") return null;
    if (Date.now() > data.exp) return null;
    return { sub: data.sub, sid: data.sid, iat: typeof data.iat === "number" ? data.iat : 0, exp: data.exp };
  } catch {
    return null;
  }
}

/**
 * Starts a session on a new device. If that takes the user past
 * MAX_DEVICES, the oldest active sessions are revoked: "newest login wins",
 * so a student who lost their phone is never locked out, while one account
 * can't stay logged in on many devices at once.
 */
export async function createSession(
  userId: string,
  userAgent: string | null
): Promise<{ token: string; expiresAt: Date }> {
  const db = supabaseAdmin();
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_TTL_MS);

  const { data: row, error } = await db
    .from("user_sessions")
    .insert({ user_id: userId, user_agent: userAgent?.slice(0, 300) ?? null })
    .select("id")
    .single();
  if (error || !row) throw new Error(`Could not create session: ${error?.message ?? "no row"}`);

  const { data: active } = await db
    .from("user_sessions")
    .select("id")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  const excess = (active ?? []).slice(MAX_DEVICES).map((s) => s.id as string);
  if (excess.length > 0) {
    await db
      .from("user_sessions")
      .update({ revoked_at: new Date().toISOString(), revoked_reason: "device_limit" })
      .in("id", excess)
      .is("revoked_at", null);
  }

  return { token: encodeSessionToken({ sub: userId, sid: row.id, iat: now, exp: expiresAt.getTime() }), expiresAt };
}

/** Logs out just this device. */
export async function revokeSession(token: string | undefined | null): Promise<void> {
  const decoded = decodeSessionToken(token);
  if (!decoded) return;
  await supabaseAdmin()
    .from("user_sessions")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: "logout" })
    .eq("id", decoded.sid)
    .eq("user_id", decoded.sub)
    .is("revoked_at", null);
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

  const db = supabaseAdmin();
  const [{ data: user, error }, { data: session }] = await Promise.all([
    db.from("users").select("id, full_name, email, phone, role, created_at").eq("id", decoded.sub).maybeSingle(),
    db
      .from("user_sessions")
      .select("id, last_seen_at")
      .eq("id", decoded.sid)
      .eq("user_id", decoded.sub)
      .is("revoked_at", null)
      .maybeSingle(),
  ]);

  if (error || !user || !session) return null;

  if (Date.now() - new Date(session.last_seen_at).getTime() > LAST_SEEN_REFRESH_MS) {
    // Fire-and-forget: a failed "last seen" update must not log anyone out.
    void db
      .from("user_sessions")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", session.id)
      .then(({ error: e }) => e && console.error("[auth] last_seen_at update failed:", e.message));
  }

  return user as User;
}

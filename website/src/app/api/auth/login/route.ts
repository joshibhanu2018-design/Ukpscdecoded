import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword, createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

const GENERIC_ERROR = "Invalid email or password";

function fail(message: string, status: number, cause?: unknown) {
  if (cause) console.error(`[login] ${message}:`, cause);
  const body: Record<string, unknown> = { error: message };
  if (process.env.NODE_ENV !== "production" && cause) {
    body.details = cause instanceof Error ? cause.message : cause;
  }
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return fail("Invalid request body", 400);
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return fail(GENERIC_ERROR, 400);
  }

  let db;
  try {
    db = supabaseAdmin();
  } catch (err) {
    return fail("Server misconfigured: Supabase admin client could not be created", 500, err);
  }

  const { data: user, error } = await db
    .from("users")
    .select("id, full_name, email, phone, role, created_at, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return fail("Could not look up account", 500, error);
  }
  // Same generic error whether the account doesn't exist or the password is
  // wrong — avoids leaking which emails are registered.
  if (!user) {
    return fail(GENERIC_ERROR, 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return fail(GENERIC_ERROR, 401);
  }

  let token: string, expiresAt: Date;
  try {
    ({ token, expiresAt } = createSessionToken(user.id));
  } catch (err) {
    return fail("Could not start session", 500, err);
  }

  const response = NextResponse.json({
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
    },
  });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
  return response;
}

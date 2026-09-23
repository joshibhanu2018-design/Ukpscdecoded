import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword, createSessionToken, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(message: string, status: number, cause?: unknown) {
  if (cause) console.error(`[register] ${message}:`, cause);
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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return fail("Name, email and password are required", 400);
  }
  if (!EMAIL_RE.test(email)) {
    return fail("Enter a valid email address", 400);
  }
  if (password.length < 8) {
    return fail("Password must be at least 8 characters", 400);
  }

  let db;
  try {
    db = supabaseAdmin();
  } catch (err) {
    return fail("Server misconfigured: Supabase admin client could not be created", 500, err);
  }

  const { data: existing, error: lookupError } = await db
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return fail("Could not check for an existing account", 500, lookupError);
  }
  if (existing) {
    return fail("An account with this email already exists", 409);
  }

  let password_hash: string;
  try {
    password_hash = await hashPassword(password);
  } catch (err) {
    return fail("Could not process password", 500, err);
  }

  const { data: user, error: insertError } = await db
    .from("users")
    .insert({ full_name: name, email, phone: phone || null, password_hash })
    .select("id, full_name, email, phone, role, created_at")
    .single();

  if (insertError || !user) {
    return fail("Could not create account. Please try again.", 500, insertError);
  }

  let token: string, expiresAt: Date;
  try {
    ({ token, expiresAt } = createSessionToken(user.id));
  } catch (err) {
    return fail("Account created, but session could not be started", 500, err);
  }

  const response = NextResponse.json({ user }, { status: 201 });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
  return response;
}

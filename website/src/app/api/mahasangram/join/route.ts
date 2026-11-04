import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, getUserFromSession, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { findUserIdByEmail, getClientIp, normalizeEmail } from "@/lib/otp";
import { cleanPhone, PHONE_ERROR, PHONE_RE } from "@/lib/phone";
import { UK_DISTRICTS } from "@/lib/districts";

/** Sign-ups per IP per hour, so the form can't be used to mass-create accounts. */
const MAX_JOINS_PER_IP = 8;
const joins = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (joins.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  joins.set(ip, recent);
  return recent.length > MAX_JOINS_PER_IP;
}

/**
 * Free Mock 1 sign-up (Mock Mahasangram). A NEW email gets an account and is
 * logged straight in, with no email code (saves the Resend daily limit). An
 * email that already has an account must log in with its code as usual, so
 * nobody can enter someone else's account through this form.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const district = typeof body?.district === "string" ? body.district.trim() : "";
  if (!UK_DISTRICTS.includes(district)) {
    return NextResponse.json({ error: "Choose your district" }, { status: 400 });
  }

  // Already logged in: just save the district.
  const current = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (current) {
    await supabaseAdmin().from("users").update({ district }).eq("id", current.id);
    return NextResponse.json({ ok: true });
  }

  const email = normalizeEmail(body?.email);
  if (!email) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  const name = typeof body?.full_name === "string" ? body.full_name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Enter your full name" }, { status: 400 });
  }
  const phone = cleanPhone(body?.phone);
  if (!PHONE_RE.test(phone)) return NextResponse.json({ error: PHONE_ERROR }, { status: 400 });

  if (await findUserIdByEmail(email)) {
    return NextResponse.json(
      { error: "You already have an account. Log in with your email code to take the mock.", reason: "login" },
      { status: 409 }
    );
  }
  if (tooMany(getClientIp(request.headers))) {
    return NextResponse.json({ error: "Too many sign-ups from this network. Try again later." }, { status: 429 });
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("users")
      .insert({ email, full_name: name, phone, district, signup_source: "mahasangram", password_hash: null, role: "student" })
      .select("id")
      .single();
    if (error || !data) {
      // Lost a race with a parallel sign-up for the same email: send them to log in.
      if (await findUserIdByEmail(email)) {
        return NextResponse.json({ error: "You already have an account. Log in with your email code.", reason: "login" }, { status: 409 });
      }
      throw new Error(error?.message ?? "insert returned no row");
    }

    const { token, expiresAt } = await createSession(data.id as string, request.headers.get("user-agent"));
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
    return response;
  } catch (err) {
    console.error("[mahasangram/join] failed:", err);
    return NextResponse.json({ error: "Could not sign you up. Please try again." }, { status: 500 });
  }
}

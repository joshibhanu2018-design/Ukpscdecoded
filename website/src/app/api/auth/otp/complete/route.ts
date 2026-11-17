import { NextRequest, NextResponse } from "next/server";
import { createSession, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { SESSION_HINT_COOKIE, sessionHintOptions } from "@/lib/session-hint";
import { supabaseAdmin } from "@/lib/supabase";
import { EMAIL_RE, findUserIdByEmail, findUserIdsByPhone, normalizeEmail, phoneOfIdentity, readSignupTicket } from "@/lib/otp";
import { cleanPhone, PHONE_ERROR, PHONE_RE } from "@/lib/phone";

/** Step 3 (first login only): create the account with the student's name and mobile. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const identity = readSignupTicket(body?.ticket);
  if (!identity) {
    return NextResponse.json(
      { error: "Session expired — please log in again.", reason: "ticket" },
      { status: 400 }
    );
  }

  const name = typeof body?.full_name === "string" ? body.full_name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Enter your full name" }, { status: 400 });
  }
  // Email login: the ticket proves the email and the student types a mobile.
  // WhatsApp login: the ticket proves the mobile and the student types an email
  // (receipts and course emails go there).
  const verifiedPhone = phoneOfIdentity(identity);
  const phone = verifiedPhone ?? cleanPhone(body?.phone);
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: PHONE_ERROR }, { status: 400 });
  }
  const email = verifiedPhone ? normalizeEmail(body?.email) : identity;
  if (verifiedPhone && (!EMAIL_RE.test(email) || email.length > 254)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  try {
    // Double-submit or two tabs: the account may already exist — just log in.
    let userId = await findUserIdByEmail(email);
    if (verifiedPhone && userId) {
      // Double-submit of this same form: the account just made carries this number.
      // Any other account with that email was not proven here, so it is never opened.
      const mine = await findUserIdsByPhone(verifiedPhone);
      if (!mine.includes(userId)) {
        return NextResponse.json(
          { error: "This email already has an account. Please log in with your email instead.", reason: "use_email" },
          { status: 409 }
        );
      }
    }
    if (!userId) {
      const { data, error } = await supabaseAdmin()
        .from("users")
        .insert({ email, full_name: name, phone, password_hash: null, role: "student" })
        .select("id")
        .single();
      if (error || !data) {
        // Lost an insert race to a parallel request — use that row.
        userId = await findUserIdByEmail(email);
        if (!userId) throw new Error(error?.message ?? "insert returned no row");
        // WhatsApp signup: only the number is proven, so that row must carry it.
        if (verifiedPhone && !(await findUserIdsByPhone(verifiedPhone)).includes(userId)) {
          return NextResponse.json(
            { error: "This email already has an account. Please log in with your email instead.", reason: "use_email" },
            { status: 409 }
          );
        }
      } else {
        userId = data.id as string;
      }
    }

    const { token, expiresAt } = await createSession(userId!, request.headers.get("user-agent"));
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
    response.cookies.set(SESSION_HINT_COOKIE, "1", sessionHintOptions(expiresAt));
    return response;
  } catch (err) {
    console.error("[otp/complete] failed:", err);
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
  }
}

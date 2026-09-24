import { NextRequest, NextResponse } from "next/server";
import { createSession, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { findUserIdByEmail, readSignupTicket } from "@/lib/otp";

/** Step 3 (first login only): create the account with the student's name. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = readSignupTicket(body?.ticket);
  if (!email) {
    return NextResponse.json(
      { error: "सत्र समाप्त — फिर से लॉग इन करें। / Session expired — please log in again.", reason: "ticket" },
      { status: 400 }
    );
  }

  const name = typeof body?.full_name === "string" ? body.full_name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "अपना पूरा नाम दर्ज करें / Enter your full name" }, { status: 400 });
  }

  try {
    // Double-submit or two tabs: the account may already exist — just log in.
    let userId = await findUserIdByEmail(email);
    if (!userId) {
      const { data, error } = await supabaseAdmin()
        .from("users")
        .insert({ email, full_name: name, password_hash: null, role: "student" })
        .select("id")
        .single();
      if (error || !data) {
        // Lost an insert race to a parallel request — use that row.
        userId = await findUserIdByEmail(email);
        if (!userId) throw new Error(error?.message ?? "insert returned no row");
      } else {
        userId = data.id as string;
      }
    }

    const { token, expiresAt } = await createSession(userId!, request.headers.get("user-agent"));
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
    return response;
  } catch (err) {
    console.error("[otp/complete] failed:", err);
    return NextResponse.json({ error: "खाता नहीं बन सका — फिर कोशिश करें। / Could not create your account. Please try again." }, { status: 500 });
  }
}

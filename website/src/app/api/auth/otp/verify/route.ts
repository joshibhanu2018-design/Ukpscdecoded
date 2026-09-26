import { NextRequest, NextResponse } from "next/server";
import { createSession, sessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { consumeCode, createSignupTicket, findUserIdByEmail, normalizeEmail, verifyCode } from "@/lib/otp";

const MESSAGES = {
  no_code: "No active code — request a new one.",
  expired: "Code expired — request a new one.",
  too_many_attempts: "Too many wrong attempts — request a new code.",
  wrong: "Incorrect code",
} as const;

/**
 * Step 2: check the code. Existing account → logged in. New email → the
 * code is consumed and a short-lived signup ticket is returned; the
 * client asks for a name and finishes at /api/auth/otp/complete.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  const code = typeof body?.code === "string" ? body.code.replace(/\s/g, "") : "";
  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

  try {
    const result = await verifyCode(email, code);
    if (!result.ok) {
      const suffix =
        result.reason === "wrong" && result.attemptsLeft
          ? ` (${result.attemptsLeft} attempts left)`
          : "";
      return NextResponse.json({ error: MESSAGES[result.reason] + suffix, reason: result.reason }, { status: 400 });
    }

    if (!(await consumeCode(result.codeId))) {
      // A parallel request with the same code won the race.
      return NextResponse.json({ error: MESSAGES.no_code, reason: "no_code" }, { status: 400 });
    }

    const userId = await findUserIdByEmail(email);
    if (!userId) {
      return NextResponse.json({ needs_name: true, ticket: createSignupTicket(email) });
    }

    const { token, expiresAt } = await createSession(userId, request.headers.get("user-agent"));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
    return response;
  } catch (err) {
    console.error("[otp/verify] failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

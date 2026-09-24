import { NextRequest, NextResponse } from "next/server";
import { sendLoginCodeEmail } from "@/lib/email";
import { checkRateLimits, EMAIL_RE, getClientIp, issueCode, normalizeEmail } from "@/lib/otp";

/**
 * Step 1: email a 6-digit code. Same response whether or not an account
 * exists (new emails get an account on first login), so this never
 * reveals who is registered.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "सही ईमेल दर्ज करें / Enter a valid email address" }, { status: 400 });
  }

  const ip = getClientIp(request.headers);

  try {
    const limit = await checkRateLimits(email, ip);
    if (!limit.ok) {
      return NextResponse.json(
        {
          error:
            limit.reason === "email"
              ? "बहुत सारे कोड भेजे गए — 15 मिनट बाद फिर कोशिश करें। / Too many codes sent — try again in 15 minutes."
              : "बहुत सारे अनुरोध — कुछ देर बाद कोशिश करें। / Too many requests — please try again later.",
        },
        { status: 429 }
      );
    }

    const code = await issueCode(email, ip);
    const sent = await sendLoginCodeEmail(email, code);
    if (!sent) {
      return NextResponse.json(
        { error: "ईमेल नहीं भेजा जा सका — फिर कोशिश करें। / Could not send the email. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[otp/request] failed:", err);
    return NextResponse.json({ error: "कुछ गलत हुआ — फिर कोशिश करें। / Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { sendLoginCodeEmail } from "@/lib/email";
import { checkRateLimits, EMAIL_RE, getClientIp, issueCode, normalizeEmail, reviewerCodeFor, whatsappIdentity } from "@/lib/otp";
import { cleanPhone, PHONE_ERROR, PHONE_RE } from "@/lib/phone";
import { sendWhatsAppLoginCode, whatsappLoginEnabled } from "@/lib/whatsapp";

/**
 * Step 1: send a 6-digit code, by email, or on WhatsApp when the body has
 * `phone` instead of `email` (only while WhatsApp login is switched on). Same response whether or not an account
 * exists (new emails get an account on first login), so this never
 * reveals who is registered.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (typeof body?.phone === "string") return requestByWhatsApp(request, body.phone);
  const email = normalizeEmail(body?.email);
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const ip = getClientIp(request.headers);

  try {
    const limit = await checkRateLimits(email, ip);
    if (!limit.ok) {
      return NextResponse.json(
        {
          error:
            limit.reason === "email"
              ? "Too many codes sent — try again in 15 minutes."
              : "Too many requests — please try again later.",
        },
        { status: 429 }
      );
    }

    // The Play Store reviewer can't read an inbox: their fixed code is stored and no email is sent.
    const reviewerCode = reviewerCodeFor(email);
    const code = await issueCode(email, ip, reviewerCode ?? undefined);
    const sent = reviewerCode ? true : await sendLoginCodeEmail(email, code);
    if (!sent) {
      return NextResponse.json(
        { error: "Could not send the email. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[otp/request] failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function requestByWhatsApp(request: NextRequest, rawPhone: string) {
  if (!whatsappLoginEnabled()) {
    return NextResponse.json({ error: "WhatsApp login is not available right now. Please use your email." }, { status: 400 });
  }
  const phone = cleanPhone(rawPhone);
  if (!PHONE_RE.test(phone)) return NextResponse.json({ error: PHONE_ERROR }, { status: 400 });

  const identity = whatsappIdentity(phone);
  const ip = getClientIp(request.headers);
  try {
    const limit = await checkRateLimits(identity, ip);
    if (!limit.ok) {
      return NextResponse.json(
        { error: limit.reason === "email" ? "Too many codes sent — try again in 15 minutes." : "Too many requests — please try again later." },
        { status: 429 }
      );
    }
    const code = await issueCode(identity, ip);
    if (!(await sendWhatsAppLoginCode(phone, code))) {
      return NextResponse.json(
        { error: "Could not send the code on WhatsApp. Please try again, or log in with your email." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[otp/request] whatsapp failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

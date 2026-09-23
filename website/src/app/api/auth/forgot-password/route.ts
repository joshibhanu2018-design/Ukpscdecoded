import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPasswordResetEmail } from "@/lib/email";
import { countRecentResetRequests, createPasswordResetToken, RATE_LIMIT_MAX } from "@/lib/password-reset";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Always the same message — an unknown email, a rate-limited email and a
// successfully-sent email must be indistinguishable to the client.
const GENERIC_MESSAGE = "If this email is registered, you will receive a reset link.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email)) {
    // Still generic — even an invalid-looking email gets the same response.
    return NextResponse.json({ message: GENERIC_MESSAGE });
  }

  try {
    const db = supabaseAdmin();
    const { data: user, error } = await db.from("users").select("id").eq("email", email).maybeSingle();

    if (error) {
      console.error("[forgot-password] Could not look up user:", error);
      return NextResponse.json({ message: GENERIC_MESSAGE });
    }

    if (user) {
      const recentCount = await countRecentResetRequests(user.id);
      if (recentCount >= RATE_LIMIT_MAX) {
        console.error(`[forgot-password] Rate limit hit for user ${user.id} (${recentCount} in the last hour)`);
      } else {
        const rawToken = await createPasswordResetToken(user.id);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ukpscdecoded.in";
        const resetUrl = `${baseUrl}/student/reset-password?token=${rawToken}`;
        await sendPasswordResetEmail(email, resetUrl);
      }
    }
  } catch (err) {
    console.error("[forgot-password] Unexpected error:", err);
  }

  return NextResponse.json({ message: GENERIC_MESSAGE });
}

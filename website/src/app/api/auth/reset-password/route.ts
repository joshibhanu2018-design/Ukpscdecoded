import { NextRequest, NextResponse } from "next/server";
import { hashPassword, updatePassword } from "@/lib/auth-utils";
import { consumePasswordResetToken } from "@/lib/password-reset";

const INVALID_TOKEN_MESSAGE = "This reset link is invalid or has expired.";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token) {
    return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const consumed = await consumePasswordResetToken(token);
  if (!consumed) {
    return NextResponse.json({ error: INVALID_TOKEN_MESSAGE }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(password);
    // Single write: sets the new password_hash and bumps
    // password_changed_at, which invalidates every session issued before
    // now — i.e. logs the user out everywhere.
    await updatePassword(consumed.user_id, passwordHash);
  } catch (err) {
    console.error("[reset-password] Could not update password:", err);
    return NextResponse.json({ error: "Could not reset password. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

// Revokes this device's session row (frees a slot under the device limit), then clears the cookie.
export async function POST() {
  try {
    await revokeSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  } catch (err) {
    console.error("[logout] could not revoke session:", err);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}

import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth-utils";

// Sessions are stateless signed cookies (see lib/auth-utils.ts) — there's no
// server-side row to delete, so logout just clears the cookie.
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}

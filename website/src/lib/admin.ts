import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserFromSession, SESSION_COOKIE_NAME, type User } from "./auth-utils";

/**
 * Admins are users with role = 'admin'. They log in with the same email
 * code as students (so each admin has their own login, device limit and
 * logout), replacing the old shared ADMIN_IMPORT_SECRET.
 */
export async function getAdminUser(): Promise<User | null> {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  return user?.role === "admin" ? user : null;
}

/** For API routes: the admin, or a ready-made 401/403 response to return. */
export async function requireAdmin(): Promise<{ admin: User } | { response: NextResponse }> {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) return { response: NextResponse.json({ error: "Not logged in" }, { status: 401 }) };
  if (user.role !== "admin") return { response: NextResponse.json({ error: "Admins only" }, { status: 403 }) };
  return { admin: user };
}

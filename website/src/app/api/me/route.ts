import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, getUserActiveEnrollments } from "@/lib/packages";
import { SESSION_HINT_COOKIE, sessionHintOptions } from "@/lib/session-hint";

export const dynamic = "force-dynamic";

/**
 * Who is this browser? The public pages are cached and identical for
 * everyone, so the menu and the product cards ask this once per visit:
 * logged in or not, and which products the student already owns.
 * It also keeps the readable login flag in step with the real session.
 */
export async function GET() {
  const jar = await cookies();
  const user = await getUserFromSession(jar.get(SESSION_COOKIE_NAME)?.value).catch(() => null);

  let owned: string[] = [];
  if (user) {
    try {
      const [enrollments, includes, packages] = await Promise.all([
        getUserActiveEnrollments(user.id),
        getPackageIncludes(),
        getActivePackages(),
      ]);
      owned = [...getOwnedPackageIds(enrollments, includes, packages)];
    } catch (err) {
      console.error("[me] could not load owned packages:", err);
    }
  }

  const res = NextResponse.json({ loggedIn: !!user, owned }, { headers: { "Cache-Control": "private, no-store" } });
  if (user) {
    // Same lifetime as a fresh login; the real cookie decides access anyway.
    res.cookies.set(SESSION_HINT_COOKIE, "1", sessionHintOptions(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)));
  } else if (jar.get(SESSION_HINT_COOKIE)) {
    res.cookies.set(SESSION_HINT_COOKIE, "", { path: "/", maxAge: 0 });
  }
  return res;
}

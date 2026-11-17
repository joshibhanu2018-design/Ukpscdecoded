/**
 * A readable "this browser is logged in" flag next to the real (httpOnly)
 * session cookie. It carries no identity and grants nothing: it only lets
 * the public pages, which are served from cache with no server call, show
 * "My Courses" instead of "Login". Set at login, cleared at logout, and
 * corrected by /api/me.
 */
export const SESSION_HINT_COOKIE = "ukd_in";

export function sessionHintOptions(expiresAt: Date) {
  return { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", expires: expiresAt };
}

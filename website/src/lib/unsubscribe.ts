import { createHmac, timingSafeEqual } from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ukpscdecoded.in";

function sign(userId: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  return createHmac("sha256", secret).update(`unsubscribe:${userId}`).digest("base64url");
}

/** Link that turns off offer emails for this student, without logging in. */
export function unsubscribeUrl(userId: string): string {
  return `${BASE_URL}/api/unsubscribe?u=${encodeURIComponent(userId)}&t=${sign(userId)}`;
}

export function verifyUnsubscribe(userId: string, token: string): boolean {
  const a = Buffer.from(token);
  const b = Buffer.from(sign(userId));
  return a.length === b.length && timingSafeEqual(a, b);
}

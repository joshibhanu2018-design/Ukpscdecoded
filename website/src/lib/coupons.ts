import { randomInt } from "crypto";
import { supabaseAdmin } from "./supabase";

const RESERVATION_MS = 30 * 60 * 1000;
// Unambiguous characters only — no 0/O, 1/I/L.
const CODE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateCouponCode(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += CODE_CHARS[randomInt(CODE_CHARS.length)];
  return `UKD-${suffix}`;
}

export type CouponLookup = {
  id: string;
  code: string;
  type: "single_use_percent" | "multi_use_price_lock";
  percent_off: number | null;
  price_lock_until: string | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
};

export type CodeCheckResult = { ok: true; coupon: CouponLookup } | { ok: false; error: string };

/**
 * Looks up a coupon and checks it's currently usable: not expired, and
 * under its usage cap counting both permanent used_count AND any other
 * order's still-active (unexpired) reservation — so a coupon can't be
 * oversold to concurrent pending orders during the 30-minute reservation
 * window, without needing a cleanup job (an expired reservation simply
 * stops counting from that moment on).
 */
export async function checkCoupon(code: string): Promise<CodeCheckResult | null> {
  const db = supabaseAdmin();
  const { data: coupon, error } = await db
    .from("coupons")
    .select("id, code, type, percent_off, price_lock_until, max_uses, used_count, expires_at")
    .eq("code", code.toUpperCase().trim())
    .maybeSingle();

  if (error || !coupon) return null;

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "This code has expired." };
  }

  const cap = coupon.max_uses ?? (coupon.type === "single_use_percent" ? 1 : null);
  if (cap != null) {
    const { count } = await db
      .from("coupon_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("coupon_id", coupon.id)
      .eq("status", "reserved")
      .gte("reserved_until", new Date().toISOString());

    if (coupon.used_count + (count ?? 0) >= cap) {
      return { ok: false, error: "This code has reached its usage limit." };
    }
  }

  return { ok: true, coupon };
}

/** Percent-off discount in paise for a single_use_percent coupon. */
export function computePercentDiscount(coupon: CouponLookup, basePaise: number): number {
  if (coupon.type !== "single_use_percent" || coupon.percent_off == null) return 0;
  return Math.round(basePaise * (Number(coupon.percent_off) / 100));
}

export async function reserveCoupon(
  coupon: CouponLookup,
  orderId: string,
  userId: string,
  discountAmountPaise: number
): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("coupon_redemptions").insert({
    coupon_id: coupon.id,
    order_id: orderId,
    user_id: userId,
    status: "reserved",
    discount_amount: discountAmountPaise,
    reserved_until: new Date(Date.now() + RESERVATION_MS).toISOString(),
  });
  if (error) throw new Error(`Could not reserve coupon: ${error.message}`);
}

/** Marks the order's coupon redemption consumed and bumps used_count. No-op if no coupon was applied to this order. */
export async function consumeCouponForOrder(orderId: string): Promise<void> {
  const db = supabaseAdmin();
  const { data: redemption } = await db
    .from("coupon_redemptions")
    .select("id, coupon_id, status")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!redemption || redemption.status !== "reserved") return;

  const { data: consumed } = await db
    .from("coupon_redemptions")
    .update({ status: "consumed", consumed_at: new Date().toISOString() })
    .eq("id", redemption.id)
    .eq("status", "reserved")
    .select("id")
    .maybeSingle();

  if (!consumed) return; // already consumed (shouldn't happen given order_id is unique, defensive)

  const { data: coupon } = await db.from("coupons").select("used_count").eq("id", redemption.coupon_id).maybeSingle();
  if (coupon) {
    await db.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("id", redemption.coupon_id);
  }
}

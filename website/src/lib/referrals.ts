import { randomInt } from "crypto";
import { supabaseAdmin } from "./supabase";

const RESERVATION_MS = 30 * 60 * 1000;
export const REFEREE_DISCOUNT_PAISE = 20000; // ₹200
export const REFERRER_CREDIT_PAISE = 20000; // ₹200

function slugifyName(name: string): string {
  const clean = name.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return clean.slice(0, 6) || "USER";
}

/** Generates and stores a referral code for a user's first paid enrollment, if they don't already have one. Idempotent. */
export async function ensureReferralCode(userId: string, fullName: string): Promise<string> {
  const db = supabaseAdmin();
  const { data: existing } = await db.from("users").select("referral_code").eq("id", userId).maybeSingle();
  if (existing?.referral_code) return existing.referral_code;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `REF-${slugifyName(fullName)}${randomInt(1000, 9999)}`;

    const { data: updated, error } = await db
      .from("users")
      .update({ referral_code: code })
      .eq("id", userId)
      .is("referral_code", null)
      .select("referral_code")
      .maybeSingle();

    if (updated?.referral_code) return updated.referral_code;
    if (error && error.code !== "23505") throw new Error(`Could not create referral code: ${error.message}`);

    // Either a unique-code collision (retry with a new suffix) or the
    // column was already set concurrently — check which before retrying.
    const { data: nowSet } = await db.from("users").select("referral_code").eq("id", userId).maybeSingle();
    if (nowSet?.referral_code) return nowSet.referral_code;
  }

  throw new Error("Could not generate a unique referral code after several attempts");
}

export type ReferrerInfo = { referrerUserId: string; referrerEmail: string | null; referrerPhone: string | null };

export async function findReferrer(code: string): Promise<ReferrerInfo | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("users")
    .select("id, email, phone")
    .eq("referral_code", code.toUpperCase().trim())
    .maybeSingle();

  if (!data) return null;
  return { referrerUserId: data.id, referrerEmail: data.email, referrerPhone: data.phone };
}

export function isSelfReferral(
  referrer: ReferrerInfo,
  refereeUserId: string,
  refereeEmail: string,
  refereePhone: string | null
): boolean {
  if (referrer.referrerUserId === refereeUserId) return true;
  if (referrer.referrerEmail && referrer.referrerEmail.toLowerCase() === refereeEmail.toLowerCase()) return true;
  if (referrer.referrerPhone && refereePhone && referrer.referrerPhone === refereePhone) return true;
  return false;
}

export async function reserveReferral(referrerUserId: string, refereeUserId: string, orderId: string): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("referral_redemptions").insert({
    referrer_user_id: referrerUserId,
    referee_user_id: refereeUserId,
    order_id: orderId,
    referee_discount_amount: REFEREE_DISCOUNT_PAISE,
    referrer_credit_amount: REFERRER_CREDIT_PAISE,
    status: "reserved",
    reserved_until: new Date(Date.now() + RESERVATION_MS).toISOString(),
  });
  if (error) throw new Error(`Could not reserve referral: ${error.message}`);
}

/** Marks the order's referral consumed and credits the referrer. No-op if no referral was applied to this order. */
export async function consumeReferralForOrder(orderId: string): Promise<void> {
  const db = supabaseAdmin();
  const { data: redemption } = await db
    .from("referral_redemptions")
    .select("id, referrer_user_id, referrer_credit_amount, status")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!redemption || redemption.status !== "reserved") return;

  const { data: consumed } = await db
    .from("referral_redemptions")
    .update({ status: "consumed", credited_at: new Date().toISOString() })
    .eq("id", redemption.id)
    .eq("status", "reserved")
    .select("id")
    .maybeSingle();

  if (!consumed) return;

  const { data: referrer } = await db
    .from("users")
    .select("store_credit_paise")
    .eq("id", redemption.referrer_user_id)
    .maybeSingle();

  if (referrer) {
    await db
      .from("users")
      .update({ store_credit_paise: referrer.store_credit_paise + redemption.referrer_credit_amount })
      .eq("id", redemption.referrer_user_id);
  }
}

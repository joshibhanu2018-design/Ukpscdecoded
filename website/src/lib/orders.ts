import { supabaseAdmin } from "./supabase";
import { sendReceiptEmail } from "./email";
import {
  getActivePackages,
  getOwnedPackageIds,
  getPackageIncludes,
  getUserActiveEnrollments,
} from "./packages";
import { consumeCouponForOrder } from "./coupons";
import { consumeReferralForOrder, ensureReferralCode } from "./referrals";

export async function isPackageOwned(userId: string, packageId: string): Promise<boolean> {
  const [allPackages, includes, enrollments] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(userId),
  ]);
  return getOwnedPackageIds(enrollments, includes, allPackages).has(packageId);
}

function computeAccessValidTill(pkg: { access_valid_till: string | null; validity_days: number | null }): string {
  if (pkg.access_valid_till) {
    // Fixed calendar-date expiry (a `date` column) — see supabase/schema-phase2b.sql.
    return new Date(`${pkg.access_valid_till}T23:59:59Z`).toISOString();
  }
  const days = pkg.validity_days ?? 365;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

/** Deducts credit_applied from the buyer's store credit, guarded so it can never go negative. Not recomputed — the amount was fixed at order-creation time. */
async function deductStoreCredit(userId: string, amountPaise: number): Promise<void> {
  if (amountPaise <= 0) return;

  const db = supabaseAdmin();
  const { data: buyer } = await db.from("users").select("store_credit_paise").eq("id", userId).maybeSingle();
  if (!buyer || buyer.store_credit_paise < amountPaise) {
    console.error(
      `[orders] deductStoreCredit: user ${userId} balance ${buyer?.store_credit_paise ?? 0} < ${amountPaise} — skipping deduction (likely a concurrent order also spent it)`
    );
    return;
  }

  await db
    .from("users")
    .update({ store_credit_paise: buyer.store_credit_paise - amountPaise })
    .eq("id", userId)
    .eq("store_credit_paise", buyer.store_credit_paise); // guard against a concurrent change since the read above
}

/**
 * Marks a payment_orders row paid and creates the enrollment, exactly
 * once, no matter how many times or from how many places (the verify
 * endpoint, the webhook, a retry of either) this is called for the same
 * razorpay_order_id. The UPDATE ... WHERE status = 'created' is the
 * guard: only the caller that actually flips the row wins the race and
 * creates the enrollment + sends the receipt; everyone else sees it
 * already 'paid' and does nothing further.
 */
export async function completeOrder(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<{ ok: boolean; alreadyProcessed: boolean }> {
  const db = supabaseAdmin();

  const { data: order, error } = await db
    .from("payment_orders")
    .select("id, user_id, package_id, status, amount, original_amount, discount_amount, credit_applied")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (error || !order) {
    console.error("[orders] completeOrder: order not found for", razorpayOrderId, error);
    return { ok: false, alreadyProcessed: false };
  }

  if (order.status === "paid") {
    return { ok: true, alreadyProcessed: true };
  }

  const { data: won, error: updateError } = await db
    .from("payment_orders")
    .update({ status: "paid", razorpay_payment_id: razorpayPaymentId, updated_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "created")
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("[orders] completeOrder: could not update order status:", updateError);
    return { ok: false, alreadyProcessed: false };
  }
  if (!won) {
    // Lost the race — the webhook and the verify call both fired for the
    // same order and the other one got there first. Already handled.
    return { ok: true, alreadyProcessed: true };
  }

  const [{ data: pkg }, { data: user }] = await Promise.all([
    db
      .from("packages")
      .select("package_name, package_type, access_valid_till, validity_days")
      .eq("id", order.package_id)
      .maybeSingle(),
    db.from("users").select("email, full_name").eq("id", order.user_id).maybeSingle(),
  ]);

  if (!pkg) {
    console.error("[orders] completeOrder: package not found for order", order.id);
    return { ok: false, alreadyProcessed: false };
  }

  const { error: enrollError } = await db.from("enrollments").insert({
    user_id: order.user_id,
    package_id: order.package_id,
    payment_id: razorpayPaymentId,
    payment_status: "completed",
    status: "active",
    product_type: pkg.package_type,
    access_valid_till: computeAccessValidTill(pkg),
  });

  if (enrollError) {
    console.error("[orders] completeOrder: could not create enrollment:", enrollError);
    // The order is already marked paid and won't be retried automatically
    // by either caller (both treat 'paid' as done) — this needs a human
    // to reconcile. Logged loudly on purpose.
    return { ok: false, alreadyProcessed: false };
  }

  // Consume any coupon/referral reservation on this order, deduct any
  // store credit that was baked into the charged amount, and give the
  // buyer their own referral code now that they have a paid enrollment.
  // None of these block the purchase itself if they fail — logged, not
  // thrown, since the enrollment above already succeeded.
  try {
    await Promise.all([
      consumeCouponForOrder(order.id),
      consumeReferralForOrder(order.id),
      deductStoreCredit(order.user_id, order.credit_applied ?? 0),
      user?.full_name ? ensureReferralCode(order.user_id, user.full_name) : Promise.resolve(),
    ]);
  } catch (err) {
    console.error("[orders] completeOrder: post-purchase bookkeeping failed:", err);
  }

  if (user?.email) {
    await sendReceiptEmail(user.email, {
      packageName: pkg.package_name,
      amountPaise: order.amount,
      originalAmountPaise: order.original_amount ?? order.amount,
      discountAmountPaise: order.discount_amount ?? 0,
      paymentId: razorpayPaymentId,
    });
  }

  return { ok: true, alreadyProcessed: false };
}

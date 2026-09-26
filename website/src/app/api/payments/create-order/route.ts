import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { getPublicKeyId, getRazorpayClient } from "@/lib/razorpay";
import { isPackageOwned } from "@/lib/orders";
import { getSeatsRemaining } from "@/lib/packages";
import { computeOrderTotal, getPriceInfo } from "@/lib/pricing";
import { checkCoupon, computePercentDiscount, reserveCoupon, type CouponLookup } from "@/lib/coupons";
import { findReferrer, isSelfReferral, reserveReferral, type ReferrerInfo } from "@/lib/referrals";


export async function POST(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to purchase" }, { status: 401 });
  }

  // Kill switch: sales are off unless explicitly turned on. Checked here
  // (server-side, after auth) rather than only hiding the button, so
  // nobody can buy by calling this endpoint directly while the store is
  // in test mode on production.
  if (process.env.PAYMENTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Sales are not open yet." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const packageId = typeof body?.package_id === "string" ? body.package_id : "";
  const rawCode = typeof body?.code === "string" ? body.code.trim() : "";
  if (!packageId) {
    return NextResponse.json({ error: "package_id is required" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Price is read from the database here — never trust a price the
  // browser sends.
  const { data: pkg, error } = await db
    .from("packages")
    .select(
      "id, package_name, price, is_active, package_type, seats_total, founding_price, regular_price, founding_ends_at"
    )
    .eq("id", packageId)
    .maybeSingle();

  if (error || !pkg || !pkg.is_active) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  if (await isPackageOwned(user.id, packageId)) {
    return NextResponse.json({ error: "You already own this package" }, { status: 409 });
  }

  if (pkg.seats_total != null) {
    const remaining = await getSeatsRemaining(pkg.id, pkg.seats_total);
    if (remaining <= 0) {
      return NextResponse.json({ error: "All seats for this package are full." }, { status: 409 });
    }
  }

  // ===== Resolve an applied code: coupon first, then referral. One code
  // slot per order — whichever type it matches is what applies. =====
  let couponMatch: CouponLookup | undefined;
  let referrer: ReferrerInfo | null = null;

  if (rawCode) {
    const couponResult = await checkCoupon(rawCode);
    if (couponResult) {
      if (!couponResult.ok) {
        return NextResponse.json({ error: couponResult.error }, { status: 400 });
      }
      couponMatch = couponResult.coupon;
    } else {
      const found = await findReferrer(rawCode);
      if (!found) {
        return NextResponse.json({ error: "Invalid code." }, { status: 400 });
      }
      if (isSelfReferral(found, user.id, user.email, user.phone)) {
        return NextResponse.json({ error: "You can't use your own referral code." }, { status: 400 });
      }
      referrer = found;
    }
  }

  // A multi_use_price_lock coupon extends founding-price eligibility for
  // this one order, even past the package's own founding_ends_at.
  const priceLockOverride = couponMatch?.type === "multi_use_price_lock" ? couponMatch.price_lock_until : null;
  const priceInfo = getPriceInfo(pkg, Date.now(), priceLockOverride);
  const basePaise = Math.round(priceInfo.amount * 100);

  let codeDiscountPaise = 0;
  if (couponMatch?.type === "single_use_percent") {
    codeDiscountPaise = computePercentDiscount(couponMatch, basePaise);
  } else if (referrer) {
    codeDiscountPaise = 20000; // ₹200, see REFEREE_DISCOUNT_PAISE in lib/referrals.ts
  }

  const { data: freshUser } = await db.from("users").select("store_credit_paise").eq("id", user.id).maybeSingle();
  const availableCredit = freshUser?.store_credit_paise ?? 0;
  const { creditAppliedPaise: creditApplied, finalPaise } = computeOrderTotal(basePaise, codeDiscountPaise, availableCredit);
  const discountPaise = basePaise - finalPaise;

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpayClient().orders.create({
      amount: finalPaise,
      currency: "INR",
      receipt: `pkg_${pkg.id.slice(0, 8)}_${Date.now()}`,
      payment_capture: true,
      notes: { user_id: user.id, package_id: pkg.id, package_name: pkg.package_name },
    });
  } catch (err) {
    console.error("[create-order] Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }

  const { data: order, error: insertError } = await db
    .from("payment_orders")
    .insert({
      user_id: user.id,
      package_id: pkg.id,
      razorpay_order_id: razorpayOrder.id,
      amount: finalPaise,
      original_amount: basePaise,
      discount_amount: discountPaise,
      credit_applied: creditApplied,
      currency: "INR",
      status: "created",
    })
    .select("id")
    .maybeSingle();

  if (insertError || !order) {
    console.error("[create-order] Could not store pending order:", insertError);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }

  try {
    if (couponMatch) {
      await reserveCoupon(couponMatch, order.id, user.id, codeDiscountPaise);
    } else if (referrer) {
      await reserveReferral(referrer.referrerUserId, user.id, order.id);
    }
  } catch (err) {
    console.error("[create-order] Could not reserve code:", err);
    return NextResponse.json({ error: "Could not apply that code. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    order_id: razorpayOrder.id,
    amount: finalPaise,
    currency: "INR",
    key_id: getPublicKeyId(),
    package_name: pkg.package_name,
    original_amount: basePaise,
    discount_amount: discountPaise,
  });
}

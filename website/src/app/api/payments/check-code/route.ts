import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { getPriceInfo } from "@/lib/pricing";
import { checkCoupon, computePercentDiscount } from "@/lib/coupons";
import { findReferrer, isSelfReferral } from "@/lib/referrals";

// Read-only preview for the "Apply" button on the store — validates the
// code and shows the discount it would give, but does NOT reserve it.
// Reservation only happens at actual order creation (/create-order),
// since that's the point a real checkout attempt is in flight.
export async function POST(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const packageId = typeof body?.package_id === "string" ? body.package_id : "";
  const rawCode = typeof body?.code === "string" ? body.code.trim() : "";
  if (!packageId || !rawCode) {
    return NextResponse.json({ error: "package_id and code are required" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: pkg } = await db
    .from("packages")
    .select("price, founding_price, regular_price, founding_ends_at")
    .eq("id", packageId)
    .maybeSingle();

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const couponResult = await checkCoupon(rawCode);
  if (couponResult) {
    if (!couponResult.ok) {
      return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }
    const coupon = couponResult.coupon;
    const priceLockOverride = coupon.type === "multi_use_price_lock" ? coupon.price_lock_until : null;
    const basePaise = Math.round(getPriceInfo(pkg, Date.now(), priceLockOverride).amount * 100);
    const discountPaise = coupon.type === "single_use_percent" ? computePercentDiscount(coupon, basePaise) : 0;

    return NextResponse.json({
      valid: true,
      type: coupon.type,
      discountAmount: discountPaise,
      message:
        coupon.type === "multi_use_price_lock"
          ? "Founding price applied"
          : `${coupon.percent_off}% off applied`,
    });
  }

  const referrer = await findReferrer(rawCode);
  if (referrer) {
    if (isSelfReferral(referrer, user.id, user.email, user.phone)) {
      return NextResponse.json({ error: "You can't use your own referral code." }, { status: 400 });
    }
    return NextResponse.json({
      valid: true,
      type: "referral",
      discountAmount: 20000,
      message: "₹200 off applied",
    });
  }

  return NextResponse.json({ error: "Invalid code." }, { status: 400 });
}

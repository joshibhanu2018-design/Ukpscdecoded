import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { getPublicKeyId, getRazorpayClient } from "@/lib/razorpay";
import { isPackageOwned } from "@/lib/orders";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to purchase" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const packageId = typeof body?.package_id === "string" ? body.package_id : "";
  if (!packageId) {
    return NextResponse.json({ error: "package_id is required" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Price is read from the database here — never trust a price the
  // browser sends.
  const { data: pkg, error } = await db
    .from("packages")
    .select("id, package_name, price, is_active")
    .eq("id", packageId)
    .maybeSingle();

  if (error || !pkg || !pkg.is_active) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  if (await isPackageOwned(user.id, packageId)) {
    return NextResponse.json({ error: "You already own this package" }, { status: 409 });
  }

  const amountPaise = Math.round(Number(pkg.price) * 100);

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpayClient().orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `pkg_${pkg.id.slice(0, 8)}_${Date.now()}`,
      payment_capture: true,
      notes: { user_id: user.id, package_id: pkg.id, package_name: pkg.package_name },
    });
  } catch (err) {
    console.error("[create-order] Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }

  const { error: insertError } = await db.from("payment_orders").insert({
    user_id: user.id,
    package_id: pkg.id,
    razorpay_order_id: razorpayOrder.id,
    amount: amountPaise,
    currency: "INR",
    status: "created",
  });

  if (insertError) {
    console.error("[create-order] Could not store pending order:", insertError);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    order_id: razorpayOrder.id,
    amount: amountPaise,
    currency: "INR",
    key_id: getPublicKeyId(),
    package_name: pkg.package_name,
  });
}

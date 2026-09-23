import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { completeOrder } from "@/lib/orders";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const razorpay_order_id = typeof body?.razorpay_order_id === "string" ? body.razorpay_order_id : "";
  const razorpay_payment_id = typeof body?.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const razorpay_signature = typeof body?.razorpay_signature === "string" ? body.razorpay_signature : "";

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  let signatureValid: boolean;
  try {
    signatureValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  } catch (err) {
    console.error("[verify] Signature check misconfigured:", err);
    return NextResponse.json({ error: "Payment verification is not configured" }, { status: 500 });
  }

  if (!signatureValid) {
    console.error(`[verify] Invalid signature for order ${razorpay_order_id}`);
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: order } = await db
    .from("payment_orders")
    .select("user_id")
    .eq("razorpay_order_id", razorpay_order_id)
    .maybeSingle();

  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const result = await completeOrder(razorpay_order_id, razorpay_payment_id);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Payment verified but activation failed. Contact support with your payment ID." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { completeOrder } from "@/lib/orders";

// Backup path so enrollment still happens if the student closes the
// browser right after paying, before the client-side verify call fires.
// Configure this URL in the Razorpay dashboard (test mode) with the
// payment.captured event, and set RAZORPAY_WEBHOOK_SECRET to the secret
// shown there. Razorpay can't reach localhost — this only works once
// deployed.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  let valid: boolean;
  try {
    valid = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error("[webhook] Signature check misconfigured:", err);
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  if (!valid) {
    console.error("[webhook] Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id && payment?.id) {
      await completeOrder(payment.order_id, payment.id);
    } else {
      console.error("[webhook] payment.captured event missing order_id/payment id");
    }
  }

  return NextResponse.json({ ok: true });
}

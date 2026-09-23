import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";

function getKeys(): { key_id: string; key_secret: string } {
  const key_id = process.env.RAZORPAY_TEST_KEY_ID;
  const key_secret = process.env.RAZORPAY_TEST_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error(
      "RAZORPAY_TEST_KEY_ID / RAZORPAY_TEST_KEY_SECRET is not set. Add them to .env.local."
    );
  }
  return { key_id, key_secret };
}

let client: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!client) {
    const { key_id, key_secret } = getKeys();
    client = new Razorpay({ key_id, key_secret });
  }
  return client;
}

/** The publishable key ID the client-side checkout widget needs — not secret. */
export function getPublicKeyId(): string {
  return getKeys().key_id;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Standard Razorpay checkout signature: HMAC-SHA256(order_id|payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const { key_secret } = getKeys();
  const expected = createHmac("sha256", key_secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

/** Webhook signature uses a separate secret (configured in the Razorpay dashboard webhook setup), over the raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is not set. Add it to .env.local.");
  }
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}

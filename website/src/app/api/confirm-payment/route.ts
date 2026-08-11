// src/app/api/confirm-payment/route.ts
// Receives UTR + screenshot from the order-confirmation page and forwards
// it to the same Apps Script sheet endpoint used by submit-order, tagged
// with orderId so the Apps Script can update the matching row.

const ORDERS_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzh_9ESmles7ee25kh2aqeyLD1qTztGO3a4TXlP5CB2i2m6Bf7vZ5oxApGcNj8BFyqeOg/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      name,
      email,
      phone,
      amount,
      utr,
      screenshotBase64,
      screenshotFileName,
    } = body;

    if (!orderId || !utr || !screenshotBase64) {
      return Response.json(
        { error: "Missing required confirmation fields" },
        { status: 400 }
      );
    }

    // Forward to the same Apps Script endpoint, with an "action" flag so
    // the script can tell this apart from a fresh order submission and
    // update the matching row instead of adding a new one.
    const sheetResponse = await fetch(ORDERS_SHEET_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirmPayment",
        orderId,
        name,
        email,
        phone,
        amount,
        utr,
        screenshotBase64,
        screenshotFileName,
        status: "Awaiting Verification",
        confirmedAt: new Date().toISOString(),
      }),
    });

    // Apps Script web apps sometimes redirect; treat any 2xx/3xx as success
    if (sheetResponse.status >= 400) {
      const text = await sheetResponse.text();
      console.error("Sheet confirm error:", text);
      return Response.json(
        { error: "Failed to save confirmation to sheet" },
        { status: 502 }
      );
    }

    return Response.json({ success: true, orderId });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return Response.json(
      { error: "Failed to process payment confirmation" },
      { status: 500 }
    );
  }
}

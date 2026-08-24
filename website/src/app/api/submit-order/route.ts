import { UPI_ID, AMOUNT, BUSINESS_NAME } from "@/lib/payment";

const ORDERS_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzh_9ESmles7ee25kh2aqeyLD1qTztGO3a4TXlP5CB2i2m6Bf7vZ5oxApGcNj8BFyqeOg/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, pincode, state, bookLanguage, orderId } = body;

    if (!name || !email || !phone || !address || !city || !state || !bookLanguage) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      await fetch(ORDERS_SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, address, city, pincode, state, bookLanguage, language: bookLanguage,
          amount: AMOUNT, orderId: orderId || `UK${Date.now()}`, submittedAt: new Date().toISOString(),
        }),
      });
    } catch (sheetError) {
      console.error("Sheet logging error:", sheetError);
    }

    return Response.json({
      success: true, orderId: orderId || `UK${Date.now()}`, message: "Order created. Proceed to payment.",
      customerName: name, customerEmail: email, customerPhone: phone, bookLanguage, amount: AMOUNT,
    });
  } catch (error) {
    console.error("Order submission error:", error);
    return Response.json({ error: "Failed to process order" }, { status: 500 });
  }
}

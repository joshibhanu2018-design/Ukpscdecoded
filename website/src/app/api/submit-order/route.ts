// src/app/api/submit-order/route.ts

const ORDERS_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbwnBAHXLstCM31s_HE7X7SmqX8JWdv6dzN0DblKA7Ngag80S9cs7CPj40OzdxkBDd75eA/exec";
const UPI_ID = "bhanujoshi1910-1@oksbi";
const AMOUNT = 499;
const BUSINESS_NAME = "UKPSC Decoded";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, pincode, state } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !pincode || !state) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log order to Google Sheet
    try {
      await fetch(ORDERS_SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          city,
          pincode,
          state,
          amount: AMOUNT,
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (sheetError) {
      console.error("Sheet logging error:", sheetError);
    }

    // Generate UPI payment link
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Book Purchase - ${name}`)}`;

    // Return order confirmation details + UPI link
    return Response.json({
      success: true,
      orderId: `ORDER-${Date.now()}`,
      message: "Order created. Please proceed to payment.",
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      amount: AMOUNT,
      upiLink: upiLink,
      whatsappMessage: `Order Details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}, ${city} - ${pincode}, ${state}\nAmount: ₹${AMOUNT}\n\nPlease send payment screenshot to confirm.`,
    });
  } catch (error) {
    console.error("Order submission error:", error);
    return Response.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
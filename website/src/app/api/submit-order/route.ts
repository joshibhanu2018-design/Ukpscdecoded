// src/app/api/submit-order/route.ts

const ORDERS_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyS2M34dKi6V5TmZv6Z2PKEdQHC0RoQmcGdMGNRjlCS1Rc2Tk6VeLWPvMI3iFEkz3q3-Q/exec";
const UPI_ID = "bhanujoshi1910-1@oksbi";
const AMOUNT = 499;
const BUSINESS_NAME = "UKPSC Decoded";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, pincode, state, orderId } = body;

    if (!name || !email || !phone || !address || !city || !state || !orderId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      await fetch(ORDERS_SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          name,
          email,
          phone,
          address,
          city,
          pincode,
          state,
          amount: AMOUNT,
          status: "Pending Payment",
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (sheetError) {
      console.error("Sheet logging error:", sheetError);
    }

    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Book Purchase - ${name}`)}`;

    return Response.json({
      success: true,
      orderId,
      message: "Order created. Please proceed to payment.",
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      amount: AMOUNT,
      upiLink: upiLink,
    });
  } catch (error) {
    console.error("Order submission error:", error);
    return Response.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
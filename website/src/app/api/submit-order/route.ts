// src/app/api/submit-order/route.ts

const ORDERS_SHEET_ENDPOINT = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";
// Replace YOUR_SCRIPT_ID_HERE with your Google Apps Script Web App URL from Step 1.3

const UPI_ID = "bhanujoshi1910-1@oksbi";
const AMOUNT = 499;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, pincode, state } = body;
    
    // Validate
    if (!name || !email || !phone || !address || !city || !pincode || !state) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Log to Google Sheet
    try {
      await fetch(ORDERS_SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, address, city, pincode, state,
          amount: AMOUNT,
          submittedAt: new Date().toISOString()
        })
      });
    } catch (sheetError) {
      console.error("Sheet logging error:", sheetError);
    }
    
    // Generate UPI link
    const upiLink = `upi://pay?pa=${UPI_ID}&pn=UKPSC%20Decoded&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(`Book Purchase - ${name}`)}`;
    
    return Response.json({
      success: true,
      orderId: `ORDER-${Date.now()}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      amount: AMOUNT,
      upiLink: upiLink,
      whatsappMessage: `Order Confirmed!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}, ${city} - ${pincode}, ${state}\nAmount: ₹${AMOUNT}\n\nPlease send payment screenshot to confirm.`
    });
    
  } catch (error) {
    console.error("Order submission error:", error);
    return Response.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

// src/app/api/course-inquiry/route.ts

const COURSE_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbzQQWxWnMLfx5VMOxmTvShK4Mg9lZGfOMQRSVV6s31BmKTJ2VqLB9w5vzB98e9ibAPY/exec";
// Replace YOUR_SCRIPT_ID_HERE with Web App URL from Step 2

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, courseInterested, message } = body;
    
    if (!name || !email || !phone || !courseInterested) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Log to Google Sheet
    try {
      await fetch(COURSE_SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseInterested,
          message,
          source: 'website-courses',
          submittedAt: new Date().toISOString()
        })
      });
    } catch (sheetError) {
      console.error("Sheet logging error:", sheetError);
    }
    
    return Response.json({
      success: true,
      inquiryId: `INQUIRY-${Date.now()}`,
      message: "Thank you! We'll contact you soon.",
      name,
      email
    });
    
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return Response.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

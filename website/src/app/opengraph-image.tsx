import { ImageResponse } from "next/og";

// Share image for WhatsApp / Telegram / social links and search previews
// (the old /og-image.png never existed). Child pages inherit it.
export const alt = "UKPSC Decoded — Test Series, Crash Course & Mentorship for Uttarakhand Exams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0f0f0e 0%, #1c1b19 60%, #3a2a0c 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, color: "#fbbf24", letterSpacing: 4, fontWeight: 700 }}>UKPSC DECODED</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
          Crack UKPSC 2026 with the method that works
        </div>
        <div style={{ fontSize: 34, color: "#d6d3d1", marginTop: 32 }}>
          Test Series · Crash Course · Mentorship · Uttarakhand GK
        </div>
        <div style={{ fontSize: 30, color: "#fbbf24", marginTop: 48 }}>www.ukpscdecoded.in</div>
      </div>
    ),
    size,
  );
}

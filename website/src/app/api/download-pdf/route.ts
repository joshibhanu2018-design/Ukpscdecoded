import { NextRequest, NextResponse } from "next/server";
import { readDownloadToken, signedEbookUrl } from "@/lib/ebooks";

/**
 * GET /api/download-pdf?token=… — the link a buyer gets after paying.
 * Checks the signed token, then redirects to a short-lived Supabase URL,
 * so the PDF never passes through (or is cached by) this function.
 */
export async function GET(request: NextRequest) {
  const grant = readDownloadToken(request.nextUrl.searchParams.get("token"));
  if (!grant) {
    return NextResponse.json(
      { error: "This download link is invalid or has expired. Contact support with your Payment ID." },
      { status: 403 },
    );
  }

  const url = await signedEbookUrl(grant.pdfId);
  if (!url) {
    return NextResponse.json(
      { error: "Download is temporarily unavailable. Please try again or contact support with your Payment ID." },
      { status: 503 },
    );
  }

  return NextResponse.redirect(url, { status: 302, headers: { "Cache-Control": "no-store" } });
}

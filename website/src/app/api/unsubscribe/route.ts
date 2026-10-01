import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyUnsubscribe } from "@/lib/unsubscribe";

async function optOut(request: NextRequest): Promise<boolean> {
  const u = request.nextUrl.searchParams.get("u") ?? "";
  const t = request.nextUrl.searchParams.get("t") ?? "";
  if (!u || !t || !verifyUnsubscribe(u, t)) return false;
  const { error } = await supabaseAdmin().from("users").update({ marketing_opt_out: true }).eq("id", u);
  if (error) console.error("[unsubscribe] update failed:", error);
  return !error;
}

function page(ok: boolean): NextResponse {
  const text = ok
    ? "You will not get offer emails from UKPSC Decoded any more. Login codes and payment receipts will still arrive.<br/>अब आपको ऑफ़र ईमेल नहीं भेजे जाएंगे।"
    : "This unsubscribe link is not valid. Email ukpscdecoded@gmail.com and we will remove you.";
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head>` +
      `<body style="font-family:Arial,sans-serif;max-width:480px;margin:48px auto;padding:0 16px;color:#1a1a1f;line-height:1.6">` +
      `<h2>${ok ? "Unsubscribed" : "Link not valid"}</h2><p>${text}</p><p><a href="/" style="color:#b45309">www.ukpscdecoded.in</a></p></body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: NextRequest) {
  return page(await optOut(request));
}

// One-click unsubscribe from the Gmail / Outlook button (List-Unsubscribe-Post).
export async function POST(request: NextRequest) {
  const ok = await optOut(request);
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}

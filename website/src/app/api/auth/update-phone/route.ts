import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";

const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number" }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("users").update({ phone }).eq("id", user.id);
  if (error) {
    console.error("[update-phone] Could not update phone:", error);
    return NextResponse.json({ error: "Could not save phone number. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

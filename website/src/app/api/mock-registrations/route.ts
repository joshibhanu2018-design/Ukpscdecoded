import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getClientIp, normalizeEmail } from "@/lib/otp";
import { cleanPhone, PHONE_ERROR, PHONE_RE } from "@/lib/phone";
import { UK_DISTRICTS } from "@/lib/districts";

const MAX_PER_IP = 10;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_IP;
}

/** Saves a free-mock popup registration (name, mobile, email, district). */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.full_name === "string" ? body.full_name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 100) return NextResponse.json({ error: "Enter your full name" }, { status: 400 });
  const phone = cleanPhone(body?.phone);
  if (!PHONE_RE.test(phone)) return NextResponse.json({ error: PHONE_ERROR }, { status: 400 });
  const email = normalizeEmail(body?.email);
  if (!email) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  const district = typeof body?.district === "string" ? body.district.trim() : "";
  if (!UK_DISTRICTS.includes(district)) return NextResponse.json({ error: "Choose your district" }, { status: 400 });
  const page = typeof body?.page === "string" ? body.page.slice(0, 200) : null;

  if (tooMany(getClientIp(request.headers))) {
    return NextResponse.json({ error: "Too many sign-ups from this network. Try again later." }, { status: 429 });
  }

  const { error } = await supabaseAdmin()
    .from("mock_registrations")
    .insert({ full_name: name, phone, email, district, source: "popup", page });
  if (error) {
    console.error("[mock-registrations] insert failed:", error.message);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

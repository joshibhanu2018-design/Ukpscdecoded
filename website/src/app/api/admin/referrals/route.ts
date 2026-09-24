import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_IMPORT_SECRET;
  if (!secret) return false;
  return request.headers.get("x-admin-secret") === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("referral_redemptions")
    .select(
      "id, order_id, status, referee_discount_amount, referrer_credit_amount, credited_at, created_at, referrer:referrer_user_id(email, full_name), referee:referee_user_id(email, full_name)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/referrals] GET failed:", error);
    return NextResponse.json({ error: "Could not load referrals" }, { status: 500 });
  }

  return NextResponse.json({ referrals: data ?? [] });
}

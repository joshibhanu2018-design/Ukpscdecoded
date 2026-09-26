import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

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

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateCouponCode } from "@/lib/coupons";
import { toCsv } from "@/lib/csv";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_IMPORT_SECRET;
  if (!secret) return false;
  return request.headers.get("x-admin-secret") === secret;
}

type CouponRow = {
  id: string;
  code: string;
  type: string;
  percent_off: number | null;
  price_lock_until: string | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
};

async function buildCouponsView() {
  const db = supabaseAdmin();

  const { data: coupons, error } = await db
    .from("coupons")
    .select("id, code, type, percent_off, price_lock_until, max_uses, used_count, expires_at, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load coupons: ${error.message}`);

  const { data: redemptions } = await db
    .from("coupon_redemptions")
    .select("coupon_id, status, reserved_until, order_id, user_id, users(email)")
    .order("created_at", { ascending: false });

  const redemptionsByCoupon = new Map<string, typeof redemptions>();
  for (const r of redemptions ?? []) {
    const list = redemptionsByCoupon.get(r.coupon_id) ?? [];
    list.push(r);
    redemptionsByCoupon.set(r.coupon_id, list);
  }

  const now = Date.now();

  return (coupons ?? []).map((c: CouponRow) => {
    const rs = redemptionsByCoupon.get(c.id) ?? [];
    const activeReservation = rs.find((r) => r?.status === "reserved" && new Date(r.reserved_until).getTime() > now);
    const consumed = rs.filter((r) => r?.status === "consumed");

    let status: string;
    if (c.expires_at && new Date(c.expires_at).getTime() < now) status = "expired";
    else if (c.type === "single_use_percent") {
      status = consumed.length > 0 ? "used" : activeReservation ? "reserved" : "unused";
    } else {
      status = "active";
    }

    const lastUse = consumed[0] as { order_id?: string; users?: { email?: string } | null } | undefined;

    return {
      code: c.code,
      type: c.type,
      percent_off: c.percent_off,
      price_lock_until: c.price_lock_until,
      max_uses: c.max_uses,
      used_count: c.used_count,
      expires_at: c.expires_at,
      created_at: c.created_at,
      status,
      used_by_email: lastUse?.users?.email ?? "",
      used_on_order: lastUse?.order_id ?? "",
    };
  });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let view;
  try {
    view = await buildCouponsView();
  } catch (err) {
    console.error("[admin/coupons] GET failed:", err);
    return NextResponse.json({ error: "Could not load coupons" }, { status: 500 });
  }

  if (request.nextUrl.searchParams.get("format") === "csv") {
    const csv = toCsv(view);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="coupons-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ coupons: view });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const mode = body?.mode === "price_lock" ? "price_lock" : "generate";
  const db = supabaseAdmin();

  if (mode === "price_lock") {
    const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
    const priceLockUntil = typeof body?.price_lock_until === "string" ? body.price_lock_until : null;
    const maxUses = typeof body?.max_uses === "number" ? body.max_uses : null;
    const expiresAt = typeof body?.expires_at === "string" ? body.expires_at : null;

    if (!code || !priceLockUntil) {
      return NextResponse.json({ error: "code and price_lock_until are required" }, { status: 400 });
    }

    const { error } = await db.from("coupons").insert({
      code,
      type: "multi_use_price_lock",
      price_lock_until: priceLockUntil,
      max_uses: maxUses,
      expires_at: expiresAt,
    });

    if (error) {
      const message = error.code === "23505" ? "That code already exists." : `Could not create code: ${error.message}`;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, code });
  }

  // mode === "generate": N single-use 10%-off codes
  const count = typeof body?.count === "number" ? Math.min(500, Math.max(1, Math.round(body.count))) : 0;
  const percentOff = typeof body?.percent_off === "number" ? body.percent_off : 10;
  const expiresAt = typeof body?.expires_at === "string" && body.expires_at ? body.expires_at : null;

  if (count < 1) {
    return NextResponse.json({ error: "count must be at least 1" }, { status: 400 });
  }

  const codes: string[] = [];
  const rows = [];
  for (let i = 0; i < count; i++) {
    const code = generateCouponCode();
    codes.push(code);
    rows.push({
      code,
      type: "single_use_percent",
      percent_off: percentOff,
      max_uses: 1,
      expires_at: expiresAt,
    });
  }

  const { error } = await db.from("coupons").insert(rows);
  if (error) {
    console.error("[admin/coupons] Bulk generate failed:", error);
    return NextResponse.json({ error: `Could not generate codes: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, codes });
}

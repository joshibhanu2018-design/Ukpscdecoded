import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { getActiveOffer, type ActiveOffer } from "@/lib/coupons";
import { sendOfferBatch } from "@/lib/email";
import { unsubscribeUrl } from "@/lib/unsubscribe";

const SQL_HINT = "Run supabase/schema-phase24-offer-emails.sql in the Supabase SQL Editor first.";

type Student = { id: string; email: string; full_name: string | null; marketing_opt_out: boolean };

/** Students who can still be emailed about this offer: not unsubscribed and not emailed about it yet. */
async function audience(offer: ActiveOffer) {
  const db = supabaseAdmin();
  const students: Student[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("users")
      .select("id, email, full_name, marketing_opt_out")
      .eq("role", "student")
      .order("created_at")
      .range(from, from + 999);
    if (error) throw new Error(SQL_HINT);
    students.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const sentIds = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from("offer_emails").select("user_id").eq("coupon_id", offer.id).range(from, from + 999);
    if (error) throw new Error(SQL_HINT);
    for (const r of data ?? []) sentIds.add(r.user_id);
    if (!data || data.length < 1000) break;
  }
  const optedOut = students.filter((s) => s.marketing_opt_out).length;
  const remaining = students.filter((s) => !s.marketing_opt_out && !sentIds.has(s.id));
  return { total: students.length, optedOut, sent: sentIds.size, remaining };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const offer = await getActiveOffer();
  if (!offer) return NextResponse.json({ offer: null });
  try {
    const a = await audience(offer);
    return NextResponse.json({ offer, total: a.total, optedOut: a.optedOut, sent: a.sent, remaining: a.remaining.length });
  } catch (err) {
    return NextResponse.json({ offer, error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const offer = await getActiveOffer();
  if (!offer) return NextResponse.json({ error: "No running offer. Create a universal offer code first." }, { status: 400 });
  const details = { code: offer.code, percentOff: offer.percent_off, expiresAt: offer.expires_at };

  const body = await request.json().catch(() => null);

  if (body?.action === "test") {
    const me = auth.admin;
    const { sent, error } = await sendOfferBatch(details, [
      { to: me.email, name: me.full_name ?? "", unsubscribeUrl: unsubscribeUrl(me.id) },
    ]);
    if (error || sent.length === 0) return NextResponse.json({ error: error || "Not sent." }, { status: 500 });
    return NextResponse.json({ ok: true, sentTo: me.email });
  }

  const limit = typeof body?.limit === "number" ? Math.min(100, Math.max(1, Math.round(body.limit))) : 80;
  let remaining: Student[];
  try {
    remaining = (await audience(offer)).remaining;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
  const batch = remaining.slice(0, limit);
  if (batch.length === 0) return NextResponse.json({ ok: true, sent: 0, left: 0 });

  const { sent, error } = await sendOfferBatch(
    details,
    batch.map((s) => ({ to: s.email, name: s.full_name ?? "", unsubscribeUrl: unsubscribeUrl(s.id) }))
  );
  if (error) return NextResponse.json({ error: `Email service: ${error}` }, { status: 502 });

  const sentSet = new Set(sent);
  const rows = batch.filter((s) => sentSet.has(s.email)).map((s) => ({ coupon_id: offer.id, user_id: s.id }));
  const { error: logError } = await supabaseAdmin().from("offer_emails").upsert(rows, { onConflict: "coupon_id,user_id", ignoreDuplicates: true });
  if (logError) console.error("[admin/offer-email] Could not record sends:", logError);

  return NextResponse.json({ ok: true, sent: rows.length, left: remaining.length - rows.length });
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { toCsv } from "@/lib/csv";
import { sendBackupEmail } from "@/lib/email";

const BACKUP_RECIPIENT = "bhanujoshi1910@gmail.com";

// Vercel Cron (see vercel.json) hits this once a day. Vercel automatically
// sends `Authorization: Bearer $CRON_SECRET` on cron-triggered requests
// when CRON_SECRET is set as an env var — that's what's checked below, so
// this can't be triggered by an outside request. Razorpay/Resend-style
// "fail closed": if CRON_SECRET isn't configured, every request is
// rejected rather than left open.
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();

  const [usersRes, enrollmentsRes, paymentsRes] = await Promise.all([
    // Deliberately never selects password_hash.
    db
      .from("users")
      .select("id, full_name, email, phone, role, created_at, password_changed_at")
      .order("created_at"),
    db
      .from("enrollments")
      .select(
        "id, user_id, package_id, purchase_date, payment_id, payment_status, status, access_valid_till, product_type, created_at"
      )
      .order("created_at"),
    db
      .from("payment_orders")
      .select(
        "id, user_id, package_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, created_at"
      )
      .order("created_at"),
  ]);

  if (usersRes.error || enrollmentsRes.error || paymentsRes.error) {
    console.error("[cron/daily-backup] Query failed:", {
      users: usersRes.error,
      enrollments: enrollmentsRes.error,
      payments: paymentsRes.error,
    });
    return NextResponse.json({ error: "Backup query failed" }, { status: 500 });
  }

  const users = usersRes.data ?? [];
  const enrollments = enrollmentsRes.data ?? [];
  const payments = paymentsRes.data ?? [];

  const dateLabel = new Date().toISOString().slice(0, 10);

  const sent = await sendBackupEmail(BACKUP_RECIPIENT, {
    dateLabel,
    counts: { users: users.length, enrollments: enrollments.length, payment_orders: payments.length },
    attachments: [
      { filename: `users-${dateLabel}.csv`, csv: toCsv(users) },
      { filename: `enrollments-${dateLabel}.csv`, csv: toCsv(enrollments) },
      { filename: `payment_orders-${dateLabel}.csv`, csv: toCsv(payments) },
    ],
  });

  if (!sent) {
    return NextResponse.json({ error: "Backup email failed to send" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    counts: { users: users.length, enrollments: enrollments.length, payment_orders: payments.length },
  });
}

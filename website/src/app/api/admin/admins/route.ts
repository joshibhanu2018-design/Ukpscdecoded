import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { findUserIdByEmail, normalizeEmail } from "@/lib/otp";

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { data, error } = await supabaseAdmin()
    .from("users")
    .select("id, full_name, email")
    .eq("role", "admin")
    .order("email");
  if (error) return NextResponse.json({ error: "Could not load admins" }, { status: 500 });
  return NextResponse.json({ admins: data ?? [], me: auth.admin.id });
}

/** { email, action: "add" | "remove" }. The person must have logged in once (account exists). */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  const action = body?.action === "remove" ? "remove" : body?.action === "add" ? "add" : null;
  if (!email || !action) return NextResponse.json({ error: "email and action are required" }, { status: 400 });

  const db = supabaseAdmin();
  const userId = await findUserIdByEmail(email);
  if (!userId) {
    return NextResponse.json(
      { error: "No account with this email. Ask them to log in on the site once, then add them." },
      { status: 404 }
    );
  }
  if (action === "remove" && userId === auth.admin.id) {
    return NextResponse.json({ error: "You can't remove yourself — ask another admin." }, { status: 400 });
  }

  const { error } = await db
    .from("users")
    .update({ role: action === "add" ? "admin" : "student" })
    .eq("id", userId);
  if (error) return NextResponse.json({ error: "Could not update role" }, { status: 500 });

  await db.from("audit_logs").insert({
    user_id: auth.admin.id,
    action: action === "add" ? "admin_added" : "admin_removed",
    resource_type: "user",
    resource_id: userId,
    details: { email },
  });

  return NextResponse.json({ ok: true });
}

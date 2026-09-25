import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Close the open reports on one question:
 *  - resolve:    the question is fine (or was fixed by hand) — reports closed.
 *  - deactivate: questions.status = 'inactive'. New attempts leave it out;
 *                attempts started before now keep it (see getTestQuestions).
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const questionId = typeof body?.question_id === "string" ? body.question_id : "";
  const action = body?.action === "resolve" || body?.action === "deactivate" ? body.action : null;
  if (!questionId || !action) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const db = supabaseAdmin();
  const now = new Date().toISOString();

  if (action === "deactivate") {
    const { data, error } = await db
      .from("questions")
      .update({ status: "inactive", deactivated_at: now, updated_at: now })
      .eq("id", questionId)
      .or("status.is.null,status.neq.inactive") // keep the first deactivation time if clicked twice
      .select("id");
    if (error) return NextResponse.json({ error: "Could not deactivate the question" }, { status: 500 });
    if (!data?.length) {
      const { data: q } = await db.from("questions").select("id").eq("id", questionId).maybeSingle();
      if (!q) return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
  }

  const { error } = await db
    .from("question_reports")
    .update({ status: action === "resolve" ? "resolved" : "deactivated", resolved_by: auth.admin.id, resolved_at: now })
    .eq("question_id", questionId)
    .eq("status", "open");
  if (error) return NextResponse.json({ error: "Could not close the reports" }, { status: 500 });

  await db.from("audit_logs").insert({
    user_id: auth.admin.id,
    action: action === "resolve" ? "question_reports_resolved" : "question_deactivated",
    resource_type: "question",
    resource_id: questionId,
    details: {},
  });

  return NextResponse.json({ ok: true });
}

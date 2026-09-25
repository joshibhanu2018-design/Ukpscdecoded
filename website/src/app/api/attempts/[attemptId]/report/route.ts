import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { getAttempt, getAttemptTest } from "@/lib/tests";
import { REPORT_REASONS, type ReportReason } from "@/lib/question-reports";

const MAX_REPORTS_PER_DAY = 30;

/**
 * "Report error / गलती बताएँ" on a question in the answer review. Only on
 * your own submitted attempts; one open report per student per question
 * (reporting again updates it).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId, user.id);
  if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  if (attempt.status !== "submitted") return NextResponse.json({ error: "Submit the test first" }, { status: 409 });

  const test = await getAttemptTest(attempt);
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const questionId = typeof body?.question_id === "string" ? body.question_id : "";
  const reason = (REPORT_REASONS as readonly string[]).includes(body?.reason) ? (body.reason as ReportReason) : null;
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 1000) || null : null;
  if (!test.question_ids.includes(questionId) || !reason) {
    return NextResponse.json({ error: "Invalid question or reason" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: existing, error: readError } = await db
    .from("question_reports")
    .select("id")
    .eq("user_id", user.id)
    .eq("question_id", questionId)
    .eq("status", "open")
    .maybeSingle();
  if (readError) return NextResponse.json({ error: "Could not save" }, { status: 500 });

  if (existing) {
    const { error } = await db.from("question_reports").update({ reason, note, attempt_id: attempt.id }).eq("id", existing.id);
    if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await db
    .from("question_reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_REPORTS_PER_DAY) {
    return NextResponse.json({ error: "Too many reports today — try again tomorrow." }, { status: 429 });
  }

  const { error } = await db
    .from("question_reports")
    .insert({ question_id: questionId, user_id: user.id, attempt_id: attempt.id, reason, note });
  // 23505: a parallel click already opened the same report — that's fine.
  if (error && error.code !== "23505") return NextResponse.json({ error: "Could not save" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { getAttempt, getTest, isPastGrace, sanitizeAnswers, sanitizeConfidence, sanitizeMarked } from "@/lib/tests";

/**
 * Autosave: the test page calls this every time an answer or review mark
 * changes, so a closed tab / dead battery loses at most the last click.
 * Refuses once the time limit (+ grace) has passed — answers can't be
 * changed after the clock runs out.
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId, user.id);
  if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  if (attempt.status !== "in_progress") {
    return NextResponse.json({ error: "This test is already submitted" }, { status: 409 });
  }

  const test = await getTest(attempt.test_id);
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });
  if (isPastGrace(attempt, test)) {
    return NextResponse.json({ error: "Time is up" }, { status: 409 });
  }

  const body = await request.json().catch(() => null);
  const answers = sanitizeAnswers(body?.answers, test.question_ids);
  const marked = sanitizeMarked(body?.marked, test.question_ids);
  const confidence = sanitizeConfidence(body?.confidence, test.question_ids);

  const { error } = await supabaseAdmin()
    .from("attempts")
    .update({ answers, marked_for_review: marked, confidence, updated_at: new Date().toISOString() })
    .eq("id", attempt.id)
    .eq("status", "in_progress");

  if (error) {
    console.error("[attempts/answers] save failed:", error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { finalizeAttempt, getAttempt, getTest, sanitizeAnswers, sanitizeConfidence, sanitizeMarked } from "@/lib/tests";

export async function POST(request: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId, user.id);
  if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });

  const test = await getTest(attempt.test_id);
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  const body = await request.json().catch(() => null);

  try {
    // Already-submitted is a success, not an error: a double-click or the
    // timer auto-submitting alongside a manual submit should both land on
    // the result page.
    await finalizeAttempt(attempt, test, {
      answers: sanitizeAnswers(body?.answers, test.question_ids),
      marked: sanitizeMarked(body?.marked, test.question_ids),
      confidence: sanitizeConfidence(body?.confidence, test.question_ids),
    });
    return NextResponse.json({ ok: true, attempt_id: attempt.id });
  } catch (err) {
    console.error("[attempts/submit] failed:", err);
    return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
  }
}

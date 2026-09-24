import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { ERROR_TYPES, getAttempt, getTest, sanitizeErrorTags, type ErrorType } from "@/lib/tests";

/** Tag (or un-tag, with tag: null) why one question went wrong. Only on your own submitted attempts. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ attemptId: string }> }) {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId, user.id);
  if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  if (attempt.status !== "submitted") return NextResponse.json({ error: "Submit the test first" }, { status: 409 });

  const test = await getTest(attempt.test_id);
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const questionId = typeof body?.question_id === "string" ? body.question_id : "";
  const tag = body?.tag === null ? null : (ERROR_TYPES as readonly string[]).includes(body?.tag) ? (body.tag as ErrorType) : undefined;
  if (!test.question_ids.includes(questionId) || tag === undefined) {
    return NextResponse.json({ error: "Invalid question or tag" }, { status: 400 });
  }

  const tags = sanitizeErrorTags(attempt.error_tags, test.question_ids);
  if (tag) tags[questionId] = tag;
  else delete tags[questionId];

  const { error } = await supabaseAdmin().from("attempts").update({ error_tags: tags }).eq("id", attempt.id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

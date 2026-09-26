import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { toCsv } from "@/lib/csv";
import { supabaseAdmin } from "@/lib/supabase";
import { filtersFrom, getQuestionsByIds, getTestUsage, matchQuestions } from "@/lib/question-bank";

/**
 * GET  — CSV of every question matching the Question Bank filters (same query
 *        string as the page), so the owner can mark which ones to prefer.
 * POST — { question_id, action: "deactivate" | "reactivate" }. Deactivating
 *        leaves the question out of attempts started from now on (see
 *        getTestQuestions); the loader swaps it out of tests on its next run.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const filters = filtersFrom(Object.fromEntries(request.nextUrl.searchParams));
  try {
    const { tests, testsOf } = await getTestUsage();
    const ids = await matchQuestions(filters, testsOf, tests);
    const questions = await getQuestionsByIds(ids);
    const rows = questions.map((q) => ({
      question_id: q.question_id,
      section: q.section_code ?? "",
      chapter: q.subtopic ?? "",
      chapter_name: q.topic ?? "",
      difficulty: q.difficulty ?? "",
      format: q.question_format ?? "",
      source_file: q.source_file ?? "",
      status: q.status ?? "",
      tests: (testsOf.get(q.id) ?? []).join("; "),
      answer: q.correct_answer,
      question_english: q.question_text_english,
      question_hindi: q.question_text_hindi,
    }));
    // BOM so Excel opens the Hindi text correctly.
    return new NextResponse("﻿" + toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="question-bank-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("[admin/question-bank] export failed:", err);
    return NextResponse.json({ error: "Could not export the questions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const questionId = typeof body?.question_id === "string" ? body.question_id : "";
  const action = body?.action === "deactivate" || body?.action === "reactivate" ? body.action : null;
  if (!questionId || !action) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const db = supabaseAdmin();
  const now = new Date().toISOString();
  const { data, error } =
    action === "deactivate"
      ? await db
          .from("questions")
          .update({ status: "inactive", deactivated_at: now, updated_at: now })
          .eq("id", questionId)
          .or("status.is.null,status.neq.inactive") // keep the first deactivation time if clicked twice
          .select("id")
      : await db.from("questions").update({ status: "active", deactivated_at: null, updated_at: now }).eq("id", questionId).select("id");
  if (error) return NextResponse.json({ error: `Could not ${action} the question` }, { status: 500 });
  if (!data?.length) {
    const { data: q } = await db.from("questions").select("id").eq("id", questionId).maybeSingle();
    if (!q) return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  await db.from("audit_logs").insert({
    user_id: auth.admin.id,
    action: action === "deactivate" ? "question_deactivated" : "question_reactivated",
    resource_type: "question",
    resource_id: questionId,
    details: { via: "question_bank" },
  });

  return NextResponse.json({ ok: true });
}

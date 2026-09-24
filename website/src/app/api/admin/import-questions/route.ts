import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

type IncomingQuestion = {
  questionId?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  year?: string | number;
  questionHindi?: string;
  questionEnglish?: string;
  optionAHindi?: string;
  optionAEnglish?: string;
  optionBHindi?: string;
  optionBEnglish?: string;
  optionCHindi?: string;
  optionCEnglish?: string;
  optionDHindi?: string;
  optionDEnglish?: string;
  correctAnswer?: string;
  explanationHindi?: string;
  explanationEnglish?: string;
};

const VALID_ANSWERS = new Set(["A", "B", "C", "D"]);

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const rows: IncomingQuestion[] = Array.isArray(body?.questions) ? body.questions : [];

  if (rows.length === 0) {
    return NextResponse.json({ error: "No questions provided" }, { status: 400 });
  }

  const valid: Record<string, unknown>[] = [];
  const rejected: { row: number; reason: string }[] = [];

  rows.forEach((row, index) => {
    const question_id = row.questionId?.toString().trim();
    const subject = row.subject?.toString().trim();
    const question_text_hindi = row.questionHindi?.toString().trim();
    const question_text_english = row.questionEnglish?.toString().trim();
    const correct_answer = row.correctAnswer?.toString().trim().toUpperCase();

    if (!question_id || !subject || !question_text_hindi || !question_text_english) {
      rejected.push({
        row: index + 1,
        reason: "Missing questionId, subject, questionHindi or questionEnglish",
      });
      return;
    }
    if (!correct_answer || !VALID_ANSWERS.has(correct_answer)) {
      rejected.push({ row: index + 1, reason: "correctAnswer must be A, B, C or D" });
      return;
    }

    const year = row.year !== undefined && row.year !== "" ? Number(row.year) : null;
    if (row.year !== undefined && row.year !== "" && Number.isNaN(year)) {
      rejected.push({ row: index + 1, reason: "year must be a number" });
      return;
    }

    valid.push({
      question_id,
      subject,
      topic: row.topic?.toString().trim() || null,
      subtopic: row.subtopic?.toString().trim() || null,
      difficulty: row.difficulty?.toString().trim() || null,
      year,
      question_text_hindi,
      question_text_english,
      option_a_hindi: row.optionAHindi?.toString().trim() || null,
      option_a_english: row.optionAEnglish?.toString().trim() || null,
      option_b_hindi: row.optionBHindi?.toString().trim() || null,
      option_b_english: row.optionBEnglish?.toString().trim() || null,
      option_c_hindi: row.optionCHindi?.toString().trim() || null,
      option_c_english: row.optionCEnglish?.toString().trim() || null,
      option_d_hindi: row.optionDHindi?.toString().trim() || null,
      option_d_english: row.optionDEnglish?.toString().trim() || null,
      correct_answer,
      explanation_hindi: row.explanationHindi?.toString().trim() || null,
      explanation_english: row.explanationEnglish?.toString().trim() || null,
    });
  });

  if (valid.length === 0) {
    return NextResponse.json({ imported: 0, rejected }, { status: 400 });
  }

  let db;
  try {
    db = supabaseAdmin();
  } catch (err) {
    console.error("[import-questions] Supabase admin client error:", err);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { error, count } = await db.from("questions").insert(valid, { count: "exact" });

  if (error) {
    console.error("[import-questions] insert failed:", error);
    const body: Record<string, unknown> = { error: "Insert failed" };
    if (process.env.NODE_ENV !== "production") body.details = error.message;
    return NextResponse.json(body, { status: 500 });
  }

  return NextResponse.json({ imported: count ?? valid.length, rejected }, { status: 201 });
}

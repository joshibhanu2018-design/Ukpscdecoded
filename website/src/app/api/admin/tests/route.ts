import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

/** Packages (for the "add to package" picker) and existing tests. */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const db = supabaseAdmin();
  const [{ data: packages, error: pErr }, { data: tests, error: tErr }] = await Promise.all([
    db.from("packages").select("id, package_name, package_type").eq("is_active", true).order("sort_order"),
    db
      .from("tests")
      .select("id, test_name, total_questions, duration_minutes, is_free_test, release_at, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (pErr || tErr) {
    console.error("[admin/tests] load failed:", pErr ?? tErr);
    return NextResponse.json({ error: "Could not load" }, { status: 500 });
  }

  return NextResponse.json({ packages: packages ?? [], tests: tests ?? [] });
}

/**
 * Creates a test from a list of the human-readable question IDs used in
 * the import sheet (questions.question_id, e.g. "UKGK-0012"), in the
 * order given, and attaches it to the chosen packages via package_tests.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const body = await request.json().catch(() => null);
  const testName = typeof body?.test_name === "string" ? body.test_name.trim() : "";
  const duration = Number(body?.duration_minutes);
  const marks = body?.marks_per_question === undefined ? 1 : Number(body.marks_per_question);
  const negative = body?.negative_marking_value === undefined ? 0.33 : Number(body.negative_marking_value);
  const isFree = body?.is_free_test === true;
  const packageIds: string[] = Array.isArray(body?.package_ids)
    ? body.package_ids.filter((id: unknown): id is string => typeof id === "string")
    : [];
  const questionCodes: string[] = Array.isArray(body?.question_codes)
    ? [...new Set<string>(body.question_codes.map((c: unknown) => String(c).trim()).filter(Boolean))]
    : [];

  let releaseAt: string | null = null;
  if (typeof body?.release_at === "string" && body.release_at.trim()) {
    const d = new Date(body.release_at);
    if (Number.isNaN(d.getTime())) return NextResponse.json({ error: "release_at is not a valid date" }, { status: 400 });
    releaseAt = d.toISOString();
  }

  if (!testName) return NextResponse.json({ error: "test_name is required" }, { status: 400 });
  if (!Number.isInteger(duration) || duration <= 0) {
    return NextResponse.json({ error: "duration_minutes must be a positive whole number" }, { status: 400 });
  }
  if (!(marks > 0)) return NextResponse.json({ error: "marks_per_question must be > 0" }, { status: 400 });
  if (!(negative >= 0 && negative <= 1)) {
    return NextResponse.json({ error: "negative_marking_value must be between 0 and 1" }, { status: 400 });
  }
  if (questionCodes.length === 0) return NextResponse.json({ error: "Add at least one question ID" }, { status: 400 });
  if (!isFree && packageIds.length === 0) {
    return NextResponse.json({ error: "Pick at least one package, or mark the test as free" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: found, error: qErr } = await db
    .from("questions")
    .select("id, question_id")
    .in("question_id", questionCodes);
  if (qErr) {
    console.error("[admin/tests] question lookup failed:", qErr);
    return NextResponse.json({ error: "Could not look up questions" }, { status: 500 });
  }

  const byCode = new Map<string, string[]>();
  for (const q of found ?? []) byCode.set(q.question_id, [...(byCode.get(q.question_id) ?? []), q.id]);

  const missing = questionCodes.filter((c) => !byCode.has(c));
  // The importer doesn't dedupe, so the same code can exist twice —
  // refuse rather than silently guess which copy is right.
  const duplicated = questionCodes.filter((c) => (byCode.get(c)?.length ?? 0) > 1);
  if (missing.length || duplicated.length) {
    return NextResponse.json(
      { error: "Some question IDs could not be used", missing, duplicated },
      { status: 400 }
    );
  }

  const questionIds = questionCodes.map((c) => byCode.get(c)![0]);

  const { data: test, error: tErr } = await db
    .from("tests")
    .insert({
      test_name: testName,
      package_id: packageIds[0] ?? null,
      test_type: isFree ? "free" : "mock",
      total_questions: questionIds.length,
      duration_minutes: duration,
      negative_marking_enabled: negative > 0,
      negative_marking_value: negative,
      marks_per_question: marks,
      is_free_test: isFree,
      question_ids: questionIds,
      release_at: releaseAt,
    })
    .select("id")
    .single();

  if (tErr || !test) {
    console.error("[admin/tests] insert failed:", tErr);
    return NextResponse.json({ error: "Could not create test" }, { status: 500 });
  }

  if (packageIds.length > 0) {
    const { data: existing } = await db.from("package_tests").select("package_id, test_order").in("package_id", packageIds);
    const maxOrder = new Map<string, number>();
    for (const r of existing ?? []) {
      maxOrder.set(r.package_id, Math.max(maxOrder.get(r.package_id) ?? 0, Number(r.test_order ?? 0)));
    }

    const { error: ptErr } = await db.from("package_tests").insert(
      packageIds.map((pid) => ({ package_id: pid, test_id: test.id, test_order: (maxOrder.get(pid) ?? 0) + 1 }))
    );
    if (ptErr) {
      console.error("[admin/tests] package_tests insert failed:", ptErr);
      return NextResponse.json(
        { error: "Test created but could not be attached to packages", test_id: test.id },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ test_id: test.id, total_questions: questionIds.length }, { status: 201 });
}

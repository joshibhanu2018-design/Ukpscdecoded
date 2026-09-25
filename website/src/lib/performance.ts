import { supabaseAdmin } from "./supabase";
import { ERROR_LABEL, errorBreakdown } from "./analysis";
import { ERROR_TYPES, sanitizeErrorTags, type ErrorType } from "./tests";

/** Expected cutoff out of the full paper's marks — editable from admin (app_settings). */
export type Cutoff = { cutoff: number; total: number };

export async function getCutoff(): Promise<Cutoff> {
  const { data } = await supabaseAdmin()
    .from("app_settings")
    .select("key, value")
    .in("key", ["expected_cutoff", "cutoff_total"]);
  const get = (k: string, d: number) => {
    const v = Number(data?.find((r) => r.key === k)?.value);
    return Number.isFinite(v) && v > 0 ? v : d;
  };
  return { cutoff: get("expected_cutoff", 110), total: get("cutoff_total", 150) };
}

/** A full-length mock (the only kind comparable to the real paper's cutoff). */
export function isFullMock(t: { subject?: string | null; total_questions?: number | null }): boolean {
  return (t.subject ?? "").toLowerCase() === "full mock" || (t.total_questions ?? 0) >= 150;
}

/** Score scaled to the real paper's total (a 150-mark mock scales 1:1). */
export function scaleToPaper(score: number, totalMarks: number, paperTotal: number): number {
  return totalMarks > 0 ? Math.round((score / totalMarks) * paperTotal * 10) / 10 : 0;
}

export const PROJECTION_MOCKS = 3; // projected score = average of the latest N full mocks

export type StudentSummary = {
  userId: string;
  testsTaken: number;
  avgPct: number | null;
  fullMocks: { testName: string; scaled: number; submittedAt: string }[];
  projected: number | null; // avg of the latest PROJECTION_MOCKS full mocks, on the paper's scale
  gap: number | null; // projected − cutoff (negative = below)
  trend: number | null; // latest full mock − first full mock
  lastTestAt: string | null;
  weakTopics: { name: string; pct: number }[];
  topError: ErrorType | null;
  negativeLostPerMock: number | null;
};

type Row = {
  id: string;
  test_id: string;
  score: number | null;
  total_marks: number | null;
  percentage: number | null;
  submitted_at: string;
  error_tags: unknown;
  question_ids: string[] | null;
};

/** Everything a mentor needs at a glance, from the student's FIRST attempts at each test. */
export async function getStudentSummary(userId: string, cutoff: Cutoff): Promise<StudentSummary> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("attempts")
    .select("id, test_id, score, total_marks, percentage, submitted_at, error_tags, question_ids")
    .eq("user_id", userId)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });

  const seen = new Set<string>();
  const firsts = ((data ?? []) as Row[]).filter((a) => (seen.has(a.test_id) ? false : (seen.add(a.test_id), true)));
  const empty: StudentSummary = {
    userId,
    testsTaken: 0,
    avgPct: null,
    fullMocks: [],
    projected: null,
    gap: null,
    trend: null,
    lastTestAt: null,
    weakTopics: [],
    topError: null,
    negativeLostPerMock: null,
  };
  if (firsts.length === 0) return empty;

  const [{ data: tests }, { data: results }] = await Promise.all([
    db
      .from("tests")
      .select("id, test_name, subject, total_questions, question_ids, marks_per_question, negative_marking_enabled, negative_marking_value")
      .in("id", [...seen]),
    db
      .from("results")
      .select("attempt_id, topic_accuracy, question_performance")
      .in(
        "attempt_id",
        firsts.map((a) => a.id)
      ),
  ]);
  const testById = new Map((tests ?? []).map((t) => [t.id as string, t]));
  const resultByAttempt = new Map((results ?? []).map((r) => [r.attempt_id as string, r]));

  const fullMocks = firsts
    .filter((a) => {
      const t = testById.get(a.test_id);
      return t && isFullMock(t);
    })
    .map((a) => ({
      testName: testById.get(a.test_id)!.test_name as string,
      scaled: scaleToPaper(Number(a.score ?? 0), Number(a.total_marks ?? 0), cutoff.total),
      submittedAt: a.submitted_at,
      attemptId: a.id,
    }));

  const latest = fullMocks.slice(-PROJECTION_MOCKS);
  const projected = latest.length ? Math.round((latest.reduce((s, m) => s + m.scaled, 0) / latest.length) * 10) / 10 : null;

  // Weak topics across all first attempts (≥5 questions to count).
  const topics = new Map<string, { total: number; correct: number }>();
  for (const a of firsts) {
    const ta = resultByAttempt.get(a.id)?.topic_accuracy as Record<string, { total: number; correct: number }> | null;
    for (const [name, t] of Object.entries(ta ?? {})) {
      const cur = topics.get(name) ?? { total: 0, correct: 0 };
      cur.total += Number(t.total) || 0;
      cur.correct += Number(t.correct) || 0;
      topics.set(name, cur);
    }
  }
  const weakTopics = [...topics.entries()]
    .filter(([, t]) => t.total >= 5)
    .map(([name, t]) => ({ name, pct: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  // Negative marks lost per full mock.
  let lost = 0;
  for (const m of fullMocks) {
    const a = firsts.find((x) => x.id === m.attemptId)!;
    const t = testById.get(a.test_id)!;
    const penalty = t.negative_marking_enabled ? Number(t.marks_per_question) * Number(t.negative_marking_value) : 0;
    const qp = (resultByAttempt.get(a.id)?.question_performance ?? []) as { selected: string | null; is_correct: boolean }[];
    lost += qp.filter((q) => q.selected && !q.is_correct).length * penalty;
  }

  const errors = errorBreakdown(firsts.map((a) => sanitizeErrorTags(a.error_tags, a.question_ids ?? (testById.get(a.test_id)?.question_ids as string[]) ?? [])));
  const topError = ERROR_TYPES.reduce<ErrorType | null>((best, e) => (errors[e] > 0 && (!best || errors[e] > errors[best]) ? e : best), null);

  return {
    userId,
    testsTaken: firsts.length,
    avgPct: Math.round((firsts.reduce((s, a) => s + Number(a.percentage ?? 0), 0) / firsts.length) * 10) / 10,
    fullMocks: fullMocks.map(({ testName, scaled, submittedAt }) => ({ testName, scaled, submittedAt })),
    projected,
    gap: projected === null ? null : Math.round((projected - cutoff.cutoff) * 10) / 10,
    trend: fullMocks.length >= 2 ? Math.round((fullMocks[fullMocks.length - 1].scaled - fullMocks[0].scaled) * 10) / 10 : null,
    lastTestAt: firsts[firsts.length - 1].submitted_at,
    weakTopics,
    topError,
    negativeLostPerMock: fullMocks.length ? Math.round((lost / fullMocks.length) * 10) / 10 : null,
  };
}

export function errorLabel(e: ErrorType | null): string {
  return e ? ERROR_LABEL[e].en : "—";
}

/** Students enrolled in a mentorship package (directly — mentorship isn't sold inside bundles). */
export async function getMentees(): Promise<{ id: string; full_name: string | null; email: string; phone: string | null }[]> {
  const db = supabaseAdmin();
  const { data: pkgs } = await db.from("packages").select("id").eq("package_type", "mentorship");
  const ids = (pkgs ?? []).map((p) => p.id as string);
  if (ids.length === 0) return [];
  const { data: enrollments } = await db.from("enrollments").select("user_id").in("package_id", ids).eq("status", "active");
  const userIds = [...new Set((enrollments ?? []).map((e) => e.user_id as string))];
  if (userIds.length === 0) return [];
  const { data: users } = await db.from("users").select("id, full_name, email, phone").in("id", userIds).order("full_name");
  return (users ?? []) as { id: string; full_name: string | null; email: string; phone: string | null }[];
}

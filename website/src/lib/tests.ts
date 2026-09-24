import { supabaseAdmin } from "./supabase";
import { parseUtcTimestamp } from "./timestamps";
import { awardTestXp, xpForAttempt } from "./gamification";
import {
  getActivePackages,
  getOwnedPackageIds,
  getPackageAccessSource,
  getPackageIncludes,
  getUserActiveEnrollments,
} from "./packages";

export const OPTION_KEYS = ["A", "B", "C", "D"] as const;
export type OptionKey = (typeof OPTION_KEYS)[number];

/**
 * How sure the student was when answering, tagged during the test:
 * sure, eliminated 2 options, eliminated 1, or a blind guess. Powers the
 * guess analysis ("attempt only if you can eliminate two").
 */
export const CONFIDENCE_LEVELS = ["sure", "elim2", "elim1", "guess"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];
export type Confidences = Record<string, Confidence>;

/** Why a question went wrong, tagged by the student on the result page — each needs a different fix. */
export const ERROR_TYPES = ["concept", "recall", "misread", "silly", "time"] as const;
export type ErrorType = (typeof ERROR_TYPES)[number];
export type ErrorTags = Record<string, ErrorType>;

/** { [question uuid]: "A" | "B" | "C" | "D" } — the shape stored in attempts.answers. */
export type Answers = Record<string, OptionKey>;

/**
 * Network slack after the timer hits zero: a save/submit that left the
 * browser at 0:00 can still arrive a little late. Anything later than
 * this is ignored and the last answers saved in time are scored instead.
 */
const SUBMIT_GRACE_MS = 60 * 1000;

export type Test = {
  id: string;
  test_name: string;
  package_id: string | null;
  test_type: string | null;
  total_questions: number;
  duration_minutes: number;
  negative_marking_enabled: boolean;
  negative_marking_value: number;
  marks_per_question: number;
  is_free_test: boolean;
  question_ids: string[];
  release_at: string | null;
};

const TEST_COLUMNS =
  "id, test_name, package_id, test_type, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question, is_free_test, question_ids, release_at";

export type Attempt = {
  id: string;
  user_id: string;
  test_id: string;
  enrollment_id: string | null;
  answers: Answers | null;
  marked_for_review: string[] | null;
  confidence: Confidences | null;
  error_tags: ErrorTags | null;
  score: number | null;
  total_marks: number | null;
  percentage: number | null;
  start_time: string;
  submitted_at: string | null;
  time_taken_seconds: number | null;
  status: string;
};

const ATTEMPT_COLUMNS =
  "id, user_id, test_id, enrollment_id, answers, marked_for_review, confidence, error_tags, score, total_marks, percentage, start_time, submitted_at, time_taken_seconds, status";

/** A question as sent to the browser DURING a test — no answer, no explanation. */
export type PublicQuestion = {
  id: string;
  subject: string | null;
  text_hindi: string;
  text_english: string;
  options: { key: OptionKey; hindi: string | null; english: string | null }[];
};

/** A question with its answer — only ever used server-side or after submission. */
export type FullQuestion = PublicQuestion & {
  topic: string | null;
  correct_answer: OptionKey;
  explanation_hindi: string | null;
  explanation_english: string | null;
};

export function isTestReleased(test: Pick<Test, "release_at">): boolean {
  return !test.release_at || new Date(test.release_at).getTime() <= Date.now();
}

function normalizeTest(row: Record<string, unknown>): Test {
  return {
    ...(row as Test),
    negative_marking_value: Number(row.negative_marking_value ?? 0),
    marks_per_question: Number(row.marks_per_question ?? 1),
    negative_marking_enabled: row.negative_marking_enabled !== false,
    is_free_test: row.is_free_test === true,
    question_ids: Array.isArray(row.question_ids) ? (row.question_ids as string[]) : [],
  };
}

export async function getTest(testId: string): Promise<Test | null> {
  const { data, error } = await supabaseAdmin().from("tests").select(TEST_COLUMNS).eq("id", testId).maybeSingle();
  if (error || !data) return null;
  return normalizeTest(data);
}

export async function getFreeTests(): Promise<Test[]> {
  const { data, error } = await supabaseAdmin()
    .from("tests")
    .select(TEST_COLUMNS)
    .eq("is_free_test", true)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(normalizeTest);
}

export type TestAccess =
  | { ok: true; test: Test; enrollmentId: string | null }
  | { ok: false; reason: "not_found" | "not_released" | "not_owned" | "no_questions" };

/**
 * Whether this user may take this test right now. Free tests are open to
 * every logged-in student; everything else needs an active enrollment on
 * a package that contains the test (via package_tests, or tests.package_id),
 * directly or through a combo — the same entitlement rules the dashboard
 * and store use (getOwnedPackageIds).
 */
export async function getTestAccess(userId: string, testId: string): Promise<TestAccess> {
  const test = await getTest(testId);
  if (!test) return { ok: false, reason: "not_found" };
  if (!isTestReleased(test)) return { ok: false, reason: "not_released" };
  if (test.question_ids.length === 0) return { ok: false, reason: "no_questions" };

  if (test.is_free_test) return { ok: true, test, enrollmentId: null };

  const [{ data: packageTests }, allPackages, includes, enrollments] = await Promise.all([
    supabaseAdmin().from("package_tests").select("package_id").eq("test_id", testId),
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(userId),
  ]);

  const containingPackageIds = new Set((packageTests ?? []).map((r) => r.package_id as string));
  if (test.package_id) containingPackageIds.add(test.package_id);

  const owned = getOwnedPackageIds(enrollments, includes, allPackages);
  const packageId = [...containingPackageIds].find((id) => owned.has(id));
  if (!packageId) return { ok: false, reason: "not_owned" };

  return { ok: true, test, enrollmentId: getPackageAccessSource(packageId, enrollments, includes)?.id ?? null };
}

/** Questions in the test's own order (tests.question_ids), with answers. Server-side only. */
export async function getTestQuestions(test: Test): Promise<FullQuestion[]> {
  if (test.question_ids.length === 0) return [];

  const { data, error } = await supabaseAdmin()
    .from("questions")
    .select(
      "id, subject, topic, question_text_hindi, question_text_english, option_a_hindi, option_a_english, option_b_hindi, option_b_english, option_c_hindi, option_c_english, option_d_hindi, option_d_english, correct_answer, explanation_hindi, explanation_english"
    )
    .in("id", test.question_ids);

  if (error || !data) throw new Error(`Could not load questions: ${error?.message ?? "no data"}`);

  const byId = new Map(data.map((q) => [q.id as string, q]));
  return test.question_ids
    .map((id) => byId.get(id))
    .filter((q): q is NonNullable<typeof q> => !!q)
    .map((q) => ({
      id: q.id,
      subject: q.subject,
      topic: q.topic,
      text_hindi: q.question_text_hindi,
      text_english: q.question_text_english,
      options: OPTION_KEYS.map((key) => {
        const k = key.toLowerCase();
        return {
          key,
          hindi: (q as Record<string, string | null>)[`option_${k}_hindi`] ?? null,
          english: (q as Record<string, string | null>)[`option_${k}_english`] ?? null,
        };
      }),
      correct_answer: String(q.correct_answer).toUpperCase() as OptionKey,
      explanation_hindi: q.explanation_hindi,
      explanation_english: q.explanation_english,
    }));
}

export function toPublicQuestion(q: FullQuestion): PublicQuestion {
  return { id: q.id, subject: q.subject, text_hindi: q.text_hindi, text_english: q.text_english, options: q.options };
}

/**
 * Keeps only answers to questions that are actually in this test, with a
 * valid option letter — the browser's payload is never trusted as-is.
 */
export function sanitizeAnswers(input: unknown, questionIds: string[]): Answers {
  const allowed = new Set(questionIds);
  const out: Answers = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return out;
  for (const [id, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allowed.has(id) || typeof value !== "string") continue;
    const v = value.toUpperCase();
    if ((OPTION_KEYS as readonly string[]).includes(v)) out[id] = v as OptionKey;
  }
  return out;
}

function sanitizeEnumMap<T extends string>(input: unknown, questionIds: string[], allowed: readonly T[]): Record<string, T> {
  const ids = new Set(questionIds);
  const out: Record<string, T> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return out;
  for (const [id, value] of Object.entries(input as Record<string, unknown>)) {
    if (ids.has(id) && typeof value === "string" && (allowed as readonly string[]).includes(value)) out[id] = value as T;
  }
  return out;
}

export function sanitizeConfidence(input: unknown, questionIds: string[]): Confidences {
  return sanitizeEnumMap(input, questionIds, CONFIDENCE_LEVELS);
}

export function sanitizeErrorTags(input: unknown, questionIds: string[]): ErrorTags {
  return sanitizeEnumMap(input, questionIds, ERROR_TYPES);
}

export function sanitizeMarked(input: unknown, questionIds: string[]): string[] {
  const allowed = new Set(questionIds);
  if (!Array.isArray(input)) return [];
  return [...new Set(input.filter((id): id is string => typeof id === "string" && allowed.has(id)))];
}

export function getAttemptDeadline(attempt: Pick<Attempt, "start_time">, test: Pick<Test, "duration_minutes">): Date {
  return new Date(parseUtcTimestamp(attempt.start_time).getTime() + test.duration_minutes * 60 * 1000);
}

export function isPastGrace(attempt: Pick<Attempt, "start_time">, test: Pick<Test, "duration_minutes">): boolean {
  return Date.now() > getAttemptDeadline(attempt, test).getTime() + SUBMIT_GRACE_MS;
}

export async function getAttempt(attemptId: string, userId: string): Promise<Attempt | null> {
  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .select(ATTEMPT_COLUMNS)
    .eq("id", attemptId)
    .eq("user_id", userId) // ownership check: you can only ever see your own attempts
    .maybeSingle();
  if (error || !data) return null;
  return data as Attempt;
}

/** No ownership filter — only for admin (mentor) views; callers must check the role. */
export async function getAttemptById(attemptId: string): Promise<Attempt | null> {
  const { data, error } = await supabaseAdmin().from("attempts").select(ATTEMPT_COLUMNS).eq("id", attemptId).maybeSingle();
  if (error || !data) return null;
  return data as Attempt;
}

export async function getUserAttemptsForTest(userId: string, testId: string): Promise<Attempt[]> {
  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .select(ATTEMPT_COLUMNS)
    .eq("user_id", userId)
    .eq("test_id", testId)
    .order("start_time", { ascending: false });
  if (error || !data) return [];
  return data as Attempt[];
}

/**
 * Resumes the user's unfinished attempt at this test if there is one
 * still inside its time limit, otherwise starts a fresh one. An expired
 * in-progress attempt (student closed the tab and never came back) is
 * finalized with whatever was saved before a new one starts.
 */
export async function startOrResumeAttempt(
  userId: string,
  test: Test,
  enrollmentId: string | null
): Promise<{ attemptId: string; resumed: boolean }> {
  const inProgress = (await getUserAttemptsForTest(userId, test.id)).filter((a) => a.status === "in_progress");

  for (const attempt of inProgress) {
    if (!isPastGrace(attempt, test)) return { attemptId: attempt.id, resumed: true };
    await finalizeAttempt(attempt, test);
  }

  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .insert({
      user_id: userId,
      test_id: test.id,
      enrollment_id: enrollmentId,
      answers: {},
      marked_for_review: [],
      start_time: new Date().toISOString(),
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(`Could not start attempt: ${error?.message ?? "no data"}`);
  return { attemptId: data.id, resumed: false };
}

export type SubjectStat = { total: number; attempted: number; correct: number; accuracy: number | null };

export type ScoreBreakdown = {
  score: number;
  totalMarks: number;
  percentage: number;
  correct: number;
  wrong: number;
  unattempted: number;
  accuracy: number | null; // correct / attempted, as a percentage
  bySubject: Record<string, SubjectStat>;
  byTopic: Record<string, SubjectStat>;
  perQuestion: { question_id: string; selected: OptionKey | null; correct: OptionKey; is_correct: boolean }[];
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function bump(map: Record<string, SubjectStat>, key: string, attempted: boolean, correct: boolean) {
  const s = (map[key] ??= { total: 0, attempted: 0, correct: 0, accuracy: null });
  s.total += 1;
  if (attempted) s.attempted += 1;
  if (correct) s.correct += 1;
  s.accuracy = s.attempted > 0 ? round2((s.correct / s.attempted) * 100) : null;
}

/**
 * Pure scoring. negative_marking_value is a FRACTION of marks_per_question
 * (0.33 = UKPSC's "one-third of the marks for that question" rule), so
 * the penalty scales correctly if a test uses 2 marks per question.
 */
export function scoreAttempt(
  questions: FullQuestion[],
  answers: Answers,
  test: Pick<Test, "marks_per_question" | "negative_marking_enabled" | "negative_marking_value">
): ScoreBreakdown {
  const marks = test.marks_per_question;
  const penalty = test.negative_marking_enabled ? marks * test.negative_marking_value : 0;

  let correct = 0;
  let wrong = 0;
  const bySubject: Record<string, SubjectStat> = {};
  const byTopic: Record<string, SubjectStat> = {};
  const perQuestion: ScoreBreakdown["perQuestion"] = [];

  for (const q of questions) {
    const selected = answers[q.id] ?? null;
    const isCorrect = selected !== null && selected === q.correct_answer;
    if (selected !== null) {
      if (isCorrect) correct += 1;
      else wrong += 1;
    }
    bump(bySubject, q.subject || "General", selected !== null, isCorrect);
    if (q.topic) bump(byTopic, q.topic, selected !== null, isCorrect);
    perQuestion.push({ question_id: q.id, selected, correct: q.correct_answer, is_correct: isCorrect });
  }

  const totalMarks = round2(questions.length * marks);
  const score = round2(correct * marks - wrong * penalty);
  const attempted = correct + wrong;

  return {
    score,
    totalMarks,
    percentage: totalMarks > 0 ? round2((score / totalMarks) * 100) : 0,
    correct,
    wrong,
    unattempted: questions.length - attempted,
    accuracy: attempted > 0 ? round2((correct / attempted) * 100) : null,
    bySubject,
    byTopic,
    perQuestion,
  };
}

/**
 * Submits an attempt exactly once. `final` is what the browser sent with
 * the submit click; it's only honoured if it arrived within the time
 * limit (+ grace) — otherwise the last answers saved in time are scored.
 * The UPDATE ... WHERE status = 'in_progress' is the guard (same pattern
 * as completeOrder in orders.ts): a double-click, a timer auto-submit
 * racing a manual one, or a page reload finalizing an expired attempt
 * can't produce two results rows.
 */
export async function finalizeAttempt(
  attempt: Attempt,
  test: Test,
  final?: { answers: Answers; marked: string[]; confidence: Confidences }
): Promise<{ alreadySubmitted: boolean }> {
  if (attempt.status !== "in_progress") return { alreadySubmitted: true };

  const late = isPastGrace(attempt, test);
  const answers = final && !late ? final.answers : sanitizeAnswers(attempt.answers, test.question_ids);
  const marked = final && !late ? final.marked : (attempt.marked_for_review ?? []);
  // Confidence only counts for questions actually answered.
  const confidenceSrc = final && !late ? final.confidence : sanitizeConfidence(attempt.confidence, test.question_ids);
  const confidence: Confidences = Object.fromEntries(Object.entries(confidenceSrc).filter(([id]) => id in answers));

  const questions = await getTestQuestions(test);
  const result = scoreAttempt(questions, answers, test);

  const now = new Date();
  const elapsedSeconds = Math.round((now.getTime() - parseUtcTimestamp(attempt.start_time).getTime()) / 1000);
  const timeTaken = Math.max(0, Math.min(elapsedSeconds, test.duration_minutes * 60));

  const db = supabaseAdmin();
  const { data: won, error } = await db
    .from("attempts")
    .update({
      answers,
      marked_for_review: marked,
      confidence,
      score: result.score,
      total_marks: result.totalMarks,
      percentage: result.percentage,
      end_time: now.toISOString(),
      submitted_at: now.toISOString(),
      time_taken_seconds: timeTaken,
      status: "submitted",
      updated_at: now.toISOString(),
    })
    .eq("id", attempt.id)
    .eq("status", "in_progress")
    .select("id");

  if (error) throw new Error(`Could not submit attempt: ${error.message}`);
  if (!won || won.length === 0) return { alreadySubmitted: true };

  const attempted = result.correct + result.wrong;
  const percentile = await computePercentile(test.id, result.score, attempt.id);

  const { error: resultError } = await db.from("results").insert({
    attempt_id: attempt.id,
    user_id: attempt.user_id,
    test_id: test.id,
    overall_score: result.score,
    overall_accuracy: result.accuracy,
    overall_percentile: percentile,
    subject_accuracy: result.bySubject,
    topic_accuracy: result.byTopic,
    question_performance: result.perQuestion,
    time_per_question_avg: attempted > 0 ? round2(timeTaken / attempted) : null,
  });

  // The attempt row already holds the authoritative score and answers
  // (the result page recomputes from it), so a failed analytics insert
  // is logged, not surfaced to the student.
  if (resultError) console.error("[tests] results insert failed for attempt", attempt.id, resultError);

  // XP / streak / level. Runs only for the caller that won the submit
  // guard above, so each attempt is awarded exactly once. A failure here
  // must never block the student from seeing their result.
  try {
    const isFirst = !(await hasEarlierSubmittedAttempt(attempt.user_id, test.id, attempt.id, now.toISOString()));
    const xp = xpForAttempt(result.percentage, isFirst, attempted);
    if (attempted > 0) await awardTestXp(attempt.user_id, xp);
  } catch (err) {
    console.error("[tests] XP award failed for attempt", attempt.id, err);
  }

  return { alreadySubmitted: false };
}

/**
 * Percentage of OTHER submitted attempts at this test that scored
 * strictly lower. Null when nobody else has taken it yet — "100th
 * percentile of 1" isn't meaningful. Live, so it grows as more students
 * take the test.
 */
export async function computePercentile(testId: string, score: number, excludeAttemptId: string): Promise<number | null> {
  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .select("id, score")
    .eq("test_id", testId)
    .eq("status", "submitted")
    .neq("id", excludeAttemptId);

  if (error || !data || data.length === 0) return null;
  const below = data.filter((a) => Number(a.score) < score).length;
  return round2((below / data.length) * 100);
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export type TestListItem = {
  id: string;
  test_name: string;
  subject: string | null;
  total_questions: number | null;
  duration_minutes: number | null;
  release_at: string | null;
};

/** Full test list for a course detail page — name, subject, question count, duration, release date. */
export async function getPackageTestList(packageId: string): Promise<TestListItem[]> {
  const db = supabaseAdmin();

  const { data: links, error: linkError } = await db
    .from("package_tests")
    .select("test_id, test_order")
    .eq("package_id", packageId);

  if (linkError || !links || links.length === 0) return [];

  const { data: tests, error } = await db
    .from("tests")
    .select("id, test_name, subject, total_questions, duration_minutes, release_at")
    .in(
      "id",
      links.map((l) => l.test_id)
    );

  if (error || !tests) return [];

  const orderOf = new Map(links.map((l) => [l.test_id as string, Number(l.test_order ?? 0)]));
  return [...tests].sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0));
}

export type TestAttemptSummary = { attemptId: string; score: number; totalMarks: number; percentage: number; attempts: number };

/** Per test: the latest submitted attempt and how many times it's been taken. */
export async function getUserTestSummaries(userId: string, testIds: string[]): Promise<Map<string, TestAttemptSummary>> {
  const out = new Map<string, TestAttemptSummary>();
  if (testIds.length === 0) return out;

  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .select("id, test_id, score, total_marks, percentage, submitted_at")
    .eq("user_id", userId)
    .eq("status", "submitted")
    .in("test_id", testIds)
    .order("submitted_at", { ascending: false });

  if (error || !data) return out;
  for (const a of data) {
    const existing = out.get(a.test_id);
    if (existing) {
      existing.attempts += 1;
      continue;
    }
    out.set(a.test_id, {
      attemptId: a.id,
      score: Number(a.score),
      totalMarks: Number(a.total_marks),
      percentage: Number(a.percentage),
      attempts: 1,
    });
  }
  return out;
}

/** Whether this user submitted this test before `beforeIso` in some other attempt (i.e. this one is a reattempt). */
export async function hasEarlierSubmittedAttempt(
  userId: string,
  testId: string,
  attemptId: string,
  beforeIso: string
): Promise<boolean> {
  const { count, error } = await supabaseAdmin()
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("test_id", testId)
    .eq("status", "submitted")
    .neq("id", attemptId)
    .lt("submitted_at", beforeIso);
  if (error) throw new Error(`attempt history lookup failed: ${error.message}`);
  return (count ?? 0) > 0;
}

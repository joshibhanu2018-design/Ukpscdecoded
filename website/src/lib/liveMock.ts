import { supabaseAdmin } from "./supabase";
import { parseUtcTimestamp } from "./timestamps";

/**
 * Mock Mahasangram (live rank challenge), schema-phase37.
 *
 * A live test has three times on the `tests` row:
 *  - release_at: the test opens (12 noon on the day),
 *  - rank_until: last start that counts for the official rank list (6 pm),
 *  - result_at:  result, solutions and the rank list are published (8 pm).
 * Only a student's FIRST attempt, started between release_at and rank_until,
 * is ranked. Later attempts are scored against the list ("would have been").
 */

export const LIVE_SERIES = "mahasangram";
export const LIVE_SERIES_NAME = "All Uttarakhand Rank Challenge";

export type LiveTest = {
  id: string;
  test_name: string;
  is_free_test: boolean;
  total_questions: number;
  duration_minutes: number;
  release_at: string | null;
  rank_until: string | null;
  result_at: string | null;
  question_count: number;
};

export type RankRow = {
  rank: number;
  stars: number;
  userId: string;
  name: string;
  district: string | null;
  score: number;
  totalMarks: number;
  timeTakenSeconds: number;
};

function ms(value: string | null): number | null {
  return value ? parseUtcTimestamp(value).getTime() : null;
}

/** ★★★ ranks 1-3, ★★ 4-10, ★ 11-20. */
export function starsForRank(rank: number): number {
  if (rank <= 3) return 3;
  if (rank <= 10) return 2;
  if (rank <= 20) return 1;
  return 0;
}

/** Result, solutions and the rank list stay hidden until result_at. */
export function isResultHidden(test: { result_at?: string | null }, now = Date.now()): boolean {
  const at = ms(test.result_at ?? null);
  return at !== null && now < at;
}

export function isLiveTest(test: { rank_until?: string | null }): boolean {
  return !!test.rank_until;
}

export async function getLiveTests(): Promise<LiveTest[]> {
  const { data, error } = await supabaseAdmin()
    .from("tests")
    .select("id, test_name, is_free_test, total_questions, duration_minutes, release_at, rank_until, result_at, question_ids")
    .eq("live_series", LIVE_SERIES)
    .order("release_at", { ascending: true });
  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id as string,
    test_name: t.test_name as string,
    is_free_test: t.is_free_test === true,
    total_questions: Number(t.total_questions ?? 0),
    duration_minutes: Number(t.duration_minutes ?? 0),
    release_at: (t.release_at as string | null) ?? null,
    rank_until: (t.rank_until as string | null) ?? null,
    result_at: (t.result_at as string | null) ?? null,
    question_count: Array.isArray(t.question_ids) ? t.question_ids.length : 0,
  }));
}

export async function getLiveTest(testId: string): Promise<LiveTest | null> {
  return (await getLiveTests()).find((t) => t.id === testId) ?? null;
}

type RankedAttempt = { id: string; user_id: string; score: number; total_marks: number; time_taken_seconds: number; start: number };

/** Each student's first attempt at this test (by start time), if submitted inside the rank window. */
async function rankedAttempts(test: Pick<LiveTest, "id" | "release_at" | "rank_until">): Promise<RankedAttempt[]> {
  const open = ms(test.release_at) ?? 0;
  const until = ms(test.rank_until);
  if (until === null) return [];

  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .select("id, user_id, score, total_marks, time_taken_seconds, start_time, status")
    .eq("test_id", test.id);
  if (error || !data) return [];

  const first = new Map<string, (typeof data)[number]>();
  for (const a of data) {
    const prev = first.get(a.user_id as string);
    if (!prev || ms(a.start_time as string)! < ms(prev.start_time as string)!) first.set(a.user_id as string, a);
  }

  const out: RankedAttempt[] = [];
  for (const a of first.values()) {
    const start = ms(a.start_time as string)!;
    if (a.status !== "submitted" || start < open || start > until) continue;
    out.push({
      id: a.id as string,
      user_id: a.user_id as string,
      score: Number(a.score ?? 0),
      total_marks: Number(a.total_marks ?? 0),
      time_taken_seconds: Number(a.time_taken_seconds ?? 0),
      start,
    });
  }
  // Higher score first; on a tie, the faster student.
  return out.sort((x, y) => y.score - x.score || x.time_taken_seconds - y.time_taken_seconds);
}

/** Competition ranking: equal score and time share a rank (1, 2, 2, 4). */
function assignRanks<T extends { score: number; time_taken_seconds: number }>(rows: T[]): number[] {
  const ranks: number[] = [];
  rows.forEach((r, i) => {
    const prev = rows[i - 1];
    ranks.push(prev && prev.score === r.score && prev.time_taken_seconds === r.time_taken_seconds ? ranks[i - 1] : i + 1);
  });
  return ranks;
}

export async function getRankList(test: Pick<LiveTest, "id" | "release_at" | "rank_until">): Promise<RankRow[]> {
  const attempts = await rankedAttempts(test);
  if (attempts.length === 0) return [];

  const ids = attempts.map((a) => a.user_id);
  const names = new Map<string, { full_name: string | null; district: string | null }>();
  for (let i = 0; i < ids.length; i += 500) {
    const { data } = await supabaseAdmin().from("users").select("id, full_name, district").in("id", ids.slice(i, i + 500));
    for (const u of data ?? []) names.set(u.id as string, { full_name: u.full_name as string | null, district: u.district as string | null });
  }

  const ranks = assignRanks(attempts);
  return attempts.map((a, i) => ({
    rank: ranks[i],
    stars: starsForRank(ranks[i]),
    userId: a.user_id,
    name: names.get(a.user_id)?.full_name?.trim() || "Student",
    district: names.get(a.user_id)?.district ?? null,
    score: a.score,
    totalMarks: a.total_marks,
    timeTakenSeconds: a.time_taken_seconds,
  }));
}

/**
 * Where an attempt stands: its official rank if it is the student's ranked
 * attempt, otherwise the rank it would have had among the ranked students.
 */
export async function rankForAttempt(
  test: Pick<LiveTest, "id" | "release_at" | "rank_until">,
  attempt: { id: string; score: number; time_taken_seconds: number }
): Promise<{ rank: number; total: number; official: boolean }> {
  const ranked = await rankedAttempts(test);
  const ranks = assignRanks(ranked);
  const idx = ranked.findIndex((a) => a.id === attempt.id);
  if (idx >= 0) return { rank: ranks[idx], total: ranked.length, official: true };

  const better = ranked.filter(
    (a) => a.score > attempt.score || (a.score === attempt.score && a.time_taken_seconds < attempt.time_taken_seconds)
  ).length;
  return { rank: better + 1, total: ranked.length, official: false };
}

/** "Sun 15 Nov, 8:00 pm" in Indian time. */
export function formatIst(value: string | null): string {
  if (!value) return "";
  return parseUtcTimestamp(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

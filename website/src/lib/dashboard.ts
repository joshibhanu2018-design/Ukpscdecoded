import { supabaseAdmin } from "./supabase";

export type GamificationStats = {
  level: number;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  total_tests_taken: number;
};

const DEFAULT_STATS: GamificationStats = {
  level: 1,
  total_xp: 0,
  current_streak: 0,
  best_streak: 0,
  total_tests_taken: 0,
};

// New users don't have a user_gamification row yet (it's created lazily,
// not at signup) — default to zeros rather than erroring, matching the
// "friendly empty state" requirement.
export async function getUserGamificationStats(userId: string): Promise<GamificationStats> {
  const { data, error } = await supabaseAdmin()
    .from("user_gamification")
    .select("level, total_xp, current_streak, best_streak, total_tests_taken")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return DEFAULT_STATS;
  return data as GamificationStats;
}

/**
 * Average percentage across every submitted attempt. Read from attempts
 * (the authoritative score) rather than results, whose overall_score is
 * raw marks, not a percentage.
 */
export async function getUserAverageScore(userId: string): Promise<number | null> {
  const { data, error } = await supabaseAdmin()
    .from("attempts")
    .select("percentage")
    .eq("user_id", userId)
    .eq("status", "submitted");

  if (error || !data || data.length === 0) return null;

  const scores = data.map((r) => Number(r.percentage)).filter((n) => !Number.isNaN(n));
  if (scores.length === 0) return null;

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Real count of submitted attempts. user_gamification.total_tests_taken
 * isn't incremented by anything yet (gamification is still inert), so the
 * dashboard reads this instead of showing a permanent 0.
 */
export async function getUserTestsTaken(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin()
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "submitted");

  return error ? 0 : (count ?? 0);
}

export type PackageProgress = { testsDone: number; totalTests: number };

export async function getPackageProgress(
  userId: string,
  packageId: string,
  fallbackTotal: number | null
): Promise<PackageProgress> {
  const { data: packageTests, error: ptError } = await supabaseAdmin()
    .from("package_tests")
    .select("test_id")
    .eq("package_id", packageId);

  const totalTests = fallbackTotal ?? packageTests?.length ?? 0;

  if (ptError || !packageTests || packageTests.length === 0) {
    return { testsDone: 0, totalTests };
  }

  const testIds = packageTests.map((r) => r.test_id);

  const { data: attempts, error: aError } = await supabaseAdmin()
    .from("attempts")
    .select("test_id")
    .eq("user_id", userId)
    .in("status", ["submitted", "graded"])
    .in("test_id", testIds);

  if (aError || !attempts) return { testsDone: 0, totalTests };

  return { testsDone: new Set(attempts.map((a) => a.test_id)).size, totalTests };
}

export type TestRelease = { id: string; test_name: string; release_at: string | null; isReleased: boolean };

/**
 * Tests belonging to a package, each flagged with whether it's released
 * yet. release_at is a genuine timestamptz (unlike most timestamp columns
 * in this schema), so PostgREST returns it with an explicit UTC offset —
 * safe to parse directly with `new Date()`, no local-timezone footgun.
 */
export async function getPackageTestsWithRelease(packageId: string): Promise<TestRelease[]> {
  const { data: packageTests, error: ptError } = await supabaseAdmin()
    .from("package_tests")
    .select("test_id, test_order")
    .eq("package_id", packageId);

  if (ptError || !packageTests || packageTests.length === 0) return [];

  const orderOf = new Map(packageTests.map((r) => [r.test_id as string, Number(r.test_order ?? 0)]));

  const { data: tests, error } = await supabaseAdmin()
    .from("tests")
    .select("id, test_name, release_at")
    .in(
      "id",
      packageTests.map((r) => r.test_id)
    );

  if (error || !tests) return [];

  const now = Date.now();
  return [...tests]
    .sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0))
    .map((t) => ({
      id: t.id,
      test_name: t.test_name,
      release_at: t.release_at,
      isReleased: !t.release_at || new Date(t.release_at).getTime() <= now,
    }));
}

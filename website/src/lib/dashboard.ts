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

export async function getUserAverageScore(userId: string): Promise<number | null> {
  const { data, error } = await supabaseAdmin().from("results").select("overall_score").eq("user_id", userId);

  if (error || !data || data.length === 0) return null;

  const scores = data.map((r) => Number(r.overall_score)).filter((n) => !Number.isNaN(n));
  if (scores.length === 0) return null;

  return scores.reduce((a, b) => a + b, 0) / scores.length;
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

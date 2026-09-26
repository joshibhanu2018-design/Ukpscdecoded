import { supabaseAdmin } from "./supabase";

/**
 * XP for one submitted test. Rewards performance on the FIRST attempt only,
 * so re-taking a test you've already seen the answers to can't farm XP:
 * - completing a test: +10 (reattempt: +5)
 * - first attempt: + half the percentage score (0–50)
 * - first attempt scoring 60%+: +10 bonus
 * A test submitted with no answers earns nothing and doesn't count for the streak.
 */
export function xpForAttempt(percentage: number, isFirstAttempt: boolean, answeredCount: number): number {
  if (answeredCount <= 0) return 0;
  if (!isFirstAttempt) return 5;
  const pct = Math.max(0, Math.min(100, percentage));
  return 10 + Math.round(pct / 2) + (pct >= 60 ? 10 : 0);
}

/** Level n needs 50·n·(n−1) XP (L2 = 100, L3 = 300, …). Same formula as award_test_xp() in SQL. */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  return Math.min(25, Math.max(1, Math.floor((1 + Math.sqrt(1 + xp / 12.5)) / 2)));
}

/** Today's date in India (UTC+5:30) — streak days follow the student's calendar, not UTC. */
export function todayIST(now = Date.now()): string {
  return new Date(now + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function awardTestXp(userId: string, xp: number): Promise<void> {
  const { error } = await supabaseAdmin().rpc("award_test_xp", {
    p_user_id: userId,
    p_xp: xp,
    p_today: todayIST(),
  });
  if (error) throw new Error(`award_test_xp failed: ${error.message}`);
}

import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Flame, Gift, Target, Trophy, Video, Zap } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  formatClassDate,
  formatDateLabel,
  formatINR,
  getActivePackages,
  getOwnedPackageIds,
  getPackageAccessSource,
  getPackageIncludes,
  getUserActiveEnrollments,
  type Package,
} from "@/lib/packages";
import {
  getPackageProgress,
  getUserAverageScore,
  getUserGamificationStats,
  getUserTestsTaken,
} from "@/lib/dashboard";
import { getFreeTests, isTestReleased } from "@/lib/tests";
import { getPriceInfo } from "@/lib/pricing";
import { xpForLevel } from "@/lib/gamification";
import { supabaseAdmin } from "@/lib/supabase";
import LogoutButton from "@/components/LogoutButton";
import ReferralCard from "@/components/ReferralCard";
import CourseThumb from "@/components/CourseThumb";

export const metadata: Metadata = {
  title: "My Courses",
  description: "Your UKPSC Decoded courses and test series.",
};

function StatTile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-3 sm:p-4">
      <div className="mb-1.5 text-saffron-400">{icon}</div>
      <div className="text-lg font-bold text-white sm:text-xl">{value}</div>
      <div className="text-[11px] text-graphite-300 sm:text-xs">{label}</div>
      {sub && <div className="text-[11px] text-graphite-300">{sub}</div>}
    </div>
  );
}

const TYPE_LABEL: Record<string, string> = {
  test_series: "Test Series",
  video_course: "Video Course",
  mentorship: "Mentorship",
};

export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string; already?: string }>;
}) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect("/student/login?next=/test-platform");

  const { purchase, already } = await searchParams;

  const [allPackages, includes, enrollments, stats, avgScore, testsTaken, freeTests, referralRes] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(user.id),
    getUserGamificationStats(user.id),
    getUserAverageScore(user.id),
    getUserTestsTaken(user.id),
    getFreeTests(),
    supabaseAdmin().from("users").select("referral_code, store_credit_paise").eq("id", user.id).maybeSingle(),
  ]);
  const referralInfo = referralRes.data;
  const releasedFreeTests = freeTests.filter((t) => isTestReleased(t) && t.question_ids.length > 0);

  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);

  // A combo is just a key to its components — show the components, not the combo itself.
  const myCourses = allPackages.filter((p) => ownedIds.has(p.id) && p.package_type !== "combo_bundle");

  const courseCards = await Promise.all(
    myCourses.map(async (pkg) => ({
      pkg,
      validTill: getPackageAccessSource(pkg.id, enrollments, includes)?.access_valid_till ?? pkg.access_valid_till,
      progress: pkg.package_type === "test_series" ? await getPackageProgress(user.id, pkg.id, pkg.total_tests) : null,
    }))
  );

  const explore = allPackages.filter((p) => !ownedIds.has(p.id) && p.slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ukpscdecoded.in";
  const firstName = user.full_name?.split(" ")[0] || "";

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-graphite-300">
              Welcome back, <span className="text-saffron-400">{firstName}</span>
            </p>
            <h1 className="text-2xl font-bold text-white">
              My Courses
            </h1>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {user.role === "admin" && (
              <Link href="/test-platform/admin" className="rounded-lg border border-saffron-400/40 px-3 py-2 text-sm font-medium text-saffron-300 hover:bg-saffron-400/10">
                Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        {purchase === "success" && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-success-500/30 bg-success-500/10 px-4 py-2.5 text-sm text-success-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              Payment successful — your course is active.
            </span>
          </div>
        )}
        {already === "owned" && (
          <div className="mb-6 rounded-lg border border-saffron-400/30 bg-saffron-400/10 px-4 py-2.5 text-sm text-saffron-100">
            You already own this course.
          </div>
        )}

        {myCourses.length === 0 ? (
          <div className="mb-8 rounded-2xl border border-dashed border-graphite-700 bg-graphite-800/40 p-6 text-center sm:p-8">
            <p className="text-graphite-300">You haven&apos;t enrolled in a course yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-saffron-400 px-5 py-3 text-sm font-bold text-graphite-900 hover:bg-saffron-300"
            >
              Browse Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courseCards.map(({ pkg, validTill, progress }) => {
              const pct =
                progress && progress.totalTests > 0
                  ? Math.min(100, Math.round((progress.testsDone / progress.totalTests) * 100))
                  : 0;
              const classStart = formatClassDate((pkg.metadata?.class_start as string | undefined) ?? undefined);
              const continueHref =
                pkg.package_type === "mentorship"
                  ? "/test-platform/mentorship"
                  : pkg.package_type === "test_series" && pkg.slug
                  ? `/test-platform/course/${pkg.slug}`
                  : pkg.package_type === "video_course" && pkg.slug
                  ? `/test-platform/lessons/${pkg.slug}`
                  : pkg.slug
                    ? `/courses/${pkg.slug}`
                    : "/courses";
              return (
                <div key={pkg.id} className="flex flex-col overflow-hidden rounded-2xl border border-graphite-800 bg-graphite-900/60">
                  <CourseThumb src={pkg.image_url} alt={pkg.package_name} className="h-20 w-full" />
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-medium text-saffron-400">{TYPE_LABEL[pkg.package_type] ?? pkg.package_type}</p>
                    <h2 className="mt-0.5 font-semibold text-white">{pkg.package_name}</h2>

                    {progress && (
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs text-graphite-300">
                          <span>Progress</span>
                          <span>
                            {progress.testsDone} / {progress.totalTests} tests
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-graphite-800">
                          <div className="h-2 rounded-full bg-saffron-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    {pkg.package_type === "video_course" && (
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-graphite-300">
                        <Video className="h-3.5 w-3.5 text-saffron-400" />
                        {classStart ? `Classes start ${classStart}` : "Videos coming soon"}
                      </p>
                    )}

                    {validTill && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-graphite-300">
                        <CalendarDays className="h-3.5 w-3.5" /> Valid till {formatDateLabel(validTill)}
                      </p>
                    )}

                    <Link
                      href={continueHref}
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-saffron-400 px-4 py-3 text-sm font-bold text-graphite-900 hover:bg-saffron-300 sm:mt-auto"
                    >
                      Continue <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatTile icon={<Target className="h-5 w-5" />} label="Tests Taken" value={String(testsTaken)} />
          <StatTile
            icon={<Trophy className="h-5 w-5" />}
            label="Average"
            value={avgScore != null ? `${avgScore.toFixed(1)}%` : "—"}
          />
          <StatTile
            icon={<Flame className="h-5 w-5" />}
            label="Streak"
            value={`${stats.current_streak} day${stats.current_streak === 1 ? "" : "s"}`}
            sub={stats.best_streak > 0 ? `Best: ${stats.best_streak}` : "1 test a day"}
          />
          <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-3 sm:p-4">
            <div className="mb-1.5 text-saffron-400">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-lg font-bold text-white sm:text-xl">Level {stats.level}</div>
            <div className="text-[11px] text-graphite-300 sm:text-xs">{stats.total_xp} XP</div>
            {stats.level < 25 && (
              <>
                <div className="mt-2 h-1.5 rounded-full bg-graphite-800">
                  <div
                    className="h-1.5 rounded-full bg-saffron-400"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          ((stats.total_xp - xpForLevel(stats.level)) /
                            (xpForLevel(stats.level + 1) - xpForLevel(stats.level))) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-graphite-300">
                  {xpForLevel(stats.level + 1) - stats.total_xp} XP → Lvl {stats.level + 1}
                </div>
              </>
            )}
          </div>
        </div>

        {testsTaken > 0 && (
          <Link
            href="/test-platform/performance"
            className="-mt-4 mb-8 flex items-center justify-between rounded-xl border border-saffron-400/30 bg-saffron-400/10 px-4 py-3 text-sm text-saffron-100 hover:bg-saffron-400/15"
          >
            <span>
              <span className="font-semibold">My Performance</span>
              <span className="block text-xs text-saffron-200/80">Weak topics, error log, guess rule</span>
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0" />
          </Link>
        )}

        {releasedFreeTests.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-white">
              Free Tests
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {releasedFreeTests.map((t) => (
                <Link
                  key={t.id}
                  href={`/test-platform/tests/${t.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-graphite-800 bg-graphite-900/60 p-4 hover:border-saffron-400/50"
                >
                  <Gift className="h-5 w-5 flex-shrink-0 text-success-400" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white group-hover:text-saffron-400">{t.test_name}</h3>
                    <p className="text-xs text-graphite-300">
                      {t.question_ids.length} Q · {t.duration_minutes} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {referralInfo?.referral_code && (
          <div className="mb-8">
            <ReferralCard
              referralCode={referralInfo.referral_code}
              storeCreditPaise={referralInfo.store_credit_paise ?? 0}
              storeUrl={`${baseUrl}/courses`}
            />
          </div>
        )}

        {explore.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">
                Explore more courses
              </h2>
              <Link href="/courses" className="flex-shrink-0 text-sm font-medium text-saffron-400 hover:text-saffron-300">
                All →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {explore.slice(0, 3).map((pkg: Package) => (
                <Link
                  key={pkg.id}
                  href={`/courses/${pkg.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-graphite-800 bg-graphite-900/60 p-4 hover:border-saffron-400/50"
                >
                  <span className="min-w-0 truncate text-sm font-semibold text-white">{pkg.package_name}</span>
                  <span className="flex-shrink-0 text-sm font-bold text-saffron-400">{formatINR(getPriceInfo(pkg).amount)}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/courses"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-saffron-400/50 px-4 py-3 text-sm font-semibold text-saffron-300 hover:bg-saffron-400/10"
            >
              Explore all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarDays, CheckCircle2, Flame, Lock, Target, Trophy, Video, Zap } from "lucide-react";
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
  getPackageTestsWithRelease,
  getUserAverageScore,
  getUserGamificationStats,
} from "@/lib/dashboard";
import { getPriceInfo } from "@/lib/pricing";
import { supabaseAdmin } from "@/lib/supabase";
import LogoutButton from "@/components/LogoutButton";
import ReferralCard from "@/components/ReferralCard";

export const metadata: Metadata = {
  title: "Test Platform",
  description: "Your UKPSC Decoded test platform dashboard.",
};

function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 flex items-center gap-2 text-yellow-500">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default async function TestPlatformPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string }>;
}) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect("/student/login");

  const { purchase } = await searchParams;

  const [allPackages, includes, enrollments, stats, avgScore] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(user.id),
    getUserGamificationStats(user.id),
    getUserAverageScore(user.id),
  ]);

  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);
  const byId = new Map(allPackages.map((p) => [p.id, p]));

  const myPackages = [...ownedIds]
    .map((id) => byId.get(id))
    .filter((p): p is Package => !!p && p.package_type !== "combo_bundle");
  const myTestSeries = myPackages.filter((p) => p.package_type === "test_series");
  const myVideoCourses = myPackages.filter((p) => p.package_type === "video_course");

  const testSeriesProgress = await Promise.all(
    myTestSeries.map(async (pkg) => ({
      pkg,
      progress: await getPackageProgress(user.id, pkg.id, pkg.total_tests),
      validTill: getPackageAccessSource(pkg.id, enrollments, includes)?.access_valid_till ?? pkg.access_valid_till,
      tests: await getPackageTestsWithRelease(pkg.id),
    }))
  );

  const notOwned = allPackages.filter((p) => !ownedIds.has(p.id));
  const allVideoCourses = allPackages.filter((p) => p.package_type === "video_course");

  const { data: referralInfo } = await supabaseAdmin()
    .from("users")
    .select("referral_code, store_credit_paise")
    .eq("id", user.id)
    .maybeSingle();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ukpscdecoded.in";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              स्वागत है, <span className="text-yellow-500">{user.full_name}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        {purchase === "success" && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-300">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            भुगतान सफल — आपका पैकेज सक्रिय है।{" "}
            <span className="text-green-400/80">/ Payment successful — your package is active.</span>
          </div>
        )}

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile icon={<Target className="h-5 w-5" />} label="Tests Taken" value={String(stats.total_tests_taken)} />
          <StatTile
            icon={<Trophy className="h-5 w-5" />}
            label="Average Score"
            value={avgScore != null ? `${avgScore.toFixed(1)}%` : "—"}
          />
          <StatTile
            icon={<Flame className="h-5 w-5" />}
            label="Current Streak"
            value={`${stats.current_streak} day${stats.current_streak === 1 ? "" : "s"}`}
          />
          <StatTile
            icon={<Zap className="h-5 w-5" />}
            label="Level"
            value={`Lvl ${stats.level}`}
            sub={`${stats.total_xp} XP`}
          />
        </div>

        {referralInfo?.referral_code && (
          <div className="mb-10">
            <ReferralCard
              referralCode={referralInfo.referral_code}
              storeCreditPaise={referralInfo.store_credit_paise ?? 0}
              storeUrl={`${baseUrl}/test-platform/packages`}
            />
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-white">
            मेरे पैकेज <span className="text-slate-400">/ My Packages</span>
          </h2>

          {myPackages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 p-8 text-center">
              <p className="text-slate-300">
                शुरुआत करें <span className="text-slate-500">/ </span>Start with a free sample test.
              </p>
              <Link
                href="/test-platform/packages"
                className="mt-4 inline-block rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400"
              >
                Browse the Package Store
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testSeriesProgress.map(({ pkg, progress, validTill, tests }) => (
                <div key={pkg.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <h3 className="font-semibold text-white">{pkg.package_name}</h3>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>
                        {progress.testsDone} / {progress.totalTests || 0} tests
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-yellow-500"
                        style={{
                          width: `${
                            progress.totalTests > 0
                              ? Math.min(100, Math.round((progress.testsDone / progress.totalTests) * 100))
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  {validTill && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" /> Valid till {formatDateLabel(validTill)}
                    </p>
                  )}
                  {tests.length > 0 && (
                    <ul className="mt-4 space-y-1.5 border-t border-slate-800 pt-3">
                      {tests.map((t) => (
                        <li key={t.id} className="flex items-center gap-1.5 text-xs">
                          {t.isReleased ? (
                            <span className="text-slate-300">{t.test_name}</span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Lock className="h-3 w-3 flex-shrink-0" />
                              {t.test_name} — Unlocks on {formatDateLabel(t.release_at)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {myVideoCourses.map((pkg) => {
                const validTill = getPackageAccessSource(pkg.id, enrollments, includes)?.access_valid_till ?? pkg.access_valid_till;
                const classStart = formatClassDate((pkg.metadata?.class_start as string | undefined) ?? undefined);
                return (
                  <div key={pkg.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="mb-2 flex items-center gap-2 text-yellow-500">
                      <Video className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-white">{pkg.package_name}</h3>
                    {classStart && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-yellow-400">
                        <CalendarDays className="h-4 w-4" /> Classes start {classStart}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">Videos will appear here once added.</p>
                    {validTill && (
                      <p className="mt-3 text-xs text-slate-500">Valid till {formatDateLabel(validTill)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {allVideoCourses.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-white">
              वीडियो कोर्स <span className="text-slate-400">/ Video Courses</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allVideoCourses.map((pkg) => {
                const owned = ownedIds.has(pkg.id);
                const classStart = formatClassDate((pkg.metadata?.class_start as string | undefined) ?? undefined);
                return (
                  <div key={pkg.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white">{pkg.package_name}</h3>
                      {owned && (
                        <span className="flex-shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                          Enrolled
                        </span>
                      )}
                    </div>
                    {classStart && <p className="mt-1 text-xs text-yellow-400">Classes start {classStart}</p>}
                    {!owned && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{formatINR(getPriceInfo(pkg).amount)}</span>
                        <Link href="/test-platform/packages" className="text-xs font-medium text-yellow-500 hover:text-yellow-400">
                          View in store
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {notOwned.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              अपनी तैयारी पूरी करें <span className="text-slate-400">/ Complete Your Preparation</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notOwned.map((pkg) => (
                <div key={pkg.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <h3 className="text-sm font-semibold text-white">{pkg.package_name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{formatINR(getPriceInfo(pkg).amount)}</span>
                    <Link
                      href="/test-platform/packages"
                      className="text-xs font-medium text-yellow-500 hover:text-yellow-400"
                    >
                      View in store
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

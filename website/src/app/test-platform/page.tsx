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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
      <div className="mb-1.5 text-yellow-500">{icon}</div>
      <div className="text-lg font-bold text-white sm:text-xl">{value}</div>
      <div className="text-[11px] text-slate-400 sm:text-xs">{label}</div>
      {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

const TYPE_LABEL: Record<string, string> = {
  test_series: "टेस्ट सीरीज / Test Series",
  video_course: "वीडियो कोर्स / Video Course",
  mentorship: "मेंटरशिप / Mentorship",
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ukpscdecoded.in";
  const firstName = user.full_name?.split(" ")[0] || "";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-slate-400">
              नमस्ते, <span className="text-yellow-500">{firstName}</span>
            </p>
            <h1 className="text-2xl font-bold text-white">
              मेरे कोर्स <span className="text-slate-400">/ My Courses</span>
            </h1>
          </div>
          <LogoutButton />
        </div>

        {purchase === "success" && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>
              भुगतान सफल — आपका कोर्स सक्रिय है।{" "}
              <span className="text-green-400/80">/ Payment successful — your course is active.</span>
            </span>
          </div>
        )}
        {already === "owned" && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2.5 text-sm text-yellow-200">
            यह कोर्स आपके पास पहले से है। / You already own this course.
          </div>
        )}

        {myCourses.length === 0 ? (
          <div className="mb-8 rounded-2xl border border-dashed border-slate-700 bg-slate-800/40 p-6 text-center sm:p-8">
            <p className="text-slate-300">अभी कोई कोर्स नहीं है। / You haven&apos;t enrolled in a course yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-yellow-500 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-yellow-400"
            >
              कोर्स देखें / Browse Courses <ArrowRight className="h-4 w-4" />
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
                pkg.package_type === "test_series" && pkg.slug
                  ? `/test-platform/course/${pkg.slug}`
                  : pkg.slug
                    ? `/courses/${pkg.slug}`
                    : "/courses";
              return (
                <div key={pkg.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
                  <CourseThumb src={pkg.image_url} alt={pkg.package_name} className="h-20 w-full" />
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-medium text-yellow-500">{TYPE_LABEL[pkg.package_type] ?? pkg.package_type}</p>
                    <h2 className="mt-0.5 font-semibold text-white">{pkg.package_name}</h2>

                    {progress && (
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs text-slate-400">
                          <span>प्रगति / Progress</span>
                          <span>
                            {progress.testsDone} / {progress.totalTests} tests
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    {pkg.package_type === "video_course" && (
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                        <Video className="h-3.5 w-3.5 text-yellow-500" />
                        {classStart ? `Classes start ${classStart}` : "वीडियो जल्द / Videos coming soon"}
                      </p>
                    )}

                    {validTill && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" /> Valid till {formatDateLabel(validTill)}
                      </p>
                    )}

                    <Link
                      href={continueHref}
                      className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-yellow-400 sm:mt-auto"
                    >
                      जारी रखें / Continue <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatTile icon={<Target className="h-5 w-5" />} label="टेस्ट दिए / Tests Taken" value={String(testsTaken)} />
          <StatTile
            icon={<Trophy className="h-5 w-5" />}
            label="औसत / Average"
            value={avgScore != null ? `${avgScore.toFixed(1)}%` : "—"}
          />
          <StatTile
            icon={<Flame className="h-5 w-5" />}
            label="स्ट्रीक / Streak"
            value={`${stats.current_streak} day${stats.current_streak === 1 ? "" : "s"}`}
          />
          <StatTile icon={<Zap className="h-5 w-5" />} label="लेवल / Level" value={`Lvl ${stats.level}`} sub={`${stats.total_xp} XP`} />
        </div>

        {releasedFreeTests.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-bold text-white">
              मुफ़्त टेस्ट <span className="text-slate-400">/ Free Tests</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {releasedFreeTests.map((t) => (
                <Link
                  key={t.id}
                  href={`/test-platform/tests/${t.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-yellow-500/50"
                >
                  <Gift className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white group-hover:text-yellow-500">{t.test_name}</h3>
                    <p className="text-xs text-slate-400">
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
                और कोर्स देखें <span className="text-slate-400">/ Explore more courses</span>
              </h2>
              <Link href="/courses" className="flex-shrink-0 text-sm font-medium text-yellow-500 hover:text-yellow-400">
                सभी / All →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {explore.slice(0, 3).map((pkg: Package) => (
                <Link
                  key={pkg.id}
                  href={`/courses/${pkg.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-yellow-500/50"
                >
                  <span className="min-w-0 truncate text-sm font-semibold text-white">{pkg.package_name}</span>
                  <span className="flex-shrink-0 text-sm font-bold text-yellow-500">{formatINR(getPriceInfo(pkg).amount)}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/courses"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-yellow-500/50 px-4 py-3 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10"
            >
              सभी कोर्स देखें / Explore all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, FileQuestion, Lock, PlayCircle } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  formatDateLabel,
  getActivePackages,
  getOwnedPackageIds,
  getPackageBySlug,
  getPackageIncludes,
  getUserActiveEnrollments,
} from "@/lib/packages";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserTestSummaries, isTestReleased } from "@/lib/tests";

export const metadata: Metadata = { title: "My Tests", robots: { index: false } };

type Row = {
  id: string;
  test_name: string;
  subject: string | null;
  total_questions: number | null;
  duration_minutes: number | null;
  release_at: string | null;
  question_ids: string[] | null;
};

export default async function MyCourseTestsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect(`/student/login?next=${encodeURIComponent(`/test-platform/course/${slug}`)}`);

  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const [allPackages, includes, enrollments] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(user.id),
  ]);
  if (!getOwnedPackageIds(enrollments, includes, allPackages).has(pkg.id)) redirect(`/courses/${slug}`);

  const db = supabaseAdmin();
  const { data: links } = await db.from("package_tests").select("test_id, test_order").eq("package_id", pkg.id);
  const orderOf = new Map((links ?? []).map((l) => [l.test_id as string, Number(l.test_order ?? 0)]));
  const { data: testRows } = orderOf.size
    ? await db
        .from("tests")
        .select("id, test_name, subject, total_questions, duration_minutes, release_at, question_ids")
        .in("id", [...orderOf.keys()])
    : { data: [] as Row[] };
  const tests = ((testRows ?? []) as Row[]).sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0));

  const summaries = await getUserTestSummaries(
    user.id,
    tests.map((t) => t.id)
  );

  const ready = (t: Row) => isTestReleased(t) && (t.question_ids?.length ?? 0) > 0;
  const nextUp = tests.find((t) => ready(t) && !summaries.has(t.id));
  const done = tests.filter((t) => summaries.has(t.id)).length;

  // Group by subject, keeping first-appearance order (mocks → sectional → …).
  const groups: { subject: string; tests: Row[] }[] = [];
  for (const t of tests) {
    const key = t.subject || "Tests";
    let g = groups.find((x) => x.subject === key);
    if (!g) groups.push((g = { subject: key, tests: [] }));
    g.tests.push(t);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/test-platform" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-yellow-500">
          <ArrowLeft className="h-4 w-4" /> मेरे कोर्स / My Courses
        </Link>
        <h1 className="text-2xl font-bold text-white">{pkg.package_name}</h1>
        <p className="mt-1 text-sm text-slate-300">
          {done} / {tests.length} टेस्ट पूरे / tests completed
        </p>

        {nextUp && (
          <Link
            href={`/test-platform/tests/${nextUp.id}`}
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4 hover:bg-yellow-500/15"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-yellow-400">अगला टेस्ट / Up next</p>
              <p className="truncate font-semibold text-white">{nextUp.test_name}</p>
            </div>
            <PlayCircle className="h-8 w-8 flex-shrink-0 text-yellow-500" />
          </Link>
        )}

        {tests.length === 0 && (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-300">
            टेस्ट जल्द जोड़े जाएँगे। / Tests will be added soon.
          </p>
        )}

        {groups.map((g) => (
          <section key={g.subject} className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">{g.subject}</h2>
            <ul className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
              {g.tests.map((t) => {
                const s = summaries.get(t.id);
                const released = isTestReleased(t);
                const hasQuestions = (t.question_ids?.length ?? 0) > 0;
                const meta = (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" /> {t.total_questions ?? t.question_ids?.length ?? 0} Q
                    </span>
                    {t.duration_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {t.duration_minutes} min
                      </span>
                    )}
                  </span>
                );

                if (!released || !hasQuestions) {
                  return (
                    <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-slate-300">{t.test_name}</p>
                        {meta}
                      </div>
                      <span className="flex flex-shrink-0 items-center gap-1 text-right text-[11px] text-slate-300">
                        <Lock className="h-3 w-3" />
                        {!released ? formatDateLabel(t.release_at) : "जल्द / Soon"}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={t.id}>
                    <Link
                      href={s ? `/test-platform/attempts/${s.attemptId}/result` : `/test-platform/tests/${t.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-800/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{t.test_name}</p>
                        {meta}
                      </div>
                      {s ? (
                        <span className="flex flex-shrink-0 items-center gap-1 text-xs font-semibold text-green-400">
                          <CheckCircle2 className="h-4 w-4" /> {s.score}/{s.totalMarks}
                        </span>
                      ) : (
                        <span className="flex-shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-bold text-slate-900">
                          शुरू / Start
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

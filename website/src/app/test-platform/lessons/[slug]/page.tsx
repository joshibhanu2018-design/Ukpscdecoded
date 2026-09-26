import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  formatDateLabel,
  getActivePackages,
  getOwnedPackageIds,
  getPackageBySlug,
  getPackageIncludes,
  getUserActiveEnrollments,
} from "@/lib/packages";
import CrashCoursePlan from "@/components/CrashCoursePlan";
import { getPackageLessons, getWatchedLessonIds, isLessonReleased, recordLessonView } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "My Lessons",
  robots: { index: false },
};

export default async function LessonsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { slug } = await params;
  const { v } = await searchParams;
  const here = `/test-platform/lessons/${slug}`;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect(`/student/login?next=${encodeURIComponent(here)}`);

  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const isAdmin = user.role === "admin";
  if (!isAdmin) {
    const [allPackages, includes, enrollments] = await Promise.all([
      getActivePackages(),
      getPackageIncludes(),
      getUserActiveEnrollments(user.id),
    ]);
    if (!getOwnedPackageIds(enrollments, includes, allPackages).has(pkg.id)) redirect(`/courses/${slug}`);
  }

  const lessons = await getPackageLessons(pkg.id);
  const released = lessons.filter(isLessonReleased);
  // Only a lesson the student explicitly opened counts as watched (refund rule),
  // so the page never auto-plays one. Admin previews are not recorded.
  const current = v ? released.find((l) => l.id === v) : undefined;
  if (current && !isAdmin) await recordLessonView(user.id, current.id);

  const watched = await getWatchedLessonIds(
    user.id,
    lessons.map((l) => l.id),
  );
  const nextUp = !current ? released.find((l) => !watched.has(l.id)) : undefined;
  const classStart = formatDateLabel((pkg.metadata?.class_start as string | undefined) ?? undefined);

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/test-platform"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400"
        >
          <ArrowLeft className="h-4 w-4" /> My Courses
        </Link>
        <h1 className="text-2xl font-bold text-white">{pkg.package_name}</h1>
        <p className="mt-1 text-sm text-graphite-300">
          {watched.size} / {released.length} lessons watched
        </p>

        {current && (
          <div className="mt-5">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-graphite-800 bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${current.youtube_id}?rel=0&modestbranding=1`}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-white">{current.title}</h2>
            {current.description && (
              <p className="mt-1 whitespace-pre-line text-sm text-graphite-300">{current.description}</p>
            )}
          </div>
        )}

        {nextUp && (
          <Link
            href={`${here}?v=${nextUp.id}`}
            prefetch={false}
            className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-saffron-400/40 bg-saffron-400/10 p-4 hover:bg-saffron-400/15"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-saffron-300">Up next</p>
              <p className="truncate font-semibold text-white">{nextUp.title}</p>
            </div>
            <PlayCircle className="h-8 w-8 flex-shrink-0 text-saffron-400" />
          </Link>
        )}

        {lessons.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-graphite-700 p-6 text-center text-graphite-300">
            {classStart ? `Classes start ${classStart}. ` : ""}Lessons will appear here as they are uploaded.
          </p>
        ) : (
          <ul className="mt-8 divide-y divide-graphite-800 overflow-hidden rounded-2xl border border-graphite-800 bg-graphite-900/60">
            {lessons.map((l, i) => {
              const open = isLessonReleased(l);
              const isCurrent = current?.id === l.id;
              const body = (
                <>
                  <span className="w-6 flex-shrink-0 text-xs text-graphite-300">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm ${isCurrent ? "font-semibold text-saffron-300" : "text-white"}`}>
                      {l.title}
                    </span>
                    {!open && l.release_at && (
                      <span className="text-xs text-graphite-300">Available {formatDateLabel(l.release_at)}</span>
                    )}
                  </span>
                  {!open ? (
                    <Lock className="h-4 w-4 flex-shrink-0 text-graphite-300" />
                  ) : watched.has(l.id) ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-400" />
                  ) : (
                    <PlayCircle className="h-4 w-4 flex-shrink-0 text-saffron-400" />
                  )}
                </>
              );
              return (
                <li key={l.id}>
                  {open ? (
                    <Link
                      href={`${here}?v=${l.id}`}
                      prefetch={false}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-graphite-800/60 ${isCurrent ? "bg-saffron-400/5" : ""}`}
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 opacity-70">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10">
          <CrashCoursePlan collapsed />
        </div>
      </div>
    </div>
  );
}

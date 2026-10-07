import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileDown, Lock, PlayCircle } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { formatDateLabel, getPackageBySlug } from "@/lib/packages";
import CrashCoursePlan from "@/components/CrashCoursePlan";
import ProtectedPlayer from "@/components/ProtectedPlayer";
import VideoThumb from "@/components/VideoThumb";
import {
  bunnyEmbedUrl,
  bunnyThumbnailUrl,
  canAccessPackage,
  getPackageLessons,
  getWatchedLessonIds,
  isLessonReleased,
  recordLessonView,
  type Lesson,
} from "@/lib/lessons";

function playerSource(lesson: Lesson): { src: string; kind: "youtube" | "bunny" } | null {
  if (lesson.bunny_video_id) {
    const src = bunnyEmbedUrl(lesson.bunny_video_id);
    return src ? { src, kind: "bunny" } : null;
  }
  if (lesson.youtube_id) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${lesson.youtube_id}?rel=0&modestbranding=1&fs=0&iv_load_policy=3`,
      kind: "youtube",
    };
  }
  return null;
}

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
  if (!(await canAccessPackage(user, pkg.id))) redirect(`/courses/${slug}`);

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
  const source = current ? playerSource(current) : null;
  const watermark = [user.email, user.phone].filter(Boolean).join(" · ");
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
            {source ? (
              <ProtectedPlayer src={source.src} kind={source.kind} title={current.title} watermark={watermark} />
            ) : (
              <p className="rounded-2xl border border-dashed border-graphite-700 p-6 text-center text-sm text-graphite-300">
                This video can&apos;t play right now. Please try again later or contact us on Telegram.
              </p>
            )}
            <h2 className="mt-3 text-lg font-semibold text-white">{current.title}</h2>
            {current.description && (
              <p className="mt-1 whitespace-pre-line text-sm text-graphite-300">{current.description}</p>
            )}
            {(current.pdf_en_path || current.pdf_hi_path) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm text-graphite-300">Notes (PDF):</span>
                {current.pdf_en_path && (
                  <a
                    href={`/api/lessons/${current.id}/notes?lang=en`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-saffron-400/50 px-3 py-1.5 text-sm font-medium text-saffron-300 hover:bg-saffron-400/10"
                  >
                    <FileDown className="h-4 w-4" /> English
                  </a>
                )}
                {current.pdf_hi_path && (
                  <a
                    href={`/api/lessons/${current.id}/notes?lang=hi`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-saffron-400/50 px-3 py-1.5 text-sm font-medium text-saffron-300 hover:bg-saffron-400/10"
                  >
                    <FileDown className="h-4 w-4" /> हिंदी
                  </a>
                )}
              </div>
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
                  {l.bunny_video_id && (
                    <VideoThumb src={bunnyThumbnailUrl(l.bunny_video_id)} label={`${i + 1}`} className="w-20 sm:w-24" />
                  )}
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
          <CrashCoursePlan viewer={user} lessonsSlug={slug} />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { FileText, PlayCircle } from "lucide-react";
import { getCourseLessons, groupLessonsBySection, isLessonReleased, type Lesson } from "@/lib/lessons";

const hasVideo = (l: Lesson) => !!(l.bunny_video_id || l.youtube_id);

/**
 * A sectioned video course's full lesson list for the course page: every
 * lesson by title under its section, with "Coming soon" on the ones whose
 * video isn't up yet. Titles only; the videos open on the lessons page.
 */
export default async function CourseOutline({
  slug,
  viewer,
  heading,
}: {
  slug: string;
  viewer: { id: string; role: string } | null;
  heading?: string;
}) {
  const { pkg, lessons, canWatch } = await getCourseLessons(slug, viewer).catch(() => ({
    pkg: null,
    lessons: [] as Lesson[],
    canWatch: false,
  }));
  if (!pkg || lessons.length === 0) return null;

  const ready = lessons.filter((l) => hasVideo(l) && isLessonReleased(l)).length;
  let n = 0;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <PlayCircle className="h-5 w-5 text-saffron-400" /> {heading ?? "Course Outline"}
        </h2>
        <p className="text-xs text-graphite-300">
          {lessons.length} lessons · {ready} ready to watch
          {lessons.length > ready ? ` · ${lessons.length - ready} coming soon` : ""}
        </p>
      </div>
      <div className="space-y-5">
        {groupLessonsBySection(lessons).map((group) => (
          <div key={group.section ?? "lessons"}>
            {group.section && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-saffron-300">{group.section}</p>
            )}
            <ol className="divide-y divide-graphite-800 overflow-hidden rounded-xl border border-graphite-800 bg-graphite-900/60">
              {group.lessons.map((l) => {
                n += 1;
                const soon = !hasVideo(l) || !isLessonReleased(l);
                const notes = !!(l.pdf_en_path || l.pdf_hi_path);
                const sample = !canWatch && !soon && !!l.is_free;
                return (
                  <li key={l.id} className="flex items-start gap-3 px-4 py-2.5 text-sm">
                    <span className="w-6 flex-shrink-0 pt-0.5 text-xs text-graphite-400">{n}</span>
                    <span className="min-w-0 flex-1 text-graphite-200">
                      {l.title}
                      {sample && (
                        <Link
                          href={`/test-platform/lessons/${slug}?v=${l.id}`}
                          className="mt-1 flex w-fit items-center gap-1 text-xs font-semibold text-success-300 hover:text-success-400"
                        >
                          <PlayCircle className="h-3.5 w-3.5" /> Free sample · Watch now + PDF notes
                        </Link>
                      )}
                    </span>
                    <span className="flex flex-shrink-0 items-center gap-2 pt-0.5 text-xs">
                      {notes && (
                        <span className="flex items-center gap-1 text-graphite-400" title="PDF notes">
                          <FileText className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Notes</span>
                        </span>
                      )}
                      {soon && <span className="rounded-full bg-saffron-400/10 px-2 py-0.5 font-semibold text-saffron-300">Coming soon</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
      {canWatch && (
        <Link
          href={`/test-platform/lessons/${slug}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-saffron-300"
        >
          <PlayCircle className="h-4 w-4" /> Open the lessons
        </Link>
      )}
    </section>
  );
}

import Link from "next/link";
import { CalendarDays, CheckCircle2, Lock, PlayCircle, Radio } from "lucide-react";
import plan from "@content/crashCoursePlan.json";
import {
  bunnyThumbnailUrl,
  getCourseLessons,
  isLessonReleased,
  lessonVideoNumber,
  type Lesson,
} from "@/lib/lessons";
import { planLiveSessionDates, planVideoNumbers, SUBSET_COURSES } from "@/lib/course-subsets";
import VideoThumb from "./VideoThumb";

type PlanVideo = { date: string; number: number; module: string; title: string; book?: string };
type LiveSession = { date: string; theme: string; focus: string };

function dayLabel(iso: string, withWeekday = true): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(withWeekday ? { weekday: "short" } : {}),
    timeZone: "UTC",
  });
}

/**
 * The crash course's tentative release calendar (content/crashCoursePlan.json),
 * shown to everyone on the course pages and inside the lessons page. Uploaded
 * videos (lessons titled "Video N …" in `lessonsSlug`) show their Bunny
 * thumbnail; only students who own that course can open them.
 */
export default async function CrashCoursePlan({
  viewer,
  lessonsSlug = "crash-course",
  freeVideos = [],
}: {
  viewer: { id: string; role: string } | null;
  lessonsSlug?: string;
  /** The page's free demo videos (YouTube); one titled "Video N" — or named like plan video N — fills that slot. */
  freeVideos?: { title: string; youtubeId: string }[];
}) {
  // A subset course (e.g. National Crash Course) shows only its part of the plan.
  const variant = SUBSET_COURSES[lessonsSlug]?.variant ?? null;
  const videoNumbers = planVideoNumbers(variant);
  const liveDates = planLiveSessionDates(variant);
  const videos = (plan.videos as PlanVideo[]).filter((v) => videoNumbers.has(v.number));
  const live = (plan.liveSessions as LiveSession[]).filter((s) => liveDates.has(s.date));

  const { lessons, canWatch } = await getCourseLessons(lessonsSlug, viewer).catch(() => ({
    pkg: null,
    lessons: [] as Lesson[],
    canWatch: false,
  }));
  const lessonByNumber = new Map<number, Lesson>();
  for (const l of lessons) {
    const n = lessonVideoNumber(l.title);
    if (n !== null && !lessonByNumber.has(n)) lessonByNumber.set(n, l);
  }

  const thumbs = new Map(
    await Promise.all(
      [...lessonByNumber.values()].map(async (l) => [l.id, await bunnyThumbnailUrl(l.bunny_video_id)] as const),
    ),
  );
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const freeFor = (v: PlanVideo) =>
    freeVideos.find((f) => {
      const n = lessonVideoNumber(f.title);
      if (n !== null) return n === v.number;
      const a = norm(f.title);
      const b = norm(v.title);
      return a.length > 3 && (a.includes(b) || b.includes(a));
    });

  const liveByDate = new Map(live.map((s) => [s.date, s]));
  const byDate = new Map<string, PlanVideo[]>();
  for (const v of videos) byDate.set(v.date, [...(byDate.get(v.date) ?? []), v]);
  for (const s of live) if (!byDate.has(s.date)) byDate.set(s.date, []);
  const days = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  const liveDays = [...new Set(live.map((s) => new Date(`${s.date}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", timeZone: "UTC" })))];
  const liveWhen = liveDays.length === 1 ? `${liveDays[0]}s` : "Weekly";
  const revisionStart = new Date(Date.parse(`${plan.lastVideo}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
  const uploaded = videos.filter((v) => lessonByNumber.has(v.number) || freeFor(v)).length;

  const videoRow = (v: PlanVideo) => {
    const lesson = lessonByNumber.get(v.number);
    const free = freeFor(v);
    const open = !!lesson && isLessonReleased(lesson);
    const sampleLesson = open && !canWatch && !!lesson?.is_free;
    const playable = open && (canWatch || sampleLesson);
    const status = sampleLesson ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-300">
        <PlayCircle className="h-3.5 w-3.5" /> Free sample · Watch now + PDF notes
      </span>
    ) : free && !playable ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-300">
        <PlayCircle className="h-3.5 w-3.5" /> Free · Watch now
      </span>
    ) : playable ? (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-300">
        <PlayCircle className="h-3.5 w-3.5" /> Watch now
      </span>
    ) : open ? (
      <span className="inline-flex items-center gap-1 text-xs text-graphite-300">
        <Lock className="h-3.5 w-3.5" /> For enrolled students
      </span>
    ) : lesson ? (
      <span className="inline-flex items-center gap-1 text-xs text-success-300">
        <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded · releases {dayLabel(v.date)}
      </span>
    ) : null;
    const body = (
      <>
        <VideoThumb
          src={lesson ? (thumbs.get(lesson.id) ?? null) : free ? `https://i.ytimg.com/vi/${free.youtubeId}/hqdefault.jpg` : null}
          label={`Video ${v.number}`}
          className="w-28 sm:w-40"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-saffron-300">
            Video {v.number} · {v.module}
          </p>
          <p className="mt-0.5 text-sm font-semibold leading-snug text-white sm:text-base">{v.title}</p>
          {v.book && <p className="mt-0.5 text-xs text-graphite-300">Read: {v.book} (Uttarakhand Decoded)</p>}
          {status && <p className="mt-1">{status}</p>}
        </div>
      </>
    );
    return (
      <li key={v.number}>
        {free && !playable ? (
          <a href="#free-demo" className="flex items-start gap-3 rounded-xl p-2 hover:bg-graphite-800/60">
            {body}
          </a>
        ) : playable ? (
          <Link
            href={`/test-platform/lessons/${lessonsSlug}?v=${lesson!.id}`}
            prefetch={false}
            className="flex items-start gap-3 rounded-xl p-2 hover:bg-graphite-800/60"
          >
            {body}
          </Link>
        ) : (
          <div className="flex items-start gap-3 rounded-xl p-2">{body}</div>
        )}
      </li>
    );
  };

  return (
    <section>
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
        <CalendarDays className="h-5 w-5 text-saffron-400" /> Crash Course Plan
        <span className="rounded-full border border-saffron-400/40 px-2 py-0.5 text-[11px] font-medium text-saffron-300">
          Tentative
        </span>
      </h2>
      <p className="mb-4 text-xs text-graphite-300">
        Dates and topic order may change. Videos appear here with their thumbnail as they are uploaded
        {uploaded > 0 ? ` (${uploaded} of ${videos.length} so far)` : ""}.
        {variant === "national"
          ? " National topics only: no Uttarakhand GK or Uttarakhand current affairs."
          : " Uttarakhand videos show the matching chapter of the Uttarakhand Decoded book to read the same day."}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {[
          [`${videos.length} videos`, `${dayLabel(plan.firstVideo, false)} – ${dayLabel(plan.lastVideo, false)}`],
          [`${live.length} live sessions`, `${liveWhen}: doubts + extra content`],
          ["Revision + mocks", `${dayLabel(revisionStart, false)} – ${dayLabel(plan.examDate, false)}`],
          ["Upper PCS Prelims", dayLabel(plan.examDate, false)],
        ].map(([title, sub]) => (
          <div key={title} className="rounded-lg border border-graphite-800 bg-graphite-900/60 p-3">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-xs text-graphite-300">{sub}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-base font-bold text-white">Video schedule</h3>
      <ol className="space-y-3">
        {days.map(([date, vs]) => {
          const session = liveByDate.get(date);
          return (
            <li key={date} className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-2 sm:p-3">
              <p className="px-2 pb-1 pt-1 text-sm font-bold text-saffron-300">{dayLabel(date)}</p>
              <ul className="space-y-1">
                {vs.map(videoRow)}
                {session && (
                  <li className="mx-2 mb-1 flex items-start gap-2 rounded-lg bg-success-500/10 px-3 py-2 text-sm text-success-300">
                    <Radio className="mt-0.5 h-4 w-4 flex-shrink-0" /> Live session: {session.theme}
                  </li>
                )}
              </ul>
            </li>
          );
        })}
      </ol>

      <h3 className="mb-3 mt-8 text-base font-bold text-white">Live sessions</h3>
      <ul className="space-y-2">
        {live.map((s, i) => (
          <li key={s.date} className="rounded-lg border border-graphite-800 bg-graphite-900/60 px-4 py-3 text-sm">
            <p className="font-medium text-white">
              {i + 1}. {s.theme} <span className="text-xs font-normal text-saffron-300">· {dayLabel(s.date)}</span>
            </p>
            <p className="mt-0.5 text-xs text-graphite-300">{s.focus}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-graphite-300">{plan.revision}</p>
    </section>
  );
}

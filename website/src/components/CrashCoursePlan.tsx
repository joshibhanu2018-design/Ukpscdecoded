import Link from "next/link";
import { CheckCircle2, ListVideo, Lock, PlayCircle } from "lucide-react";
import plan from "@content/crashCoursePlan.json";
import {
  getCourseLessons,
  isLessonReleased,
  lessonThumbnailUrl,
  lessonVideoNumber,
  type Lesson,
} from "@/lib/lessons";
import { planLiveSessionDates, planVideoNumbers, SUBSET_COURSES } from "@/lib/course-subsets";
import VideoThumb from "./VideoThumb";

type PlanVideo = { date: string; number: number; module: string; title: string; book?: string };
type LiveSession = { date: string; theme: string; focus: string };

/**
 * The crash course's video list (content/crashCoursePlan.json), in study
 * order and grouped by subject, shown to everyone on the course pages and
 * inside the lessons page. No dates are shown: the course is sold all year,
 * so the dates in the JSON only keep the order. Uploaded
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
      [...lessonByNumber.values()].map(async (l) => [l.id, await lessonThumbnailUrl(l)] as const),
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

  // Study order: by video number, grouped under each subject as it first appears.
  const ordered = [...videos].sort((a, b) => a.number - b.number);
  const groups: { module: string; videos: PlanVideo[] }[] = [];
  for (const v of ordered) {
    const last = groups[groups.length - 1];
    if (last && last.module === v.module) last.videos.push(v);
    else groups.push({ module: v.module, videos: [v] });
  }
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
        <CheckCircle2 className="h-3.5 w-3.5" /> Coming soon
      </span>
    ) : null;
    const thumbSrc = lesson ? (thumbs.get(lesson.id) ?? null) : free ? `https://i.ytimg.com/vi/${free.youtubeId}/hqdefault.jpg` : null;
    const text = (
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-saffron-300">
          Video {v.number} · {v.module}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-white sm:text-base">{v.title}</p>
        {v.book && <p className="mt-0.5 text-xs text-graphite-300">Read: {v.book} (Uttarakhand Decoded)</p>}
        {status && <p className="mt-1">{status}</p>}
      </div>
    );
    // Uploaded (or free demo) videos: a large card with the full-width thumbnail, shown to everyone.
    // Not uploaded yet: a compact row, so the schedule stays short.
    const card = !!lesson || !!free;
    const body = card ? (
      <>
        <div className="relative">
          <VideoThumb src={thumbSrc} label="" className="w-full rounded-xl" />
          <span className="absolute left-2 top-2 rounded-md bg-graphite-950/80 px-2 py-0.5 text-xs font-bold text-white">
            Video {v.number}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-graphite-950/70 text-white ring-1 ring-white/30">
              {playable || free ? <PlayCircle className="h-7 w-7" /> : <Lock className="h-6 w-6" />}
            </span>
          </span>
        </div>
        <div className="px-1 pb-1 pt-2">{text}</div>
      </>
    ) : (
      <>
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-graphite-800 text-xs font-bold text-graphite-200">
          {v.number}
        </span>
        {text}
      </>
    );
    const cls = card
      ? "block overflow-hidden rounded-xl border border-graphite-800 bg-graphite-950/40 p-2 transition-colors hover:border-saffron-400/50"
      : "flex items-start gap-3 rounded-xl p-2";
    return (
      <li key={v.number} className={card ? "" : "sm:col-span-2"}>
        {free && !playable ? (
          <a href="#free-demo" className={cls}>
            {body}
          </a>
        ) : playable ? (
          <Link href={`/test-platform/lessons/${lessonsSlug}?v=${lesson!.id}`} prefetch={false} className={cls}>
            {body}
          </Link>
        ) : (
          <div className={cls}>{body}</div>
        )}
      </li>
    );
  };

  return (
    <section>
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
        <ListVideo className="h-5 w-5 text-saffron-400" /> Crash Course Plan
      </h2>
      <p className="mb-4 text-xs text-graphite-300">
        Watch the videos in this order, at your own pace
        {uploaded > 0 ? ` (${uploaded} of ${videos.length} uploaded)` : ""}.
        {variant === "national"
          ? " National topics only: no Uttarakhand GK or Uttarakhand current affairs."
          : " Uttarakhand videos show the matching chapter of the Uttarakhand Decoded book to read alongside."}
      </p>

      <div className="mb-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {[
          [`${videos.length} videos`, "Start any day, watch any time"],
          [`${live.length} live sessions`, "Doubts + extra content"],
          ["PDF notes", "With the video lectures"],
        ].map(([title, sub]) => (
          <div key={title} className="rounded-lg border border-graphite-800 bg-graphite-900/60 p-3">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-xs text-graphite-300">{sub}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-base font-bold text-white">Videos</h3>
      <ol className="space-y-3">
        {groups.map((g) => (
          <li key={`${g.module}-${g.videos[0].number}`} className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-2 sm:p-3">
            <p className="px-2 pb-1 pt-1 text-sm font-bold text-saffron-300">{g.module}</p>
            <ul className="grid gap-3 sm:grid-cols-2">{g.videos.map(videoRow)}</ul>
          </li>
        ))}
      </ol>

      {live.length > 0 && (
        <>
          <h3 className="mb-3 mt-8 text-base font-bold text-white">Live sessions</h3>
          <ul className="space-y-2">
            {live.map((s, i) => (
              <li key={s.date} className="rounded-lg border border-graphite-800 bg-graphite-900/60 px-4 py-3 text-sm">
                <p className="font-medium text-white">
                  {i + 1}. {s.theme}
                </p>
                <p className="mt-0.5 text-xs text-graphite-300">{s.focus}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

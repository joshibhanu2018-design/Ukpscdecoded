import { CalendarDays, Radio } from "lucide-react";
import plan from "@content/crashCoursePlan.json";

type PlanVideo = { date: string; number: number; module: string; title: string };
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
 * The crash course's tentative release calendar (content/crashCoursePlan.json):
 * 50 videos, 6 Sunday live sessions and the revision window before the exam.
 * Shown on the crash course / combo pages and inside the lessons page.
 */
export default function CrashCoursePlan({ collapsed = false }: { collapsed?: boolean }) {
  const videos = plan.videos as PlanVideo[];
  const live = plan.liveSessions as LiveSession[];
  const liveByDate = new Map(live.map((s) => [s.date, s]));
  const byDate = new Map<string, PlanVideo[]>();
  for (const v of videos) byDate.set(v.date, [...(byDate.get(v.date) ?? []), v]);
  for (const s of live) if (!byDate.has(s.date)) byDate.set(s.date, []);
  const days = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b));
  const revisionStart = new Date(Date.parse(`${plan.lastVideo}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);

  const schedule = (
    <ol className="space-y-2">
      {days.map(([date, vs]) => {
        const session = liveByDate.get(date);
        return (
          <li key={date} className="rounded-lg border border-graphite-800 bg-graphite-900/60 px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-saffron-300">{dayLabel(date)}</p>
            <ul className="space-y-1">
              {vs.map((v) => (
                <li key={v.number} className="text-sm text-graphite-200">
                  <span className="text-graphite-300">Video {v.number} · {v.module} —</span> {v.title}
                </li>
              ))}
              {session && (
                <li className="flex items-start gap-1.5 text-sm text-success-300">
                  <Radio className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> Live session: {session.theme}
                </li>
              )}
            </ul>
          </li>
        );
      })}
    </ol>
  );

  return (
    <section>
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
        <CalendarDays className="h-5 w-5 text-saffron-400" /> Crash Course Plan
        <span className="rounded-full border border-saffron-400/40 px-2 py-0.5 text-[11px] font-medium text-saffron-300">
          Tentative
        </span>
      </h2>
      <p className="mb-4 text-xs text-graphite-300">
        This is a tentative plan — dates and topic order may change. New lessons appear in your course as they are released.
      </p>

      <div className="mb-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {[
          [`${videos.length} videos`, `${dayLabel(plan.firstVideo, false)} – ${dayLabel(plan.lastVideo, false)}`],
          [`${live.length} live sessions`, "Sundays: doubts + extra content"],
          ["Revision + mocks", `${dayLabel(revisionStart, false)} – ${dayLabel(plan.examDate, false)}`],
          ["Upper PCS Prelims", dayLabel(plan.examDate, false)],
        ].map(([title, sub]) => (
          <div key={title} className="rounded-lg border border-graphite-800 bg-graphite-900/60 p-3">
            <p className="font-semibold text-white">{title}</p>
            <p className="text-xs text-graphite-300">{sub}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-white">Live sessions</h3>
      <ul className="mb-4 space-y-2">
        {live.map((s, i) => (
          <li key={s.date} className="rounded-lg border border-graphite-800 bg-graphite-900/60 px-4 py-3 text-sm">
            <p className="font-medium text-white">
              {i + 1}. {s.theme} <span className="text-xs font-normal text-saffron-300">· {dayLabel(s.date)}</span>
            </p>
            <p className="mt-0.5 text-xs text-graphite-300">{s.focus}</p>
          </li>
        ))}
      </ul>

      <details className="group" open={!collapsed}>
        <summary className="mb-2 cursor-pointer text-sm font-semibold text-white marker:text-saffron-400">
          Video schedule by date
        </summary>
        {schedule}
      </details>
      <p className="mt-3 text-xs text-graphite-300">{plan.revision}</p>
    </section>
  );
}

import plan from "@content/crashCoursePlan.json";

/**
 * Courses that are a part of another video course and share its lessons, so
 * a lesson is uploaded once: e.g. the National Crash Course = the national
 * videos and live sessions of the Crash Course (no Uttarakhand topics, no
 * Uttarakhand current affairs). Owning the source course also opens them.
 */
export type PlanVariant = "national";

export const SUBSET_COURSES: Record<string, { source: string; variant: PlanVariant }> = {
  "national-crash-course": { source: "crash-course", variant: "national" },
};

type PlanVideo = { number: number; module: string };
type LiveSession = { date: string; theme: string };

/** Uttarakhand-specific plan videos: the "UK …" modules, UK current affairs (40) and the combined UK + national CA (50). */
const UK_CA_VIDEOS = new Set([40, 50]);
const isUttarakhandVideo = (v: PlanVideo) => v.module.startsWith("UK ") || UK_CA_VIDEOS.has(v.number);
const isUttarakhandSession = (s: LiveSession) => /\b(UK|Uttarakhand)\b/.test(s.theme);

export function planVideoNumbers(variant: PlanVariant | null): Set<number> {
  const videos = plan.videos as PlanVideo[];
  return new Set((variant === "national" ? videos.filter((v) => !isUttarakhandVideo(v)) : videos).map((v) => v.number));
}

export function planLiveSessionDates(variant: PlanVariant | null): Set<string> {
  const live = plan.liveSessions as LiveSession[];
  return new Set((variant === "national" ? live.filter((s) => !isUttarakhandSession(s)) : live).map((s) => s.date));
}

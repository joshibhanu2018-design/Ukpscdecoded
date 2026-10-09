import plan from "@content/crashCoursePlan.json";

/**
 * Courses that are a part of another video course and share its lessons, so
 * a lesson is uploaded once (to the Crash Course) and appears in each:
 * - National Crash Course: the national videos and live sessions.
 * - Uttarakhand Crash Course: the Uttarakhand videos and live sessions.
 * Video 1 (orientation) and Video 50 (combined UK + national current
 * affairs) are in both. Owning the source course also opens them.
 */
export type PlanVariant = "national" | "uttarakhand";

export const SUBSET_COURSES: Record<string, { source: string; variant: PlanVariant }> = {
  "national-crash-course": { source: "crash-course", variant: "national" },
  "uttarakhand-crash-course": { source: "crash-course", variant: "uttarakhand" },
};

type PlanVideo = { number: number; module: string };
type LiveSession = { date: string; theme: string };

/** Videos in both subsets: orientation and the combined UK + national current affairs. */
const SHARED_VIDEOS = new Set([1, 50]);
/** Uttarakhand current affairs (its module is "Current Affairs", not "UK …"). */
const UK_CA_VIDEOS = new Set([40]);
const isUttarakhandVideo = (v: PlanVideo) => v.module.startsWith("UK ") || UK_CA_VIDEOS.has(v.number);
const isUttarakhandSession = (s: LiveSession) => /\b(UK|Uttarakhand)\b/.test(s.theme);
/** The final live session covers the current affairs videos of both parts (incl. 40 and 50). */
const isSharedSession = (s: LiveSession) => /current affairs/i.test(s.theme);

function inVariant(v: PlanVideo, variant: PlanVariant | null): boolean {
  if (!variant || SHARED_VIDEOS.has(v.number)) return true;
  return variant === "uttarakhand" ? isUttarakhandVideo(v) : !isUttarakhandVideo(v);
}

function sessionInVariant(s: LiveSession, variant: PlanVariant | null): boolean {
  if (!variant || isSharedSession(s)) return true;
  return variant === "uttarakhand" ? isUttarakhandSession(s) : !isUttarakhandSession(s);
}

export function planVideoNumbers(variant: PlanVariant | null): Set<number> {
  return new Set((plan.videos as PlanVideo[]).filter((v) => inVariant(v, variant)).map((v) => v.number));
}

export function planLiveSessionDates(variant: PlanVariant | null): Set<string> {
  return new Set((plan.liveSessions as LiveSession[]).filter((s) => sessionInVariant(s, variant)).map((s) => s.date));
}

import type { Package } from "./packages";

/**
 * Display helpers for course cards and course pages. Everything here reads
 * `packages.metadata` (set by seed-phase15-course-pages.sql), so wording
 * changes are SQL-only.
 */

/** Big header text on a course card / course hero when there's no image_url. */
export function courseHeader(pkg: Package): { title: string; tagline: string | null } {
  const meta = pkg.metadata ?? {};
  const title = typeof meta.card_title === "string" && meta.card_title.trim() ? meta.card_title.trim() : pkg.package_name;
  const tagline =
    typeof meta.card_tagline === "string" && meta.card_tagline.trim()
      ? meta.card_tagline.trim()
      : (pkg.description?.split(/\r?\n/)[0]?.trim() || null);
  return { title, tagline };
}

export type DemoVideo = { title: string; youtubeId: string };

// YouTube video IDs are 11 characters of [A-Za-z0-9_-]. Anything else in the
// metadata is ignored rather than put into an embed URL.
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** `packages.metadata.demo_videos`: [{ title, youtube_id }] — free preview videos until Bunny is set up. */
export function demoVideos(pkg: Package): DemoVideo[] {
  const raw = (pkg.metadata ?? {}).demo_videos;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((v) => {
    if (!v || typeof v !== "object") return [];
    const { title, youtube_id } = v as Record<string, unknown>;
    if (typeof youtube_id !== "string" || !YOUTUBE_ID.test(youtube_id.trim())) return [];
    return [{ title: typeof title === "string" && title.trim() ? title.trim() : "Free video", youtubeId: youtube_id.trim() }];
  });
}

/** Test-series tabs, in display order. `tests.subject` (and a "Sectional" test name) decides the tab. */
export const TEST_TABS = [
  { key: "full", label: "Full Length" },
  { key: "sectional", label: "Sectional" },
  { key: "uttarakhand", label: "Uttarakhand" },
  { key: "ca", label: "Current Affairs" },
  { key: "csat", label: "CSAT" },
  { key: "other", label: "Other" },
] as const;

export type TestTabKey = (typeof TEST_TABS)[number]["key"];

const SECTIONAL_SUBJECTS = new Set(["polity", "history", "geography", "science & tech", "economy & environment", "sectional"]);

/** The tab a test belongs to. A "… Sectional" test is sectional whatever its subject (Uttarakhand GK Sectional I/II). */
export function testTabOf(subject: string | null | undefined, testName?: string | null): TestTabKey {
  if (/\bsectional\b/i.test(testName ?? "")) return "sectional";
  const s = (subject ?? "").trim().toLowerCase();
  if (s === "full mock" || s === "full length") return "full";
  if (s.startsWith("uttarakhand")) return "uttarakhand";
  if (s.startsWith("current affairs")) return "ca";
  if (s === "csat") return "csat";
  if (SECTIONAL_SUBJECTS.has(s)) return "sectional";
  return "other";
}

/**
 * Tests split into tabs (empty tabs dropped), each tab keeping its subjects
 * as sub-groups in first-appearance order — so "Sectional" still shows
 * Polity / History / … and "Current Affairs" shows CA vs CA Revision.
 * `comingSoon`: no test in the tab has questions yet (CSAT today), so the
 * page shows "Coming soon" instead of a list of empty tests.
 */
export function groupTestsByTab<T extends { subject: string | null; test_name: string }>(
  tests: T[],
  questionCount: (t: T) => number
): { key: TestTabKey; label: string; count: number; comingSoon: boolean; groups: { subject: string; tests: T[] }[] }[] {
  return TEST_TABS.map((tab) => {
    const groups: { subject: string; tests: T[] }[] = [];
    for (const t of tests) {
      if (testTabOf(t.subject, t.test_name) !== tab.key) continue;
      const subject = t.subject?.trim() || "Tests";
      let g = groups.find((x) => x.subject === subject);
      if (!g) groups.push((g = { subject, tests: [] }));
      g.tests.push(t);
    }
    const all = groups.flatMap((g) => g.tests);
    return { ...tab, count: all.length, comingSoon: all.length > 0 && all.every((t) => questionCount(t) === 0), groups };
  }).filter((t) => t.count > 0);
}

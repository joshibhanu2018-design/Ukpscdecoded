import { createHash } from "crypto";
import { supabaseAdmin } from "./supabase";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, getUserActiveEnrollments } from "./packages";

export type Lesson = {
  id: string;
  package_id: string;
  title: string;
  description: string | null;
  youtube_id: string | null;
  bunny_video_id: string | null;
  pdf_en_path: string | null;
  pdf_hi_path: string | null;
  sort_order: number;
  release_at: string | null;
  is_active: boolean;
};

export const LESSON_COLUMNS =
  "id, package_id, title, description, youtube_id, bunny_video_id, pdf_en_path, pdf_hi_path, sort_order, release_at, is_active";

/** Private storage bucket for lesson PDFs (see supabase/schema-phase27-protected-lessons.sql). */
export const LESSON_NOTES_BUCKET = "lesson-notes";

export type NotesLang = "en" | "hi";
export const isNotesLang = (v: unknown): v is NotesLang => v === "en" || v === "hi";

const GUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** A Bunny Stream video id (GUID), from the bare id or any Bunny play/embed URL containing it. */
export function parseBunnyVideoId(input: string): string | null {
  return input.trim().match(GUID_RE)?.[0].toLowerCase() ?? null;
}

const BUNNY_LINK_TTL_S = 6 * 60 * 60;

/**
 * Bunny embed URL with token authentication: valid for a few hours and only
 * from the referrers allowed in the Bunny library, so a copied link stops
 * working. The lesson itself stays available; a fresh link is made per view.
 */
export function bunnyEmbedUrl(videoId: string): string | null {
  const library = process.env.BUNNY_STREAM_LIBRARY_ID;
  const key = process.env.BUNNY_STREAM_TOKEN_KEY;
  if (!library || !key) {
    console.error("[lessons] BUNNY_STREAM_LIBRARY_ID / BUNNY_STREAM_TOKEN_KEY not set; Bunny lessons cannot play.");
    return null;
  }
  const expires = Math.floor(Date.now() / 1000) + BUNNY_LINK_TTL_S;
  const token = createHash("sha256").update(key + videoId + expires).digest("hex");
  return `https://iframe.mediadelivery.net/embed/${library}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true&responsive=true`;
}

/** Whether a student owns the package (directly or through a bundle). Admins always can. */
export async function canAccessPackage(user: { id: string; role: string }, packageId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  const [allPackages, includes, enrollments] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(user.id),
  ]);
  return getOwnedPackageIds(enrollments, includes, allPackages).has(packageId);
}

/**
 * Accepts any YouTube link the admin is likely to paste (watch?v=, youtu.be/,
 * /live/, /embed/, /shorts/) or a bare 11-character video id.
 */
export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  let url: URL;
  try {
    url = new URL(s.startsWith("http") ? s : `https://${s}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:live|embed|shorts)\/([\w-]+)/)?.[1] ?? null;
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

export function isLessonReleased(lesson: Pick<Lesson, "release_at">): boolean {
  return !lesson.release_at || new Date(lesson.release_at).getTime() <= Date.now();
}

/** Active lessons of a package in display order (released and upcoming). */
export async function getPackageLessons(packageId: string): Promise<Lesson[]> {
  const { data } = await supabaseAdmin()
    .from("lessons")
    .select(LESSON_COLUMNS)
    .eq("package_id", packageId)
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at");
  return (data ?? []) as Lesson[];
}

/** Lesson ids this student has opened at least once. */
export async function getWatchedLessonIds(userId: string, lessonIds: string[]): Promise<Set<string>> {
  if (!lessonIds.length) return new Set();
  const { data } = await supabaseAdmin()
    .from("lesson_views")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

/** Records the first time a student opens a lesson; later opens are no-ops. */
export async function recordLessonView(userId: string, lessonId: string): Promise<void> {
  await supabaseAdmin()
    .from("lesson_views")
    .upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true });
}

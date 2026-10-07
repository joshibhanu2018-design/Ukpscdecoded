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
  /** Free sample: any logged-in student may watch it and get its notes (schema-phase29). */
  is_free?: boolean | null;
};

// "*" so pages keep working before supabase/schema-phase29-free-sample-lessons.sql adds is_free.
export const LESSON_COLUMNS = "*";

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
  // Trimmed: a space or line break pasted into Vercel would break every token.
  const library = process.env.BUNNY_STREAM_LIBRARY_ID?.trim();
  const key = process.env.BUNNY_STREAM_TOKEN_KEY?.trim();
  if (!library || !key) {
    console.error("[lessons] BUNNY_STREAM_LIBRARY_ID / BUNNY_STREAM_TOKEN_KEY not set; Bunny lessons cannot play.");
    return null;
  }
  const expires = Math.floor(Date.now() / 1000) + BUNNY_LINK_TTL_S;
  const token = createHash("sha256").update(key + videoId + expires).digest("hex");
  return `https://iframe.mediadelivery.net/embed/${library}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true&responsive=true`;
}

/**
 * A Bunny Stream video's current thumbnail, shown to everyone. Needs the
 * library's CDN hostname (Bunny → Stream → library → API → "CDN Hostname",
 * e.g. vz-1234abcd-567.b-cdn.net) in BUNNY_STREAM_CDN_HOST; unset → null.
 * A thumbnail uploaded in Bunny gets a new file name, so with the library API
 * key (BUNNY_STREAM_API_KEY) we ask Bunny for it (cached 10 minutes);
 * without the key, Bunny's automatic frame (thumbnail.jpg) is used.
 */
export async function bunnyThumbnailUrl(videoId: string | null): Promise<string | null> {
  const host = process.env.BUNNY_STREAM_CDN_HOST?.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (!host || !videoId) return null;
  let file = "thumbnail.jpg";
  const library = process.env.BUNNY_STREAM_LIBRARY_ID?.trim();
  const apiKey = process.env.BUNNY_STREAM_API_KEY?.trim();
  if (library && apiKey) {
    try {
      const res = await fetch(`https://video.bunnycdn.com/library/${library}/videos/${videoId}`, {
        headers: { AccessKey: apiKey, accept: "application/json" },
        next: { revalidate: 600 },
      });
      if (res.ok) {
        const info = (await res.json()) as { thumbnailFileName?: unknown };
        if (typeof info.thumbnailFileName === "string" && /^[\w.-]+$/.test(info.thumbnailFileName)) file = info.thumbnailFileName;
      }
    } catch {
      // Bunny API unreachable: fall back to the automatic frame.
    }
  }
  return `https://${host}/${videoId}/${file}`;
}

/** "Video 12: …" → 12: links an uploaded lesson to its slot in the crash course plan. */
export function lessonVideoNumber(title: string): number | null {
  const m = title.match(/\bvideo\s*(\d{1,3})\b/i);
  return m ? Number(m[1]) : null;
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

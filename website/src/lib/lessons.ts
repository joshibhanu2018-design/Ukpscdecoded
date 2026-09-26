import { supabaseAdmin } from "./supabase";

export type Lesson = {
  id: string;
  package_id: string;
  title: string;
  description: string | null;
  youtube_id: string;
  sort_order: number;
  release_at: string | null;
  is_active: boolean;
};

const LESSON_COLUMNS = "id, package_id, title, description, youtube_id, sort_order, release_at, is_active";

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

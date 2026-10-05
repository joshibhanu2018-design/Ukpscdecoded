import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { isNotesLang, LESSON_NOTES_BUCKET } from "@/lib/lessons";

/**
 * Lesson PDF notes (admin). The browser uploads straight to the private
 * bucket with a one-time signed upload URL (so big PDFs don't pass through
 * the website), then PATCH saves the path on the lesson.
 *   POST  { lesson_id, lang }            -> { path, token }
 *   PATCH { lesson_id, lang, path|null } -> saves it (null removes the notes)
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  if (typeof body.lesson_id !== "string" || !isNotesLang(body.lang)) {
    return NextResponse.json({ error: "lesson_id and lang (en/hi) are required" }, { status: 400 });
  }
  const path = `${body.lesson_id}/${body.lang}-${Date.now()}.pdf`;
  const { data, error } = await supabaseAdmin().storage.from(LESSON_NOTES_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json(
      { error: `Could not start upload: ${error?.message ?? "unknown"}. Has supabase/schema-phase27-protected-lessons.sql been run?` },
      { status: 500 },
    );
  }
  return NextResponse.json({ path: data.path, token: data.token });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  const lessonId = body.lesson_id;
  if (typeof lessonId !== "string" || !isNotesLang(body.lang)) {
    return NextResponse.json({ error: "lesson_id and lang (en/hi) are required" }, { status: 400 });
  }
  const path = body.path === null ? null : typeof body.path === "string" && body.path.startsWith(`${lessonId}/`) ? body.path : undefined;
  if (path === undefined) return NextResponse.json({ error: "Invalid file path" }, { status: 400 });

  const column = body.lang === "en" ? "pdf_en_path" : "pdf_hi_path";
  const db = supabaseAdmin();
  const { data: before } = await db.from("lessons").select(column).eq("id", lessonId).maybeSingle();
  const { error } = await db
    .from("lessons")
    .update({ [column]: path, updated_at: new Date().toISOString() })
    .eq("id", lessonId);
  if (error) return NextResponse.json({ error: `Could not save: ${error.message}` }, { status: 500 });

  // The replaced original is no longer linked anywhere.
  const old = (before as Record<string, string | null> | null)?.[column];
  if (old && old !== path) await db.storage.from(LESSON_NOTES_BUCKET).remove([old]);
  return NextResponse.json({ ok: true });
}

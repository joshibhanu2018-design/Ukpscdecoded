import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { parseYouTubeId } from "@/lib/lessons";
import { findUserIdByEmail, normalizeEmail } from "@/lib/otp";

/**
 * Video lessons admin. GET lists video courses with their lessons and view
 * counts; GET ?email= also returns how many lessons that student has watched
 * (the refund rule). POST adds a lesson; PATCH edits or hides one.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const db = supabaseAdmin();

  const { data: packages } = await db
    .from("packages")
    .select("id, package_name, slug")
    .eq("package_type", "video_course")
    .order("sort_order");

  const { data: lessons, error } = await db
    .from("lessons")
    .select("id, package_id, title, description, youtube_id, sort_order, release_at, is_active")
    .order("sort_order")
    .order("created_at");
  if (error) return NextResponse.json({ error: `Could not load lessons: ${error.message}` }, { status: 500 });

  const { data: views } = await db.from("lesson_views").select("lesson_id");
  const viewCount = new Map<string, number>();
  for (const v of views ?? []) viewCount.set(v.lesson_id, (viewCount.get(v.lesson_id) ?? 0) + 1);

  let student: { email: string; watched: number } | { email: string; notFound: true } | null = null;
  const email = req.nextUrl.searchParams.get("email");
  if (email) {
    const id = await findUserIdByEmail(normalizeEmail(email));
    if (!id) student = { email, notFound: true };
    else {
      const { count } = await db.from("lesson_views").select("lesson_id", { count: "exact", head: true }).eq("user_id", id);
      student = { email, watched: count ?? 0 };
    }
  }

  return NextResponse.json({
    packages: packages ?? [],
    lessons: (lessons ?? []).map((l) => ({ ...l, views: viewCount.get(l.id) ?? 0 })),
    student,
  });
}

type LessonInput = {
  id?: string;
  package_id?: string;
  title?: string;
  description?: string | null;
  youtube?: string;
  sort_order?: number;
  release_at?: string | null;
  is_active?: boolean;
};

function buildFields(body: LessonInput): { fields: Record<string, unknown> } | { error: string } {
  const fields: Record<string, unknown> = {};
  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title) return { error: "Title is required" };
    fields.title = title;
  }
  if (body.description !== undefined) fields.description = body.description?.trim() || null;
  if (body.youtube !== undefined) {
    const id = parseYouTubeId(body.youtube);
    if (!id) return { error: "That doesn't look like a YouTube link" };
    fields.youtube_id = id;
  }
  if (body.sort_order !== undefined) {
    if (!Number.isInteger(body.sort_order)) return { error: "Order must be a whole number" };
    fields.sort_order = body.sort_order;
  }
  if (body.release_at !== undefined) {
    if (body.release_at && Number.isNaN(new Date(body.release_at).getTime())) return { error: "Invalid release date" };
    fields.release_at = body.release_at || null;
  }
  if (body.is_active !== undefined) fields.is_active = Boolean(body.is_active);
  return { fields };
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as LessonInput;
  if (!body.package_id || !body.title || !body.youtube) {
    return NextResponse.json({ error: "Course, title and YouTube link are required" }, { status: 400 });
  }
  const built = buildFields(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });

  const db = supabaseAdmin();
  let sortOrder = built.fields.sort_order as number | undefined;
  if (sortOrder === undefined) {
    const { data: last } = await db
      .from("lessons")
      .select("sort_order")
      .eq("package_id", body.package_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    sortOrder = (last?.sort_order ?? 0) + 1;
  }

  const { data, error } = await db
    .from("lessons")
    .insert({ ...built.fields, package_id: body.package_id, sort_order: sortOrder })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: `Could not add lesson: ${error.message}` }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const body = (await req.json().catch(() => ({}))) as LessonInput;
  if (!body.id) return NextResponse.json({ error: "Lesson id is required" }, { status: 400 });
  const built = buildFields(body);
  if ("error" in built) return NextResponse.json({ error: built.error }, { status: 400 });

  const { error } = await supabaseAdmin()
    .from("lessons")
    .update({ ...built.fields, updated_at: new Date().toISOString() })
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: `Could not update lesson: ${error.message}` }, { status: 500 });
  return NextResponse.json({ ok: true });
}

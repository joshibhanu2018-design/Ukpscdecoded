import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { canAccessPackage, isLessonReleased, isNotesLang, LESSON_COLUMNS, LESSON_NOTES_BUCKET, type Lesson } from "@/lib/lessons";

export const maxDuration = 60;

async function stamp(pdfBytes: ArrayBuffer, label: string): Promise<Uint8Array> {
  // The standard PDF font only covers basic Latin; anything else becomes "?".
  const text = label.replace(/[^\x20-\x7E]/g, "?");
  const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    page.drawText(`Licensed to ${text} - UKPSC Decoded - do not share`, {
      x: 24,
      y: 12,
      size: 7,
      font,
      color: rgb(0.45, 0.45, 0.45),
    });
    page.drawText(text, {
      x: width * 0.18,
      y: height * 0.45,
      size: Math.max(12, Math.min(width, height) / 22),
      font,
      color: rgb(0.6, 0.6, 0.6),
      opacity: 0.12,
      rotate: degrees(30),
    });
  }
  return doc.save();
}

/**
 * Lesson notes download for a student who owns the course: a copy stamped
 * with their email/phone (made once, then reused), served through a
 * 5-minute signed link so the file itself is never public.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lang = req.nextUrl.searchParams.get("lang");
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) return NextResponse.redirect(new URL("/student/login", req.url));
  if (!isNotesLang(lang)) return NextResponse.json({ error: "Unknown language" }, { status: 400 });

  const db = supabaseAdmin();
  const { data } = await db.from("lessons").select(LESSON_COLUMNS).eq("id", lessonId).eq("is_active", true).maybeSingle();
  const lesson = data as Lesson | null;
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  if (!(await canAccessPackage(user, lesson.package_id))) {
    return NextResponse.json({ error: "Buy the course to download its notes" }, { status: 403 });
  }
  if (user.role !== "admin" && !isLessonReleased(lesson)) {
    return NextResponse.json({ error: "This lesson isn't released yet" }, { status: 403 });
  }

  const source = lang === "en" ? lesson.pdf_en_path : lesson.pdf_hi_path;
  if (!source) return NextResponse.json({ error: "No notes for this lesson yet" }, { status: 404 });

  const bucket = db.storage.from(LESSON_NOTES_BUCKET);
  // The source path carries its upload time, so replacing a PDF makes new stamped copies.
  const stampedPath = `stamped/${user.id}/${source.replaceAll("/", "_")}`;
  const fileName = `${lesson.title.replace(/[^\w\s-]/g, "").trim().slice(0, 60) || "notes"} - ${lang === "en" ? "English" : "Hindi"}.pdf`;
  const sign = () => bucket.createSignedUrl(stampedPath, 300, { download: fileName });

  let signed = await sign();
  if (!signed.data?.signedUrl) {
    const { data: original, error } = await bucket.download(source);
    if (error || !original) {
      console.error("[lesson-notes] Could not read", source, error?.message);
      return NextResponse.json({ error: "Notes are not available right now" }, { status: 500 });
    }
    const label = [user.email, user.phone].filter(Boolean).join("  ");
    let bytes: Uint8Array;
    try {
      bytes = await stamp(await original.arrayBuffer(), label);
    } catch (err) {
      console.error("[lesson-notes] Could not stamp", source, err);
      return NextResponse.json({ error: "Notes are not available right now" }, { status: 500 });
    }
    const up = await bucket.upload(stampedPath, bytes, { contentType: "application/pdf", upsert: true });
    if (up.error) {
      console.error("[lesson-notes] Could not save stamped copy", up.error.message);
      return NextResponse.json({ error: "Notes are not available right now" }, { status: 500 });
    }
    signed = await sign();
  }
  if (!signed.data?.signedUrl) return NextResponse.json({ error: "Notes are not available right now" }, { status: 500 });
  return NextResponse.redirect(signed.data.signedUrl);
}

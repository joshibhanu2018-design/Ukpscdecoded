import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const db = supabaseAdmin();
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const [bookings, windows, blocked, link] = await Promise.all([
    db
      .from("mentor_bookings")
      .select("id, user_id, slot_start, slot_end, status, student_note, mentor_notes, users(full_name, email, phone)")
      .gte("slot_start", since)
      .neq("status", "cancelled")
      .order("slot_start"),
    db.from("mentor_availability").select("id, weekday, start_time, end_time, slot_minutes").order("weekday").order("start_time"),
    db.from("mentor_blocked_dates").select("day, note").gte("day", new Date().toISOString().slice(0, 10)).order("day"),
    db.from("app_settings").select("value").eq("key", "mentor_meet_link").maybeSingle(),
  ]);
  if (bookings.error || windows.error) {
    console.error("[admin/mentorship] load failed:", bookings.error ?? windows.error);
    return NextResponse.json({ error: "Could not load" }, { status: 500 });
  }
  return NextResponse.json({
    bookings: bookings.data,
    windows: windows.data,
    blocked: blocked.data ?? [],
    meetLink: link.data?.value ?? "",
  });
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = new Set(["booked", "completed", "no_show", "cancelled"]);

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const b = await request.json().catch(() => null);
  const db = supabaseAdmin();
  const fail = (error: string) => NextResponse.json({ error }, { status: 400 });
  let result;

  switch (b?.action) {
    case "set_link": {
      const url = String(b.value ?? "").trim();
      if (url && !/^https:\/\//.test(url)) return fail("Link must start with https://");
      result = await db.from("app_settings").upsert({ key: "mentor_meet_link", value: url, updated_at: new Date().toISOString() });
      break;
    }
    case "add_window": {
      const weekday = Number(b.weekday);
      const slot = Number(b.slot_minutes ?? 20);
      if (!(weekday >= 0 && weekday <= 6) || !TIME_RE.test(b.start_time) || !TIME_RE.test(b.end_time) || b.end_time <= b.start_time) {
        return fail("Pick a day and a start time before the end time");
      }
      if (!(slot >= 10 && slot <= 120)) return fail("Slot length must be 10–120 minutes");
      result = await db.from("mentor_availability").insert({ weekday, start_time: b.start_time, end_time: b.end_time, slot_minutes: slot });
      break;
    }
    case "remove_window":
      result = await db.from("mentor_availability").delete().eq("id", String(b.id));
      break;
    case "block_date":
      if (!DATE_RE.test(b.day)) return fail("Invalid date");
      result = await db.from("mentor_blocked_dates").upsert({ day: b.day, note: b.note ? String(b.note).slice(0, 200) : null });
      break;
    case "unblock_date":
      result = await db.from("mentor_blocked_dates").delete().eq("day", String(b.day));
      break;
    case "update_booking": {
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (b.status !== undefined) {
        if (!STATUSES.has(b.status)) return fail("Invalid status");
        patch.status = b.status;
      }
      if (b.mentor_notes !== undefined) patch.mentor_notes = String(b.mentor_notes).slice(0, 5000);
      result = await db.from("mentor_bookings").update(patch).eq("id", String(b.id));
      break;
    }
    default:
      return fail("Unknown action");
  }

  if (result.error) {
    console.error("[admin/mentorship] action failed:", b?.action, result.error);
    return NextResponse.json({ error: result.error.code === "23505" ? "That already exists" : "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

import { supabaseAdmin } from "./supabase";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, getUserActiveEnrollments } from "./packages";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
export const BOOKING_WINDOW_DAYS = 14; // how far ahead students can book
export const MIN_NOTICE_MS = 2 * 60 * 60 * 1000; // no booking a slot starting within 2 hours
export const CANCEL_NOTICE_MS = 12 * 60 * 60 * 1000; // students can cancel up to 12 hours before

export type Availability = { id: string; weekday: number; start_time: string; end_time: string; slot_minutes: number };
export type Slot = { start: string; end: string; taken: boolean };
export type Booking = {
  id: string;
  user_id: string;
  slot_start: string;
  slot_end: string;
  status: "booked" | "cancelled" | "completed" | "no_show";
  student_note: string | null;
  mentor_notes: string | null;
};

/** IST calendar date ("2026-10-01") of an instant. */
export function istDate(ms: number): string {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Monday (IST) of the week containing this instant — the "one booking per week" key. */
export function istWeekStart(ms: number): string {
  const d = new Date(ms + IST_OFFSET_MS);
  const day = d.getUTCDay(); // weekday in IST, since we shifted by the offset
  const diff = (day + 6) % 7; // days since Monday
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - diff)).toISOString().slice(0, 10);
}

/** "2026-10-01" + "10:20" (IST) → UTC instant. */
function istToUtc(date: string, time: string): number {
  return new Date(`${date}T${time.slice(0, 5)}:00+05:30`).getTime();
}

/** Whether this user owns a mentorship package (directly or via a bundle). */
export async function isMentee(userId: string): Promise<boolean> {
  const [packages, includes, enrollments] = await Promise.all([
    getActivePackages(),
    getPackageIncludes(),
    getUserActiveEnrollments(userId),
  ]);
  const owned = getOwnedPackageIds(enrollments, includes, packages);
  return packages.some((p) => p.package_type === "mentorship" && owned.has(p.id));
}

/**
 * Every bookable slot in the next BOOKING_WINDOW_DAYS, from the weekly
 * availability windows, minus blocked days and slots starting too soon.
 * `taken` marks slots someone already booked.
 */
export async function getSlots(now = Date.now()): Promise<Slot[]> {
  const db = supabaseAdmin();
  const until = now + BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const [{ data: windows }, { data: blocked }, { data: booked }] = await Promise.all([
    db.from("mentor_availability").select("id, weekday, start_time, end_time, slot_minutes"),
    db.from("mentor_blocked_dates").select("day").gte("day", istDate(now)),
    db
      .from("mentor_bookings")
      .select("slot_start")
      .eq("status", "booked")
      .gte("slot_start", new Date(now).toISOString())
      .lte("slot_start", new Date(until).toISOString()),
  ]);

  const blockedDays = new Set((blocked ?? []).map((b) => b.day as string));
  const takenAt = new Set((booked ?? []).map((b) => new Date(b.slot_start as string).getTime()));
  const slots: Slot[] = [];

  for (let d = 0; d <= BOOKING_WINDOW_DAYS; d++) {
    const date = istDate(now + d * 24 * 60 * 60 * 1000);
    if (blockedDays.has(date)) continue;
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    for (const w of (windows ?? []) as Availability[]) {
      if (w.weekday !== weekday) continue;
      const end = istToUtc(date, w.end_time);
      const step = w.slot_minutes * 60 * 1000;
      for (let t = istToUtc(date, w.start_time); t + step <= end; t += step) {
        if (t < now + MIN_NOTICE_MS || t > until) continue;
        slots.push({ start: new Date(t).toISOString(), end: new Date(t + step).toISOString(), taken: takenAt.has(t) });
      }
    }
  }
  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data } = await supabaseAdmin()
    .from("mentor_bookings")
    .select("id, user_id, slot_start, slot_end, status, student_note, mentor_notes")
    .eq("user_id", userId)
    .order("slot_start", { ascending: false });
  return (data ?? []) as Booking[];
}

export async function getSetting(key: string): Promise<string | null> {
  const { data } = await supabaseAdmin().from("app_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as string | null) ?? null;
}

export type BookResult = { ok: true; id: string } | { ok: false; error: string; status: number };

/**
 * Books a slot, first come first served. The slot must be one getSlots()
 * offers right now; the database's unique indexes are the real guard —
 * if two students click the same slot together, exactly one insert wins.
 */
export async function bookSlot(userId: string, slotStart: string, note: string | null): Promise<BookResult> {
  const start = new Date(slotStart).getTime();
  if (Number.isNaN(start)) return { ok: false, error: "Invalid slot", status: 400 };

  const slot = (await getSlots()).find((s) => new Date(s.start).getTime() === start);
  if (!slot) return { ok: false, error: "This slot isn't available.", status: 400 };
  if (slot.taken) return { ok: false, error: "Someone just booked this slot — pick another.", status: 409 };

  const { data, error } = await supabaseAdmin()
    .from("mentor_bookings")
    .insert({
      user_id: userId,
      slot_start: slot.start,
      slot_end: slot.end,
      week_start: istWeekStart(start),
      student_note: note?.trim().slice(0, 500) || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const perWeek = error.message.includes("one_per_week");
      return {
        ok: false,
        status: 409,
        error: perWeek
          ? "You already have a session booked this week."
          : "Someone just booked this slot — pick another.",
      };
    }
    console.error("[mentorship] booking insert failed:", error);
    return { ok: false, error: "Could not book. Please try again.", status: 500 };
  }
  return { ok: true, id: data.id };
}

export async function cancelBooking(userId: string, bookingId: string, now = Date.now()): Promise<BookResult> {
  const db = supabaseAdmin();
  const { data: b } = await db
    .from("mentor_bookings")
    .select("id, slot_start, status")
    .eq("id", bookingId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!b || b.status !== "booked") return { ok: false, error: "Booking not found", status: 404 };
  if (new Date(b.slot_start).getTime() - now < CANCEL_NOTICE_MS) {
    return { ok: false, error: "You can cancel up to 12 hours before the session.", status: 409 };
  }
  const { error } = await db
    .from("mentor_bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", b.id)
    .eq("status", "booked");
  if (error) return { ok: false, error: "Could not cancel", status: 500 };
  return { ok: true, id: b.id };
}

export function formatSlotIST(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  id: string;
  user_id: string;
  slot_start: string;
  status: string;
  student_note: string | null;
  mentor_notes: string | null;
  users: { full_name: string | null; email: string; phone: string | null } | null;
};
type Window = { id: string; weekday: number; start_time: string; end_time: string; slot_minutes: number };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const input = "rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none focus:border-saffron-400";
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function AdminMentorshipPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [windows, setWindows] = useState<Window[]>([]);
  const [blocked, setBlocked] = useState<{ day: string; note: string | null }[]>([]);
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [win, setWin] = useState({ weekday: "3", start_time: "10:00", end_time: "12:00", slot_minutes: "20" });
  const [block, setBlock] = useState({ day: "", note: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/mentorship");
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg({ ok: false, text: d.error || "Could not load" });
    setBookings(d.bookings);
    setWindows(d.windows);
    setBlocked(d.blocked);
    setLink(d.meetLink);
    setNotes(Object.fromEntries((d.bookings as Booking[]).map((b) => [b.id, b.mentor_notes ?? ""])));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (body: Record<string, unknown>, okText: string) => {
    setMsg(null);
    const res = await fetch("/api/admin/mentorship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json().catch(() => ({}));
    setMsg(res.ok ? { ok: true, text: okText } : { ok: false, text: d.error || "Failed" });
    if (res.ok) void load();
  };

  const now = Date.now();
  const upcoming = bookings.filter((b) => b.status === "booked" && new Date(b.slot_start).getTime() > now - 30 * 60 * 1000);
  const recent = bookings.filter((b) => !upcoming.includes(b)).reverse();

  // A render function, not a nested component: a component defined here would
  // remount on every keystroke and the notes box would lose focus.
  const bookingCard = (b: Booking) => (
    <li key={b.id} className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-white">{when(b.slot_start)}</p>
          <p className="text-graphite-300">
            {b.users?.full_name} · {b.users?.email}
            {b.users?.phone && ` · ${b.users.phone}`}
          </p>
          {b.student_note && <p className="mt-1 text-xs text-graphite-300">Topic: {b.student_note}</p>}
        </div>
        <Link href={`/test-platform/performance?user=${b.user_id}`} className="text-xs text-saffron-300 hover:underline">
          Performance →
        </Link>
      </div>
      <textarea
        value={notes[b.id] ?? ""}
        onChange={(e) => setNotes((n) => ({ ...n, [b.id]: e.target.value }))}
        rows={3}
        placeholder="Written plan for the student: planned vs done, test analysis, next week's plan, blockers…"
        className={`${input} mt-3 w-full`}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button onClick={() => act({ action: "update_booking", id: b.id, mentor_notes: notes[b.id] ?? "" }, "Plan saved")} className="rounded-lg bg-saffron-400 px-3 py-1.5 text-xs font-semibold text-graphite-900">
          Save plan
        </button>
        <button onClick={() => act({ action: "update_booking", id: b.id, status: "completed", mentor_notes: notes[b.id] ?? "" }, "Marked completed")} className="rounded-lg border border-success-500/40 px-3 py-1.5 text-xs text-success-300">
          Completed
        </button>
        <button onClick={() => act({ action: "update_booking", id: b.id, status: "no_show" }, "Marked no-show")} className="rounded-lg border border-graphite-700 px-3 py-1.5 text-xs text-graphite-300">
          No-show
        </button>
        {b.status === "booked" && (
          <button
            onClick={() => confirm("Cancel this booking? The slot opens up again.") && act({ action: "update_booking", id: b.id, status: "cancelled" }, "Cancelled")}
            className="rounded-lg border border-danger-500/40 px-3 py-1.5 text-xs text-danger-300"
          >
            Cancel
          </button>
        )}
        <span className="self-center text-[11px] capitalize text-graphite-300">{b.status.replace("_", "-")}</span>
      </div>
    </li>
  );

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform/admin" className="text-sm text-graphite-300 hover:text-saffron-400">
          ← Admin
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Mentorship sessions</h1>
        {msg && <p className={`mt-3 text-sm ${msg.ok ? "text-success-300" : "text-danger-300"}`}>{msg.text}</p>}

        <section className="mt-6">
          <h2 className="mb-3 font-semibold text-white">Upcoming ({upcoming.length})</h2>
          {upcoming.length === 0 ? <p className="text-sm text-graphite-300">No upcoming bookings.</p> : <ul className="space-y-3">{upcoming.map(bookingCard)}</ul>}
        </section>

        <section className="mt-8 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
          <h2 className="font-semibold text-white">Meeting link</h2>
          <p className="mt-1 text-xs text-graphite-300">One fixed Google Meet / Zoom link, shown to students with a booking.</p>
          <div className="mt-3 flex gap-2">
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" className={`${input} min-w-0 flex-1`} />
            <button onClick={() => act({ action: "set_link", value: link }, "Link saved")} className="rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-graphite-900">
              Save
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
          <h2 className="font-semibold text-white">Weekly availability (IST)</h2>
          <ul className="mt-3 divide-y divide-graphite-800 text-sm">
            {windows.map((w) => (
              <li key={w.id} className="flex items-center justify-between py-2 text-graphite-300">
                <span>
                  {DAYS[w.weekday]} {w.start_time.slice(0, 5)}–{w.end_time.slice(0, 5)} · {w.slot_minutes}-min slots
                </span>
                <button onClick={() => act({ action: "remove_window", id: w.id }, "Removed")} className="text-xs text-danger-300">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <select value={win.weekday} onChange={(e) => setWin({ ...win, weekday: e.target.value })} className={input}>
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
            <input type="time" value={win.start_time} onChange={(e) => setWin({ ...win, start_time: e.target.value })} className={input} />
            <input type="time" value={win.end_time} onChange={(e) => setWin({ ...win, end_time: e.target.value })} className={input} />
            <input type="number" min={10} max={120} value={win.slot_minutes} onChange={(e) => setWin({ ...win, slot_minutes: e.target.value })} className={`${input} w-20`} />
            <button onClick={() => act({ action: "add_window", ...win, weekday: Number(win.weekday), slot_minutes: Number(win.slot_minutes) }, "Window added")} className="rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-graphite-900">
              Add
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
          <h2 className="font-semibold text-white">Days off</h2>
          <ul className="mt-3 text-sm text-graphite-300">
            {blocked.map((d) => (
              <li key={d.day} className="flex items-center justify-between py-1">
                <span>
                  {d.day} {d.note && <span className="text-graphite-300">· {d.note}</span>}
                </span>
                <button onClick={() => act({ action: "unblock_date", day: d.day }, "Unblocked")} className="text-xs text-danger-300">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <input type="date" value={block.day} onChange={(e) => setBlock({ ...block, day: e.target.value })} className={input} />
            <input value={block.note} onChange={(e) => setBlock({ ...block, note: e.target.value })} placeholder="Reason (optional)" className={`${input} min-w-0 flex-1`} />
            <button onClick={() => block.day && act({ action: "block_date", ...block }, "Day blocked")} className="rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-graphite-900">
              Block day
            </button>
          </div>
          <p className="mt-2 text-[11px] text-graphite-300">Blocking a day hides its slots; existing bookings that day stay — cancel them above if needed.</p>
        </section>

        {recent.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-semibold text-white">Recent (last 2 weeks)</h2>
            <ul className="space-y-3">{recent.map(bookingCard)}</ul>
          </section>
        )}
      </div>
    </div>
  );
}

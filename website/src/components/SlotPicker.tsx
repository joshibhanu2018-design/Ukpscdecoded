"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Slot = { start: string; end: string; taken: boolean };

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "short" });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });

export default function SlotPicker({ slots }: { slots: Slot[] }) {
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = new Map<string, Slot[]>();
  for (const s of slots) {
    const k = dayLabel(s.start);
    days.set(k, [...(days.get(k) ?? []), s]);
  }

  const book = async () => {
    if (!picked) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/mentorship/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_start: picked, note }),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    if (!res?.ok) {
      setError(data?.error || "Network error — try again.");
      router.refresh(); // slot list may have changed
      return;
    }
    router.refresh();
  };

  if (slots.length === 0) {
    return <p className="text-sm text-graphite-300">No open slots right now — check back soon.</p>;
  }

  return (
    <div>
      {[...days.entries()].map(([day, list]) => (
        <div key={day} className="mb-4">
          <p className="mb-2 text-sm font-medium text-graphite-300">{day}</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {list.map((s) => (
              <button
                key={s.start}
                disabled={s.taken}
                onClick={() => setPicked(s.start)}
                className={`rounded-lg border px-2 py-2 text-sm ${
                  s.taken
                    ? "cursor-not-allowed border-graphite-800 text-graphite-600 line-through"
                    : picked === s.start
                      ? "border-saffron-400 bg-saffron-400 font-semibold text-graphite-900"
                      : "border-graphite-700 text-graphite-200 hover:border-saffron-400/60"
                }`}
              >
                {timeLabel(s.start)}
              </button>
            ))}
          </div>
        </div>
      ))}
      {picked && (
        <div className="mt-4 space-y-3 rounded-xl border border-graphite-800 bg-graphite-900 p-4">
          <p className="text-sm text-white">
            Selected: {dayLabel(picked)}, {timeLabel(picked)} <span className="text-graphite-300">(20 min)</span>
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder="What do you want to discuss? (optional)"
            className="w-full rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none focus:border-saffron-400"
          />
          {error && <p className="text-sm text-danger-300">{error}</p>}
          <button
            onClick={book}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-400 py-3 text-sm font-bold text-graphite-900 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Book this slot
          </button>
        </div>
      )}
      {!picked && error && <p className="text-sm text-danger-300">{error}</p>}
    </div>
  );
}

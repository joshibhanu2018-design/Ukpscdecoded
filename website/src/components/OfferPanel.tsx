"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Megaphone } from "lucide-react";

type Status = {
  offer: { code: string; percent_off: number; expires_at: string } | null;
  total?: number;
  optedOut?: number;
  sent?: number;
  remaining?: number;
  error?: string;
};

const input =
  "rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none focus:border-saffron-400";
const primary = "rounded-lg bg-saffron-400 px-4 py-2 text-sm font-semibold text-graphite-900 hover:bg-saffron-300 disabled:opacity-60";
const secondary = "rounded-lg border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400 disabled:opacity-60";

/** Admin: create the 2-day universal offer code (shown site-wide) and email it to every student. */
export default function OfferPanel({ onCreated }: { onCreated: () => void }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(20);
  const [hours, setHours] = useState(48);
  const [batch, setBatch] = useState(80);
  const [busy, setBusy] = useState<null | "create" | "test" | "send">(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/offer-email");
    setStatus(await res.json().catch(() => ({ offer: null, error: "Could not load" })));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const call = async (kind: "create" | "test" | "send", url: string, body: unknown) => {
    setBusy(kind);
    setMessage(null);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ ok: false, text: data.error || "Failed." });
        return;
      }
      if (kind === "create") {
        setMessage({ ok: true, text: `Offer ${data.code} is live on the website.` });
        setCode("");
        onCreated();
      } else if (kind === "test") setMessage({ ok: true, text: `Test email sent to ${data.sentTo}. Check the inbox (and spam).` });
      else setMessage({ ok: true, text: `Sent to ${data.sent} students. ${data.left} left.` });
      await load();
    } finally {
      setBusy(null);
    }
  };

  const offer = status?.offer;
  const ends = offer
    ? new Date(offer.expires_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div className="mb-6 rounded-2xl border border-saffron-400/40 bg-graphite-900/60 p-6 shadow-xl">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
        <Megaphone className="h-5 w-5 text-saffron-400" /> Universal offer (all students)
      </h2>
      <p className="mb-4 text-xs text-graphite-300">
        One code for everyone, % off any course or test series, once per student. While it runs, a bar at the top of the website
        shows the code and a countdown, and checkout fills it in automatically. Not for books.
      </p>

      {offer ? (
        <div className="mb-4 rounded-lg border border-success-500/30 bg-success-500/10 p-3 text-sm text-success-300">
          Running: <b className="font-mono">{offer.code}</b> — {offer.percent_off}% off, ends {ends}.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void call("create", "/api/admin/coupons", { mode: "offer", code, percent_off: percent, hours });
          }}
          className="mb-2 flex flex-wrap items-end gap-3"
        >
          <div>
            <label className="mb-1 block text-xs text-graphite-300">Code</label>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DIWALI20" className={input} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-graphite-300">% off</label>
            <input type="number" min={1} max={90} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className={`${input} w-20`} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-graphite-300">Runs for (hours)</label>
            <input type="number" min={1} max={336} value={hours} onChange={(e) => setHours(Number(e.target.value))} className={`${input} w-24`} />
          </div>
          <button type="submit" disabled={busy !== null || !code.trim()} className={primary}>
            {busy === "create" ? "Creating…" : "Start offer"}
          </button>
        </form>
      )}

      {offer && (
        <div className="border-t border-graphite-800 pt-4">
          <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-white">
            <Mail className="h-4 w-4 text-saffron-400" /> Email this offer to students
          </h3>
          {status?.error ? (
            <p className="text-sm text-danger-400">{status.error}</p>
          ) : (
            <p className="mb-3 text-xs text-graphite-300">
              {status?.total ?? 0} students · {status?.sent ?? 0} already emailed · {status?.optedOut ?? 0} unsubscribed ·{" "}
              <b className="text-white">{status?.remaining ?? 0} left</b>. Nobody is emailed twice for the same offer.
            </p>
          )}
          <div className="flex flex-wrap items-end gap-3">
            <button onClick={() => void call("test", "/api/admin/offer-email", { action: "test" })} disabled={busy !== null} className={secondary}>
              {busy === "test" ? "Sending…" : "1. Send a test to me"}
            </button>
            <div>
              <label className="mb-1 block text-xs text-graphite-300">How many now (max 100)</label>
              <input type="number" min={1} max={100} value={batch} onChange={(e) => setBatch(Number(e.target.value))} className={`${input} w-24`} />
            </div>
            <button
              onClick={() => {
                if (confirm(`Email the offer to the next ${batch} students?`)) void call("send", "/api/admin/offer-email", { limit: batch });
              }}
              disabled={busy !== null || !status?.remaining}
              className={primary}
            >
              {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin" /> : `2. Send to next ${batch}`}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-graphite-400">
            Resend&apos;s free plan allows 100 emails a day in total, and login codes use the same allowance. On the free plan send
            at most ~60 a day; on Resend Pro you can send 100 per click, several times.
          </p>
        </div>
      )}

      {message && <p className={`mt-3 text-sm ${message.ok ? "text-success-400" : "text-danger-400"}`}>{message.text}</p>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Trophy, X } from "lucide-react";
import { UK_DISTRICTS } from "@/lib/districts";
import { parseUtcTimestamp } from "@/lib/timestamps";

const STORAGE_KEY = "ukd_free_mock_popup";
const SHOW_AFTER_MS = 12_000;
const HIDE_FOR_MS = 24 * 60 * 60 * 1000; // closed without signing up: ask again the next day

// No popup during a test, in the student area, the app home, on checkout, or on
// the Rank Challenge page itself (it has the same form).
const SUPPRESSED_PREFIXES = ["/test-platform", "/student", "/app", "/checkout", "/mahasangram"];

const input =
  "w-full rounded-lg border border-graphite-200 px-4 py-2.5 text-base text-graphite-800 outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200";

function hidden(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (!v) return false;
    if (v === "done") return true;
    return Date.now() - Number(v) < HIDE_FOR_MS;
  } catch {
    return false;
  }
}
function remember(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode */
  }
}

/**
 * Site-wide popup: free Warm-up Mock registration (name, mobile, email,
 * district). Each submission is saved in mock_registrations (Admin -> Free
 * Mock Registrations), then the student gets an account and goes to the test.
 * Website only; shown to visitors who are not logged in, while the warm-up is open.
 */
export default function FreeMockPopup({ testId, closesAt, totalQuestions }: { testId: string; closesAt: string; totalQuestions: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname?.startsWith(p));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", district: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loginNeeded, setLoginNeeded] = useState(false);
  const target = `/test-platform/tests/${testId}`;
  const closesLabel = parseUtcTimestamp(closesAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" });

  useEffect(() => {
    if (suppressed || hidden() || Date.now() > parseUtcTimestamp(closesAt).getTime()) return;
    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hidden()) setOpen(true);
    };
    document.addEventListener("mouseleave", onExit);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onExit);
    };
  }, [suppressed, closesAt]);

  const close = () => {
    setOpen(false);
    remember(String(Date.now()));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setLoginNeeded(false);
    try {
      const saved = await fetch("/api/mock-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, page: pathname }),
      });
      const savedData = await saved.json().catch(() => ({}));
      if (!saved.ok) {
        setError(savedData.error ?? "Something went wrong. Please try again.");
        return;
      }
      remember("done");

      const join = await fetch("/api/mahasangram/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const joinData = await join.json().catch(() => ({}));
      if (join.ok) {
        router.push(target);
        return;
      }
      if (joinData.reason === "login") {
        setLoginNeeded(true);
        return;
      }
      router.push("/mahasangram");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open || suppressed) return null;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="web-only fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-label="Free mock test registration" className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-to-br from-graphite-900 to-graphite-950 p-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-saffron-400/15">
            <Trophy className="h-6 w-6 text-saffron-400" />
          </div>
          <span className="mb-2 inline-block rounded-full bg-saffron-400/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-saffron-300">
            Free · open till {closesLabel}
          </span>
          <h3 className="font-display text-xl font-bold leading-tight">Free UKPSC Prelims Mock Test</h3>
          <p className="mt-1 text-sm text-graphite-300">{totalQuestions} questions · live rank in all Uttarakhand</p>
        </div>

        <div className="p-6">
          {loginNeeded ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-jade-600" />
              <p className="mb-4 text-sm text-graphite-700">You&apos;re registered. You already have an account, so log in with your email code to start the mock.</p>
              <a href={`/student/login?next=${encodeURIComponent(target)}`} className="btn-primary inline-flex w-full items-center justify-center">
                Log in and start
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <input className={input} placeholder="Full name" value={form.full_name} onChange={set("full_name")} required />
              <input className={input} placeholder="Mobile number (WhatsApp)" type="tel" inputMode="numeric" value={form.phone} onChange={set("phone")} required />
              <input className={input} placeholder="Email" type="email" value={form.email} onChange={set("email")} required />
              <select className={input} value={form.district} onChange={set("district")} required>
                <option value="">Your district</option>
                {UK_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {error && <p className="text-sm text-danger-600">{error}</p>}
              <button type="submit" disabled={busy} className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Register and start free mock
              </button>
              <button type="button" onClick={close} className="w-full text-xs text-graphite-400 hover:text-graphite-600">
                Not now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

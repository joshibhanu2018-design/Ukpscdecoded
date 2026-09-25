"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Database, Flag, Users, FileSpreadsheet, ListChecks, Loader2, Shield, Ticket } from "lucide-react";

type Admin = { id: string; full_name: string | null; email: string };

const TOOLS = [
  { href: "/test-platform/admin/questions", icon: FileSpreadsheet, title: "Import Questions", sub: "Excel/CSV into the question bank" },
  { href: "/test-platform/admin/tests", icon: ListChecks, title: "Create Tests", sub: "Build a test from question IDs" },
  { href: "/test-platform/admin/coupons", icon: Ticket, title: "Coupons & Referrals", sub: "Codes, price locks, referral list" },
  { href: "/test-platform/admin/mentorship", icon: CalendarClock, title: "Mentorship", sub: "Bookings, plans, your hours" },
  { href: "/test-platform/admin/mentees", icon: Users, title: "Mentees", sub: "All mentees vs cutoff, CSV export" },
  { href: "/test-platform/admin/reports", icon: Flag, title: "Question Reports", sub: "Errors students reported; resolve or deactivate" },
  { href: "/test-platform/admin/bank", icon: Database, title: "Question Bank", sub: "Search, filter by source/chapter/test, deactivate" },
];

export default function AdminHomePage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/admins");
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setAdmins(data.admins);
      setMe(data.me);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const change = async (target: string, action: "add" | "remove") => {
    if (action === "remove" && !confirm(`Remove admin access for ${target}?`)) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: target, action }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setMessage(res.ok ? { ok: true, text: action === "add" ? `${target} is now an admin.` : `Removed ${target}.` } : { ok: false, text: data.error || "Failed" });
    if (res.ok) {
      setEmail("");
      void load();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-white">Admin</h1>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {TOOLS.map(({ href, icon: Icon, title, sub }) => (
            <Link key={href} href={href} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-yellow-500/50">
              <Icon className="mb-2 h-5 w-5 text-yellow-500" />
              <div className="font-semibold text-white">{title}</div>
              <div className="text-xs text-slate-300">{sub}</div>
            </Link>
          ))}
        </div>

        <form action="/test-platform/admin/student" className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="font-semibold text-white">Student performance</h2>
          <p className="mt-1 text-xs text-slate-300">Open a student&apos;s analysis before a mentorship session.</p>
          <div className="mt-3 flex gap-2">
            <input
              name="email"
              type="email"
              required
              placeholder="student@example.com"
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
            />
            <button type="submit" className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900">
              Open
            </button>
          </div>
        </form>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Shield className="h-4 w-4 text-yellow-500" /> Admins
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Admins log in with their own email code, like students. To add someone, they must log in on the site once first.
          </p>
          <ul className="mt-4 divide-y divide-slate-800 text-sm">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate text-slate-200">
                  {a.full_name ? `${a.full_name} · ` : ""}
                  {a.email}
                  {a.id === me && <span className="ml-1 text-xs text-slate-300">(you)</span>}
                </span>
                {a.id !== me && (
                  <button onClick={() => change(a.email, "remove")} disabled={busy} className="text-xs text-red-300 hover:text-red-200">
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) void change(email.trim(), "add");
            }}
            className="mt-4 flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="new-admin@example.com"
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500"
            />
            <button type="submit" disabled={busy} className="flex items-center gap-1.5 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Add admin
            </button>
          </form>
          {message && <p className={`mt-3 text-sm ${message.ok ? "text-green-300" : "text-red-300"}`}>{message.text}</p>}
        </section>
      </div>
    </div>
  );
}

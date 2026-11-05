import Link from "next/link";
import { Download, MessageCircle, Phone } from "lucide-react";
import { getMockRegistrations, type MockRegistration } from "@/lib/mockRegistrations";

// Admin-only (guarded by ../layout.tsx).
export default async function RegistrationsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  let all: MockRegistration[] = [];
  let missing = false;
  try {
    all = await getMockRegistrations();
  } catch {
    missing = true; // phase 45 SQL not run yet
  }
  const needle = q.trim().toLowerCase();
  const rows = needle
    ? all.filter((r) => [r.full_name, r.email, r.phone, r.district ?? ""].some((v) => v.toLowerCase().includes(needle)))
    : all;
  const when = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform/admin" className="text-sm text-graphite-300 hover:text-saffron-400">
          ← Admin
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Free mock registrations ({all.length})</h1>
            <p className="text-xs text-graphite-300">Everyone who filled the free mock popup on the website. Newest first.</p>
          </div>
          <a
            href="/api/admin/registrations"
            className="inline-flex items-center gap-1.5 rounded-lg border border-graphite-700 px-3 py-2 text-sm text-graphite-200 hover:border-saffron-400/60"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        {missing ? (
          <p className="mt-6 rounded-xl border border-saffron-400/40 bg-saffron-400/10 p-4 text-sm text-saffron-200">
            Run <code>supabase/schema-phase45-mock-registrations.sql</code> in the Supabase SQL Editor to start saving registrations.
          </p>
        ) : (
          <>
            <form className="mt-4 flex gap-2">
              <input
                name="q"
                defaultValue={q}
                placeholder="Search name, email, mobile or district"
                className="min-w-0 flex-1 rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-base text-graphite-100 outline-none focus:border-saffron-400"
              />
              <button className="rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-saffron-300">Search</button>
            </form>

            {rows.length === 0 ? (
              <p className="mt-8 text-sm text-graphite-300">No registrations yet.</p>
            ) : (
              <ul className="mt-5 divide-y divide-graphite-800 rounded-2xl border border-graphite-800">
                {rows.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{r.full_name}</p>
                      <p className="break-all text-xs text-graphite-300">{r.email}</p>
                      <p className="text-xs text-graphite-400">
                        {r.district ?? "—"} · {when(r.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-graphite-200">{r.phone}</span>
                      <a
                        href={`tel:+91${r.phone}`}
                        aria-label={`Call ${r.full_name}`}
                        className="rounded-lg border border-graphite-700 p-2 text-graphite-200 hover:border-saffron-400/60 hover:text-saffron-300"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/91${r.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${r.full_name}`}
                        className="rounded-lg border border-graphite-700 p-2 text-graphite-200 hover:border-success-400/60 hover:text-success-300"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

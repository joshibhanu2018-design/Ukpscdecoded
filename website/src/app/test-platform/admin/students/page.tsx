import Link from "next/link";
import { Download, MessageCircle, Phone } from "lucide-react";
import { getStudents } from "@/lib/students";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "buyers", label: "Bought something" },
  { key: "free", label: "Not bought yet" },
  { key: "nophone", label: "No mobile number" },
] as const;

// Admin-only (guarded by ../layout.tsx).
export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ q?: string; f?: string }> }) {
  const { q = "", f = "all" } = await searchParams;
  const all = await getStudents();
  const needle = q.trim().toLowerCase();

  const students = all.filter((s) => {
    if (f === "buyers" && s.purchases.length === 0) return false;
    if (f === "free" && s.purchases.length > 0) return false;
    if (f === "nophone" && s.phone) return false;
    if (!needle) return true;
    return [s.full_name ?? "", s.email, s.phone ?? ""].some((v) => v.toLowerCase().includes(needle));
  });

  const withPhone = all.filter((s) => s.phone).length;
  const joined = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform/admin" className="text-sm text-graphite-300 hover:text-saffron-400">
          ← Admin
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Students ({all.length})</h1>
            <p className="text-xs text-graphite-300">
              {withPhone} with a mobile number. Newest first.
            </p>
          </div>
          <a
            href="/api/admin/students"
            className="inline-flex items-center gap-1.5 rounded-lg border border-graphite-700 px-3 py-2 text-sm text-graphite-200 hover:border-saffron-400/60"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>

        <form className="mt-4 flex gap-2">
          <input type="hidden" name="f" value={f} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email or mobile"
            className="min-w-0 flex-1 rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-base text-graphite-100 outline-none focus:border-saffron-400"
          />
          <button className="rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-saffron-300">Search</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((x) => (
            <Link
              key={x.key}
              href={`?f=${x.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full border px-3 py-1 text-xs ${
                f === x.key ? "border-saffron-400 bg-saffron-400/10 text-saffron-300" : "border-graphite-700 text-graphite-300 hover:border-graphite-500"
              }`}
            >
              {x.label}
            </Link>
          ))}
        </div>

        {students.length === 0 ? (
          <p className="mt-8 text-sm text-graphite-300">No students match.</p>
        ) : (
          <ul className="mt-5 divide-y divide-graphite-800 rounded-2xl border border-graphite-800">
            {students.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
                <div className="min-w-0">
                  <p className="font-medium text-white">{s.full_name || "—"}</p>
                  <p className="break-all text-xs text-graphite-300">{s.email}</p>
                  <p className="text-xs text-graphite-400">
                    Joined {joined(s.created_at)}
                    {s.purchases.length > 0 && <span className="text-success-400"> · {s.purchases.join(", ")}</span>}
                  </p>
                </div>
                {s.phone ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-graphite-200">{s.phone}</span>
                    <a
                      href={`tel:+91${s.phone}`}
                      aria-label={`Call ${s.full_name ?? s.phone}`}
                      className="rounded-lg border border-graphite-700 p-2 text-graphite-200 hover:border-saffron-400/60 hover:text-saffron-300"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://wa.me/91${s.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${s.full_name ?? s.phone}`}
                      className="rounded-lg border border-graphite-700 p-2 text-graphite-200 hover:border-success-400/60 hover:text-success-300"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-graphite-500">No mobile yet</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Download } from "lucide-react";
import { errorLabel, getCutoff, getMentees, getStudentSummary, PROJECTION_MOCKS } from "@/lib/performance";
import { supabaseAdmin } from "@/lib/supabase";
import CutoffForm from "@/components/CutoffForm";

// Admin-only (guarded by ../layout.tsx). One row per mentorship student,
// sorted by who's furthest below the cutoff — the people to focus on first.
export default async function MenteesPage() {
  const [mentees, cutoff] = await Promise.all([getMentees(), getCutoff()]);
  const summaries = await Promise.all(mentees.map((m) => getStudentSummary(m.id, cutoff)));

  const now = new Date().toISOString();
  const { data: nextBookings } = mentees.length
    ? await supabaseAdmin()
        .from("mentor_bookings")
        .select("user_id, slot_start")
        .eq("status", "booked")
        .gte("slot_start", now)
        .in(
          "user_id",
          mentees.map((m) => m.id)
        )
        .order("slot_start")
    : { data: [] };
  const nextByUser = new Map<string, string>();
  for (const b of nextBookings ?? []) if (!nextByUser.has(b.user_id)) nextByUser.set(b.user_id, b.slot_start);

  const rows = mentees
    .map((m, i) => ({ m, s: summaries[i] }))
    .sort((a, b) => (a.s.gap ?? -Infinity) - (b.s.gap ?? -Infinity));

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const daysAgo = (iso: string | null) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : null);

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/test-platform/admin" className="text-sm text-graphite-300 hover:text-saffron-400">
          ← Admin
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Mentees ({mentees.length})</h1>
            <p className="text-xs text-graphite-300">
              Projected = average of the latest {PROJECTION_MOCKS} full mocks, first attempts only. Sorted: furthest below
              cutoff first.
            </p>
          </div>
          <a
            href="/api/admin/mentees"
            className="inline-flex items-center gap-1.5 rounded-lg border border-graphite-700 px-3 py-2 text-sm text-graphite-200 hover:border-saffron-400/60"
          >
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </div>
        <div className="mt-4">
          <CutoffForm cutoff={cutoff.cutoff} total={cutoff.total} />
        </div>

        {rows.length === 0 ? (
          <p className="mt-8 text-sm text-graphite-300">No mentorship students yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-graphite-800">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-graphite-800/60 text-xs text-graphite-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Student</th>
                  <th className="px-3 py-2 text-right font-medium">Tests</th>
                  <th className="px-3 py-2 text-right font-medium">Mocks</th>
                  <th className="px-3 py-2 text-right font-medium">Projected /{cutoff.total}</th>
                  <th className="px-3 py-2 text-right font-medium">Gap to {cutoff.cutoff}</th>
                  <th className="px-3 py-2 text-right font-medium">Trend</th>
                  <th className="px-3 py-2 text-right font-medium">−ve/mock</th>
                  <th className="px-3 py-2 text-left font-medium">Weakest topics</th>
                  <th className="px-3 py-2 text-left font-medium">Top error</th>
                  <th className="px-3 py-2 text-left font-medium">Last test</th>
                  <th className="px-3 py-2 text-left font-medium">Next session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-800 text-graphite-300">
                {rows.map(({ m, s }) => {
                  const idle = daysAgo(s.lastTestAt);
                  return (
                    <tr key={m.id} className="hover:bg-graphite-800/40">
                      <td className="px-3 py-2">
                        <Link href={`/test-platform/performance?user=${m.id}`} className="font-medium text-white hover:text-saffron-300">
                          {m.full_name || m.email}
                        </Link>
                        <div className="text-[11px] text-graphite-300">{m.phone ?? m.email}</div>
                      </td>
                      <td className="px-3 py-2 text-right">{s.testsTaken}</td>
                      <td className="px-3 py-2 text-right">{s.fullMocks.length}</td>
                      <td className="px-3 py-2 text-right">{s.projected ?? "—"}</td>
                      <td className={`px-3 py-2 text-right font-semibold ${s.gap === null ? "" : s.gap >= 0 ? "text-success-400" : "text-danger-400"}`}>
                        {s.gap === null ? "—" : `${s.gap > 0 ? "+" : ""}${s.gap}`}
                      </td>
                      <td className="px-3 py-2 text-right">{s.trend === null ? "—" : `${s.trend > 0 ? "+" : ""}${s.trend}`}</td>
                      <td className="px-3 py-2 text-right">{s.negativeLostPerMock ?? "—"}</td>
                      <td className="px-3 py-2 text-xs">{s.weakTopics.map((t) => `${t.name} ${t.pct}%`).join(", ") || "—"}</td>
                      <td className="px-3 py-2 text-xs">{errorLabel(s.topError)}</td>
                      <td className={`px-3 py-2 text-xs ${idle !== null && idle >= 7 ? "text-danger-300" : ""}`}>
                        {idle === null ? "never" : idle === 0 ? "today" : `${idle}d ago`}
                      </td>
                      <td className="px-3 py-2 text-xs">{nextByUser.has(m.id) ? fmt(nextByUser.get(m.id)!) : <span className="text-graphite-300">not booked</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-[11px] text-graphite-300">Red &quot;Last test&quot; = no test for 7+ days. Click a name for the full analysis.</p>
      </div>
    </div>
  );
}

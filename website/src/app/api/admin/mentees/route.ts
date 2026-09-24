import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { toCsv } from "@/lib/csv";
import { errorLabel, getCutoff, getMentees, getStudentSummary } from "@/lib/performance";

/** CSV of every mentee's key numbers — open in Excel/Sheets before a session day. */
export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const [mentees, cutoff] = await Promise.all([getMentees(), getCutoff()]);
  const rows = await Promise.all(
    mentees.map(async (m) => {
      const s = await getStudentSummary(m.id, cutoff);
      return {
        name: m.full_name ?? "",
        email: m.email,
        phone: m.phone ?? "",
        tests_taken: s.testsTaken,
        average_pct: s.avgPct ?? "",
        full_mocks: s.fullMocks.length,
        [`projected_out_of_${cutoff.total}`]: s.projected ?? "",
        [`gap_to_cutoff_${cutoff.cutoff}`]: s.gap ?? "",
        full_mock_trend: s.trend ?? "",
        negative_lost_per_mock: s.negativeLostPerMock ?? "",
        weakest_topics: s.weakTopics.map((t) => `${t.name} (${t.pct}%)`).join("; "),
        most_common_error: errorLabel(s.topError),
        last_test: s.lastTestAt ?? "",
      };
    })
  );

  // BOM so Excel opens Hindi names correctly.
  return new NextResponse("\uFEFF" + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mentees-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

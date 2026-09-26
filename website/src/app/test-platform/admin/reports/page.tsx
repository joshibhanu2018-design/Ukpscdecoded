import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { OPTION_KEYS } from "@/lib/tests";
import { REPORT_REASON_LABEL, type ReportReason } from "@/lib/question-reports";
import { parseUtcTimestamp } from "@/lib/timestamps";
import ReportActions from "./ReportActions";

export const dynamic = "force-dynamic";

type Report = {
  id: string;
  question_id: string;
  user_id: string;
  reason: ReportReason;
  note: string | null;
  created_at: string;
};

type QuestionRow = Record<string, string | null> & { id: string };

const fmt = (iso: string) =>
  parseUtcTimestamp(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/** Open "Report error" reports from students, one card per question. Admin-only via the layout. */
export default async function QuestionReportsPage() {
  const db = supabaseAdmin();
  const { data: reports, error } = await db
    .from("question_reports")
    .select("id, question_id, user_id, reason, note, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: true })
    .limit(500);

  const open = (reports ?? []) as Report[];
  const questionIds = [...new Set(open.map((r) => r.question_id))];
  const userIds = [...new Set(open.map((r) => r.user_id))];

  const [{ data: questions }, { data: users }, testsByQuestion] = await Promise.all([
    questionIds.length
      ? db
          .from("questions")
          .select(
            "id, question_id, subject, topic, status, question_text_hindi, question_text_english, option_a_hindi, option_a_english, option_b_hindi, option_b_english, option_c_hindi, option_c_english, option_d_hindi, option_d_english, correct_answer, explanation_hindi, explanation_english"
          )
          .in("id", questionIds)
      : Promise.resolve({ data: [] as QuestionRow[] }),
    userIds.length ? db.from("users").select("id, full_name, email").in("id", userIds) : Promise.resolve({ data: [] }),
    Promise.all(
      questionIds.map(async (id) => {
        const { data } = await db.from("tests").select("test_name").contains("question_ids", [id]);
        return [id, (data ?? []).map((t) => t.test_name as string)] as const;
      })
    ).then((rows) => new Map(rows)),
  ]);

  const qById = new Map(((questions ?? []) as QuestionRow[]).map((q) => [q.id, q]));
  const userById = new Map((users ?? []).map((u) => [u.id as string, u as { full_name: string | null; email: string }]));
  // Most-reported first, then oldest.
  const groups = questionIds
    .map((id) => ({ id, q: qById.get(id), reports: open.filter((r) => r.question_id === id) }))
    .sort((a, b) => b.reports.length - a.reports.length);

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <h1 className="text-2xl font-bold text-white">Question reports</h1>
        <p className="mt-1 text-sm text-graphite-300">
          Open &quot;Report error&quot; reports from students. <strong>Resolve</strong> if the question is fine (or you fixed it in
          Supabase). <strong>Deactivate</strong> removes it from tests started from now on; past results keep it.
        </p>

        {error && (
          <p className="mt-6 rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-200">
            Could not load reports ({error.message}). Has <code>schema-phase13-marking-reports.sql</code> been run?
          </p>
        )}
        {!error && groups.length === 0 && <p className="mt-8 text-graphite-300">No open reports. 🎉</p>}

        <ol className="mt-6 space-y-5">
          {groups.map(({ id, q, reports: rs }) => (
            <li key={id} className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-saffron-300">{q?.question_id ?? id}</span>
                <span className="rounded-full bg-saffron-500/15 px-2.5 py-1 font-semibold text-saffron-200">
                  {rs.length} report{rs.length > 1 ? "s" : ""}
                </span>
              </div>
              {q ? (
                <>
                  <p className="mt-1 text-xs text-graphite-300">
                    {[q.subject, q.topic].filter(Boolean).join(" · ")}
                    {q.status === "inactive" && <span className="ml-2 text-danger-300">(already inactive)</span>}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-sm text-white">{q.question_text_hindi}</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-graphite-200">{q.question_text_english}</p>
                  <ul className="mt-3 space-y-1.5">
                    {OPTION_KEYS.map((key) => {
                      const k = key.toLowerCase();
                      const isKey = String(q.correct_answer).toUpperCase() === key;
                      return (
                        <li
                          key={key}
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            isKey ? "border-success-500/50 bg-success-500/10 text-success-100" : "border-graphite-700 text-graphite-200"
                          }`}
                        >
                          <span className="font-semibold">{key}.</span> {q[`option_${k}_hindi`]}
                          <span className="block text-graphite-300">{q[`option_${k}_english`]}</span>
                          {isKey && <span className="text-xs font-semibold text-success-300">Answer key</span>}
                        </li>
                      );
                    })}
                  </ul>
                  {(q.explanation_hindi || q.explanation_english) && (
                    <div className="mt-3 rounded-lg bg-graphite-800/60 p-3 text-sm text-graphite-200">
                      <span className="font-semibold text-saffron-400">Explanation</span>
                      {q.explanation_hindi && <p className="mt-1 whitespace-pre-line">{q.explanation_hindi}</p>}
                      {q.explanation_english && <p className="mt-1 whitespace-pre-line">{q.explanation_english}</p>}
                    </div>
                  )}
                  <p className="mt-3 text-xs text-graphite-300">
                    In tests: {testsByQuestion.get(id)?.length ? testsByQuestion.get(id)!.join(", ") : "none"}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-danger-300">Question not found.</p>
              )}

              <ul className="mt-4 divide-y divide-graphite-800 rounded-lg border border-graphite-800 text-sm">
                {rs.map((r) => {
                  const u = userById.get(r.user_id);
                  return (
                    <li key={r.id} className="px-3 py-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-saffron-200">{REPORT_REASON_LABEL[r.reason]?.en ?? r.reason}</span>
                        <span className="text-xs text-graphite-300">
                          {u?.full_name || u?.email || "Unknown"} · {fmt(r.created_at)}
                        </span>
                      </div>
                      {r.note && <p className="mt-1 whitespace-pre-line text-graphite-200">{r.note}</p>}
                    </li>
                  );
                })}
              </ul>

              <ReportActions questionId={id} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

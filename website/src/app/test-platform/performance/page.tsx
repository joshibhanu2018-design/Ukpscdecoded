import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { parseUtcTimestamp } from "@/lib/timestamps";
import { formatDateLabel } from "@/lib/packages";
import { ERROR_TYPES, sanitizeConfidence, sanitizeErrorTags, type Confidence } from "@/lib/tests";
import { getCutoff, getStudentSummary, PROJECTION_MOCKS } from "@/lib/performance";
import { CONFIDENCE_LABEL, ERROR_LABEL, errorBreakdown, guessRule, type GuessAnalysis, type GuessBucket } from "@/lib/analysis";

export const metadata: Metadata = { title: "My Performance", robots: { index: false } };

// Chart bar colour: amber that passes the dark-surface lightness/contrast checks
// (the brand yellow #eab308 is too light for a data mark on slate-900).
const BAR = "#d97706";

type AttemptRow = {
  id: string;
  test_id: string;
  percentage: number | null;
  score: number | null;
  total_marks: number | null;
  submitted_at: string;
  confidence: unknown;
  error_tags: unknown;
  question_ids: string[] | null;
};
type ResultRow = {
  attempt_id: string;
  topic_accuracy: Record<string, { total: number; correct: number }> | null;
  question_performance: { question_id: string; selected: string | null; is_correct: boolean }[] | null;
};
type TestRow = {
  id: string;
  test_name: string;
  question_ids: string[];
  marks_per_question: number;
  negative_marking_enabled: boolean;
  negative_marking_value: number;
};

export default async function PerformancePage({ searchParams }: { searchParams: Promise<{ user?: string }> }) {
  const viewer = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!viewer) redirect("/student/login?next=/test-platform/performance");

  // Admins (mentors) can open any student's analysis: ?user=<id>.
  const { user: requested } = await searchParams;
  const db = supabaseAdmin();
  let studentId = viewer.id;
  let studentLabel: string | null = null;
  if (requested && requested !== viewer.id && viewer.role === "admin") {
    const { data: s } = await db.from("users").select("id, full_name, email").eq("id", requested).maybeSingle();
    if (s) {
      studentId = s.id;
      studentLabel = `${s.full_name ?? ""} · ${s.email}`;
    }
  }

  const { data: attemptData } = await db
    .from("attempts")
    .select("id, test_id, percentage, score, total_marks, submitted_at, confidence, error_tags, question_ids")
    .eq("user_id", studentId)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: true });
  const all = (attemptData ?? []) as AttemptRow[];

  // Trends and topic totals use FIRST attempts only — a reattempt of a
  // test you've already reviewed would flatter the numbers.
  const seen = new Set<string>();
  const firsts = all.filter((a) => (seen.has(a.test_id) ? false : (seen.add(a.test_id), true)));

  const testIds = [...new Set(all.map((a) => a.test_id))];
  const [{ data: testData }, { data: resultData }] = await Promise.all([
    testIds.length
      ? db
          .from("tests")
          .select("id, test_name, question_ids, marks_per_question, negative_marking_enabled, negative_marking_value")
          .in("id", testIds)
      : Promise.resolve({ data: [] as TestRow[] }),
    firsts.length
      ? db
          .from("results")
          .select("attempt_id, topic_accuracy, question_performance")
          .in(
            "attempt_id",
            firsts.map((a) => a.id)
          )
      : Promise.resolve({ data: [] as ResultRow[] }),
  ]);
  const tests = new Map(((testData ?? []) as TestRow[]).map((t) => [t.id, t]));
  const results = new Map(((resultData ?? []) as ResultRow[]).map((r) => [r.attempt_id, r]));

  // ----- topic accuracy across all first attempts -----
  const topics = new Map<string, { total: number; correct: number }>();
  for (const a of firsts) {
    for (const [name, t] of Object.entries(results.get(a.id)?.topic_accuracy ?? {})) {
      const cur = topics.get(name) ?? { total: 0, correct: 0 };
      cur.total += Number(t.total) || 0;
      cur.correct += Number(t.correct) || 0;
      topics.set(name, cur);
    }
  }
  const rankedTopics = [...topics.entries()]
    .filter(([, t]) => t.total >= 5)
    .map(([name, t]) => ({ name, ...t, pct: Math.round((t.correct / t.total) * 100) }))
    .sort((a, b) => a.pct - b.pct);
  const weakest = rankedTopics.slice(0, 8);
  const strongest = [...rankedTopics].reverse().slice(0, 5);

  // ----- negative marking + guess analysis (from stored per-question results) -----
  let negativeLost = 0;
  const order: (Confidence | "untagged")[] = ["sure", "elim2", "elim1", "guess", "untagged"];
  const buckets = new Map<Confidence | "untagged", GuessBucket>(
    order.map((l) => [l, { level: l, attempted: 0, correct: 0, accuracy: null, net: 0 }])
  );
  let tagged = 0;
  let marks = 1;
  let penalty = 0.25;
  for (const a of firsts) {
    const t = tests.get(a.test_id);
    if (!t) continue;
    marks = Number(t.marks_per_question);
    penalty = t.negative_marking_enabled ? marks * Number(t.negative_marking_value) : 0;
    const conf = sanitizeConfidence(a.confidence, a.question_ids ?? t.question_ids);
    for (const q of results.get(a.id)?.question_performance ?? []) {
      if (!q.selected) continue;
      const level: Confidence | "untagged" = (conf[q.question_id] as Confidence | undefined) ?? "untagged";
      if (level !== "untagged") tagged++;
      const b = buckets.get(level)!;
      b.attempted++;
      if (q.is_correct) {
        b.correct++;
        b.net += marks;
      } else {
        b.net -= penalty;
        negativeLost += penalty;
      }
    }
  }
  const guess: GuessAnalysis = {
    buckets: order.map((l) => {
      const b = buckets.get(l)!;
      return { ...b, net: Math.round(b.net * 100) / 100, accuracy: b.attempted ? Math.round((b.correct / b.attempted) * 1000) / 10 : null };
    }),
    breakEvenAccuracy: Math.round((penalty / (marks + penalty || 1)) * 1000) / 10,
    tagged,
  };
  const rule = guessRule(guess, 5);

  // ----- error log across all attempts -----
  const errors = errorBreakdown(
    all.map((a) => sanitizeErrorTags(a.error_tags, a.question_ids ?? tests.get(a.test_id)?.question_ids ?? []))
  );
  const errorTotal = Object.values(errors).reduce((x, y) => x + y, 0);

  const cutoff = await getCutoff();
  const summary = firsts.length ? await getStudentSummary(studentId, cutoff) : null;

  const trend = firsts.slice(-20);
  const best = trend.reduce<AttemptRow | null>((m, a) => (m === null || Number(a.percentage) > Number(m.percentage) ? a : m), null);
  const avg = firsts.length ? firsts.reduce((s, a) => s + Number(a.percentage ?? 0), 0) / firsts.length : null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-yellow-500">
          <ArrowLeft className="h-4 w-4" /> मेरे कोर्स / My Courses
        </Link>
        <h1 className="text-2xl font-bold text-white">
          मेरा प्रदर्शन <span className="text-slate-300">/ My Performance</span>
        </h1>
        {studentLabel && <p className="mt-1 text-sm text-yellow-400">Viewing student: {studentLabel}</p>}

        {firsts.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-300">
            पहला टेस्ट देने के बाद यहाँ विश्लेषण दिखेगा। / Your analysis appears here after your first test.
          </p>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "टेस्ट / Tests", value: String(firsts.length) },
                { label: "औसत / Average", value: avg !== null ? `${avg.toFixed(1)}%` : "—" },
                { label: "नेगेटिव से खोए / Lost to negatives", value: `−${Math.round(negativeLost * 10) / 10}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-slate-300">{s.label}</div>
                </div>
              ))}
            </div>

            <section
              className={`mt-6 rounded-2xl border p-5 ${
                summary?.gap == null
                  ? "border-slate-800 bg-slate-900/60"
                  : summary.gap >= 0
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <h2 className="font-semibold text-white">
                कट-ऑफ से दूरी <span className="text-slate-300">/ Gap to expected cutoff ({cutoff.cutoff}/{cutoff.total})</span>
              </h2>
              {summary?.projected == null ? (
                <p className="mt-2 text-sm text-slate-300">
                  एक फुल मॉक दें — अनुमान उसी से बनेगा। / Take a full-length mock — your projection is based on full mocks.
                </p>
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold text-white">
                    {summary.projected}
                    <span className="ml-2 text-base font-semibold text-slate-300">
                      {summary.gap! >= 0 ? `+${summary.gap} above` : `${Math.abs(summary.gap!)} below`} cutoff
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    पिछले {Math.min(PROJECTION_MOCKS, summary.fullMocks.length)} फुल मॉक का औसत। / Average of your latest{" "}
                    {Math.min(PROJECTION_MOCKS, summary.fullMocks.length)} full mock(s), scaled to {cutoff.total} marks.
                    {summary.trend !== null && ` Since your first mock: ${summary.trend > 0 ? "+" : ""}${summary.trend}.`}
                  </p>
                  {summary.gap! < 0 && summary.negativeLostPerMock !== null && summary.negativeLostPerMock > 0 && (
                    <p className="mt-2 text-sm text-slate-300">
                      आप हर मॉक में नेगेटिव से ~{summary.negativeLostPerMock} अंक खो रहे हैं — अनुमान नियम अपनाने से यह अंतर घटेगा।{" "}
                      <span className="block text-slate-300">
                        You lose ~{summary.negativeLostPerMock} marks per mock to negative marking — following your guess rule
                        below closes part of this gap.
                      </span>
                    </p>
                  )}
                </>
              )}
              <p className="mt-2 text-[11px] text-slate-300">Expected cutoff is an estimate, not an official figure.</p>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold text-white">
                स्कोर ट्रेंड <span className="text-slate-300">/ Score trend (first attempts, %)</span>
              </h2>
              <div className="mt-4 flex h-40 items-end gap-1 border-b border-slate-700" role="img" aria-label="Score percentage per test, oldest to newest">
                {trend.map((a, i) => {
                  const pct = Math.max(0, Math.min(100, Number(a.percentage ?? 0)));
                  const name = tests.get(a.test_id)?.test_name ?? "Test";
                  const labelled = i === trend.length - 1 || a.id === best?.id;
                  return (
                    <div key={a.id} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
                      {labelled && <span className="mb-1 text-center text-[10px] text-slate-300">{Math.round(pct)}%</span>}
                      <div
                        className="w-full rounded-t-[4px] transition-opacity group-hover:opacity-80"
                        style={{ height: `${Math.max(pct, 1)}%`, background: BAR }}
                      />
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-40 -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-200 shadow-xl group-hover:block">
                        <div className="font-semibold">{name}</div>
                        <div className="text-slate-300">
                          {Number(a.score)}/{Number(a.total_marks)} · {Number(a.percentage)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 flex justify-between text-[10px] text-slate-300">
                <span>पुराना / Oldest</span>
                <span>नया / Latest</span>
              </p>
            </section>

            <section className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="font-semibold text-white">
                  कमज़ोर टॉपिक <span className="text-slate-300">/ Weakest topics</span>
                </h2>
                {weakest.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-300">Needs at least 5 questions per topic — take a few more tests.</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    {weakest.map((t) => (
                      <li key={t.name}>
                        <div className="flex justify-between gap-3 text-slate-300">
                          <span className="min-w-0 truncate">{t.name}</span>
                          <span className="flex-shrink-0 text-slate-300">
                            {t.pct}% · {t.correct}/{t.total}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                          <div className="h-1.5 rounded-full" style={{ width: `${t.pct}%`, background: BAR }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {strongest.length > 0 && (
                  <p className="mt-4 text-xs text-slate-300">
                    सबसे मज़बूत / Strongest: {strongest.map((t) => `${t.name} (${t.pct}%)`).join(", ")}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="font-semibold text-white">
                  गलतियों के प्रकार <span className="text-slate-300">/ Why answers went wrong</span>
                </h2>
                {errorTotal === 0 ? (
                  <p className="mt-3 text-sm text-slate-300">
                    परिणाम पेज पर गलत उत्तरों को टैग करें। / Tag your wrong answers on each result page to build your error log.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2.5 text-sm">
                    {ERROR_TYPES.filter((e) => errors[e] > 0)
                      .sort((a, b) => errors[b] - errors[a])
                      .map((e) => (
                        <li key={e}>
                          <div className="flex justify-between text-slate-300">
                            <span>
                              {ERROR_LABEL[e].hi} / {ERROR_LABEL[e].en}
                            </span>
                            <span className="text-slate-300">{errors[e]}</span>
                          </div>
                          <p className="text-xs text-slate-300">{ERROR_LABEL[e].fix}</p>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="font-semibold text-white">
                अनुमान विश्लेषण <span className="text-slate-300">/ Guess analysis (all tests)</span>
              </h2>
              {guess.tagged === 0 ? (
                <p className="mt-3 text-sm text-slate-300">
                  टेस्ट में &quot;कितने निश्चित?&quot; टैग करें। / Tag &quot;How sure?&quot; while answering to get your personal attempt rule.
                </p>
              ) : (
                <>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs text-slate-300">
                        <tr>
                          <th className="py-1 text-left font-medium">When</th>
                          <th className="py-1 text-right font-medium">Attempted</th>
                          <th className="py-1 text-right font-medium">Accuracy</th>
                          <th className="py-1 text-right font-medium">Net marks</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {guess.buckets
                          .filter((b) => b.attempted > 0)
                          .map((b) => (
                            <tr key={b.level} className="border-t border-slate-800">
                              <td className="py-1.5">{CONFIDENCE_LABEL[b.level]}</td>
                              <td className="py-1.5 text-right">{b.attempted}</td>
                              <td className="py-1.5 text-right">{b.accuracy !== null ? `${b.accuracy}%` : "—"}</td>
                              <td className={`py-1.5 text-right ${b.net < 0 ? "text-red-400" : "text-green-400"}`}>
                                {b.net > 0 ? "+" : ""}
                                {b.net}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-300">Guessing pays only above {guess.breakEvenAccuracy}% accuracy.</p>
                  {rule && (
                    <p className="mt-3 rounded-lg bg-sky-500/10 px-3 py-2 text-sm text-sky-200">
                      आपका नियम: {rule.hi}
                      <span className="block text-sky-300/80">Your rule: {rule.en}</span>
                    </p>
                  )}
                </>
              )}
            </section>

            <section className="mt-8">
              <h2 className="mb-3 font-semibold text-white">
                सभी टेस्ट <span className="text-slate-300">/ All tests</span>
              </h2>
              <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 text-sm">
                {[...all].reverse().map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/test-platform/attempts/${a.id}/result`}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-800/50"
                    >
                      <span className="min-w-0 truncate text-slate-200">{tests.get(a.test_id)?.test_name ?? "Test"}</span>
                      <span className="flex-shrink-0 text-xs text-slate-300">
                        {formatDateLabel(parseUtcTimestamp(a.submitted_at).toISOString())} · {Number(a.score)}/{Number(a.total_marks)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

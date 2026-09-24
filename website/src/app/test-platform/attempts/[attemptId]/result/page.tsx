import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MinusCircle, Target, Trophy, XCircle } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  computePercentile,
  formatDuration,
  getAttempt,
  getTest,
  getTestQuestions,
  sanitizeAnswers,
  scoreAttempt,
} from "@/lib/tests";

export const metadata: Metadata = {
  title: "Test Result",
  robots: { index: false },
};

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className={`mb-2 ${tone}`}>{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

export default async function ResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect("/student/login");

  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId, user.id);
  if (!attempt) notFound();
  // Answers are only revealed after submission.
  if (attempt.status !== "submitted") redirect(`/test-platform/attempts/${attempt.id}`);

  const test = await getTest(attempt.test_id);
  if (!test) notFound();

  const questions = await getTestQuestions(test);
  const answers = sanitizeAnswers(attempt.answers, test.question_ids);
  // Recomputed from the stored answers rather than read from `results`,
  // so the page is correct even if the analytics insert ever failed.
  const r = scoreAttempt(questions, answers, test);
  const percentile = await computePercentile(test.id, r.score, attempt.id);
  const subjects = Object.entries(r.bySubject).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-yellow-500">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white">{test.test_name}</h1>
        <p className="mt-1 text-sm text-slate-400">परिणाम / Result</p>

        <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
          <div className="text-4xl font-bold text-yellow-500">
            {r.score} <span className="text-2xl text-slate-400">/ {r.totalMarks}</span>
          </div>
          <div className="mt-1 text-sm text-slate-300">{r.percentage}%</div>
          {percentile !== null && (
            <p className="mt-2 text-sm text-slate-400">
              आपने {percentile}% छात्रों से बेहतर किया / You scored higher than {percentile}% of students
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Correct" value={String(r.correct)} tone="text-green-400" />
          <Stat icon={<XCircle className="h-5 w-5" />} label="Wrong" value={String(r.wrong)} tone="text-red-400" />
          <Stat icon={<MinusCircle className="h-5 w-5" />} label="Skipped" value={String(r.unattempted)} tone="text-slate-400" />
          <Stat
            icon={<Target className="h-5 w-5" />}
            label="Accuracy"
            value={r.accuracy !== null ? `${r.accuracy}%` : "—"}
            tone="text-yellow-500"
          />
          <Stat
            icon={<Clock className="h-5 w-5" />}
            label="Time taken"
            value={formatDuration(attempt.time_taken_seconds ?? 0)}
            tone="text-sky-400"
          />
          <Stat
            icon={<Trophy className="h-5 w-5" />}
            label="Percentile"
            value={percentile !== null ? String(percentile) : "—"}
            tone="text-purple-400"
          />
        </div>

        {subjects.length > 1 && (
          <section className="mt-10">
            <h2 className="mb-3 font-semibold text-white">
              विषयवार प्रदर्शन <span className="text-slate-400">/ Subject-wise</span>
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/60 text-xs text-slate-400">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Subject</th>
                    <th className="px-4 py-2 text-right font-medium">Correct</th>
                    <th className="px-4 py-2 text-right font-medium">Attempted</th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                    <th className="px-4 py-2 text-right font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {subjects.map(([name, s]) => (
                    <tr key={name} className="text-slate-300">
                      <td className="px-4 py-2">{name}</td>
                      <td className="px-4 py-2 text-right">{s.correct}</td>
                      <td className="px-4 py-2 text-right">{s.attempted}</td>
                      <td className="px-4 py-2 text-right">{s.total}</td>
                      <td className="px-4 py-2 text-right">{s.accuracy !== null ? `${s.accuracy}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-3 font-semibold text-white">
            उत्तर समीक्षा <span className="text-slate-400">/ Answer Review</span>
          </h2>
          <ol className="space-y-4">
            {questions.map((q, i) => {
              const selected = answers[q.id] ?? null;
              const status = selected === null ? "skipped" : selected === q.correct_answer ? "correct" : "wrong";
              return (
                <li key={q.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-yellow-500">Q{i + 1}</span>
                    <span
                      className={
                        status === "correct"
                          ? "text-green-400"
                          : status === "wrong"
                            ? "text-red-400"
                            : "text-slate-500"
                      }
                    >
                      {status === "correct" ? "Correct / सही" : status === "wrong" ? "Wrong / गलत" : "Skipped / छोड़ा"}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm text-white">{q.text_hindi}</p>
                  {q.text_english && q.text_english !== q.text_hindi && (
                    <p className="mt-1 whitespace-pre-line text-sm text-slate-400">{q.text_english}</p>
                  )}
                  <ul className="mt-3 space-y-1.5">
                    {q.options.map((o) => {
                      if (!o.hindi && !o.english) return null;
                      const isCorrect = o.key === q.correct_answer;
                      const isPicked = o.key === selected;
                      return (
                        <li
                          key={o.key}
                          className={`rounded-lg border px-3 py-2 text-sm ${
                            isCorrect
                              ? "border-green-500/50 bg-green-500/10 text-green-200"
                              : isPicked
                                ? "border-red-500/50 bg-red-500/10 text-red-200"
                                : "border-slate-800 text-slate-300"
                          }`}
                        >
                          <span className="font-semibold">{o.key}.</span> {o.hindi || o.english}
                          {o.english && o.hindi && o.english !== o.hindi && (
                            <span className="text-slate-500"> / {o.english}</span>
                          )}
                          {isPicked && <span className="ml-2 text-xs opacity-80">(your answer)</span>}
                        </li>
                      );
                    })}
                  </ul>
                  {(q.explanation_hindi || q.explanation_english) && (
                    <div className="mt-3 rounded-lg bg-slate-800/60 p-3 text-sm text-slate-300">
                      <span className="font-semibold text-yellow-500">व्याख्या / Explanation: </span>
                      {q.explanation_hindi && <p className="mt-1 whitespace-pre-line">{q.explanation_hindi}</p>}
                      {q.explanation_english && q.explanation_english !== q.explanation_hindi && (
                        <p className="mt-1 whitespace-pre-line text-slate-400">{q.explanation_english}</p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/test-platform/tests/${test.id}`}
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:border-slate-500"
          >
            Reattempt / दोबारा दें
          </Link>
          <Link
            href="/test-platform"
            className="rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-yellow-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

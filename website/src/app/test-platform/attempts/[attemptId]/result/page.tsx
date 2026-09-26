import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MinusCircle, Target, Trophy, XCircle, Zap } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  computePercentile,
  formatDuration,
  getAttempt,
  getAttemptById,
  getAttemptTest,
  getTestQuestions,
  hasEarlierSubmittedAttempt,
  sanitizeAnswers,
  scoreAttempt,
  sanitizeConfidence,
  sanitizeErrorTags,
} from "@/lib/tests";
import { attemptStrategy, CONFIDENCE_LABEL, guessAnalysis, guessRule } from "@/lib/analysis";
import AnswerReview from "@/components/AnswerReview";
import { getCutoff, isFullMock, scaleToPaper } from "@/lib/performance";
import { supabaseAdmin } from "@/lib/supabase";
import { xpForAttempt } from "@/lib/gamification";
import { parseUtcTimestamp } from "@/lib/timestamps";

export const metadata: Metadata = {
  title: "Test Result",
  robots: { index: false },
};

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
      <div className={`mb-2 ${tone}`}>{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-graphite-300">{label}</div>
    </div>
  );
}

export default async function ResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect("/student/login");

  const { attemptId } = await params;
  // Mentors (admins) can open any student's result from the performance page.
  const attempt = (await getAttempt(attemptId, user.id)) ?? (user.role === "admin" ? await getAttemptById(attemptId) : null);
  if (!attempt) notFound();
  const isOwner = attempt.user_id === user.id;
  // Answers are only revealed after submission.
  if (attempt.status !== "submitted") {
    if (!isOwner) notFound();
    redirect(`/test-platform/attempts/${attempt.id}`);
  }

  const test = await getAttemptTest(attempt);
  if (!test) notFound();

  const questions = await getTestQuestions(test, attempt.start_time);
  const answers = sanitizeAnswers(attempt.answers, test.question_ids);
  // Recomputed from the stored answers rather than read from `results`,
  // so the page is correct even if the analytics insert ever failed.
  const r = scoreAttempt(questions, answers, test);
  const percentile = await computePercentile(test.id, r.score, attempt.id);
  const isFirst = !(await hasEarlierSubmittedAttempt(
    attempt.user_id,
    test.id,
    attempt.id,
    attempt.submitted_at ? parseUtcTimestamp(attempt.submitted_at).toISOString() : new Date().toISOString()
  ));
  const xpEarned = xpForAttempt(r.percentage, isFirst, r.correct + r.wrong);
  const subjects = Object.entries(r.bySubject).sort((a, b) => b[1].total - a[1].total);
  const strategy = attemptStrategy(questions, answers, test);
  const { data: testMeta } = await supabaseAdmin().from("tests").select("subject, total_questions").eq("id", test.id).maybeSingle();
  const cutoff = testMeta && isFullMock(testMeta) ? await getCutoff() : null;
  const scaled = cutoff ? scaleToPaper(r.score, r.totalMarks, cutoff.total) : null;
  const confidence = sanitizeConfidence(attempt.confidence, test.question_ids);
  const errorTags = sanitizeErrorTags(attempt.error_tags, test.question_ids);
  const guesses = guessAnalysis(questions.map((question) => ({ question, answers, confidence, test })));
  const rule = guessRule(guesses, 3);
  // Weakest topics first; ignore topics with a single question (too noisy).
  const weakTopics = Object.entries(r.byTopic)
    .filter(([, t]) => t.total >= 2)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/test-platform" className="mb-6 inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white">{test.test_name}</h1>
        <p className="mt-1 text-sm text-graphite-300">Result</p>

        <div className="mt-6 rounded-2xl border border-saffron-400/30 bg-saffron-400/5 p-6 text-center">
          <div className="text-4xl font-bold text-saffron-400">
            {r.score} <span className="text-2xl text-graphite-300">/ {r.totalMarks}</span>
          </div>
          <div className="mt-1 text-sm text-graphite-300">{r.percentage}%</div>
          {xpEarned > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-saffron-400/15 px-3 py-1 text-sm font-semibold text-saffron-300">
              <Zap className="h-4 w-4" /> +{xpEarned} XP{!isFirst && " (reattempt)"}
            </div>
          )}
          {cutoff && scaled !== null && (
            <p className={`mt-2 text-sm font-semibold ${scaled >= cutoff.cutoff ? "text-success-400" : "text-danger-400"}`}>
              Expected cutoff {cutoff.cutoff}: you&apos;re {Math.round(Math.abs(scaled - cutoff.cutoff) * 10) / 10}{" "}
              {scaled >= cutoff.cutoff ? "above" : "below"}
            </p>
          )}
          {percentile !== null && (
            <p className="mt-2 text-sm text-graphite-300">
              You scored higher than {percentile}% of students
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Correct" value={String(r.correct)} tone="text-success-400" />
          <Stat icon={<XCircle className="h-5 w-5" />} label="Wrong" value={String(r.wrong)} tone="text-danger-400" />
          <Stat icon={<MinusCircle className="h-5 w-5" />} label="Skipped" value={String(r.unattempted)} tone="text-graphite-300" />
          <Stat
            icon={<Target className="h-5 w-5" />}
            label="Accuracy"
            value={r.accuracy !== null ? `${r.accuracy}%` : "—"}
            tone="text-saffron-400"
          />
          <Stat
            icon={<Clock className="h-5 w-5" />}
            label="Time taken"
            value={formatDuration(attempt.time_taken_seconds ?? 0)}
            tone="text-graphite-200"
          />
          <Stat
            icon={<Trophy className="h-5 w-5" />}
            label="Percentile"
            value={percentile !== null ? String(percentile) : "—"}
            tone="text-saffron-300"
          />
        </div>

        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
            <h2 className="font-semibold text-white">
              Attempt strategy
            </h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-graphite-300">
                <dt>Attempted</dt>
                <dd>
                  {strategy.attempted} / {strategy.total} ({strategy.attemptedPct}%)
                </dd>
              </div>
              <div className="flex justify-between text-graphite-300">
                <dt>Marks from correct answers</dt>
                <dd className="text-success-400">+{strategy.marksGained}</dd>
              </div>
              <div className="flex justify-between text-graphite-300">
                <dt>Lost to negative marking</dt>
                <dd className="text-danger-400">−{strategy.negativeLost}</dd>
              </div>
              <div className="flex justify-between border-t border-graphite-800 pt-1.5 font-semibold text-white">
                <dt>Net score</dt>
                <dd>{strategy.net}</dd>
              </div>
            </dl>
            {strategy.negativeLost > 0 && (
              <p className="mt-3 text-xs text-graphite-300">
                Wrong answers cost you {strategy.negativeLost} marks —{" "}
                that&apos;s {Math.round((strategy.negativeLost / Math.max(1, strategy.marksGained)) * 100)}% of what you earned.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
            <h2 className="font-semibold text-white">
              Guess analysis
            </h2>
            {guesses.tagged === 0 ? (
              <p className="mt-3 text-sm text-graphite-300">
                Next time, tag &quot;How sure?&quot; on your answers to see
                which guesses earn marks.
              </p>
            ) : (
              <>
                <table className="mt-3 w-full text-sm">
                  <thead className="text-xs text-graphite-300">
                    <tr>
                      <th className="py-1 text-left font-medium">When</th>
                      <th className="py-1 text-right font-medium">Attempted</th>
                      <th className="py-1 text-right font-medium">Accuracy</th>
                      <th className="py-1 text-right font-medium">Net marks</th>
                    </tr>
                  </thead>
                  <tbody className="text-graphite-300">
                    {guesses.buckets
                      .filter((b) => b.attempted > 0)
                      .map((b) => (
                        <tr key={b.level} className="border-t border-graphite-800">
                          <td className="py-1.5">{CONFIDENCE_LABEL[b.level]}</td>
                          <td className="py-1.5 text-right">{b.attempted}</td>
                          <td className="py-1.5 text-right">{b.accuracy !== null ? `${b.accuracy}%` : "—"}</td>
                          <td className={`py-1.5 text-right ${b.net < 0 ? "text-danger-400" : "text-success-400"}`}>
                            {b.net > 0 ? "+" : ""}
                            {b.net}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <p className="mt-2 text-[11px] text-graphite-300">
                  Guessing pays only above {guesses.breakEvenAccuracy}% accuracy with this test&apos;s negative marking.
                </p>
                {rule && (
                  <p className="mt-3 rounded-lg bg-saffron-400/10 px-3 py-2 text-sm text-saffron-100">
                    {rule.en}
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {weakTopics.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-semibold text-white">
              Weakest topics in this test
            </h2>
            <ul className="divide-y divide-graphite-800 rounded-2xl border border-graphite-800 bg-graphite-900/60 text-sm">
              {weakTopics.map(([name, t]) => (
                <li key={name} className="flex items-center justify-between gap-3 px-4 py-2">
                  <span className="min-w-0 truncate text-graphite-300">{name}</span>
                  <span className="flex-shrink-0 text-graphite-300">
                    {t.correct}/{t.total} correct
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {subjects.length > 1 && (
          <section className="mt-10">
            <h2 className="mb-3 font-semibold text-white">
              Subject-wise
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-graphite-800">
              <table className="w-full text-sm">
                <thead className="bg-graphite-800/60 text-xs text-graphite-300">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Subject</th>
                    <th className="px-4 py-2 text-right font-medium">Correct</th>
                    <th className="px-4 py-2 text-right font-medium">Attempted</th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                    <th className="px-4 py-2 text-right font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-graphite-800">
                  {subjects.map(([name, s]) => (
                    <tr key={name} className="text-graphite-300">
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

        <AnswerReview attemptId={attempt.id} questions={questions} answers={answers} errorTags={errorTags} isOwner={isOwner} />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/test-platform/tests/${test.id}`}
            className="rounded-lg border border-graphite-700 px-5 py-2.5 text-sm text-graphite-300 hover:border-graphite-500"
          >
            Reattempt
          </Link>
          <Link
            href="/test-platform"
            className="rounded-lg bg-saffron-400 px-5 py-2.5 text-sm font-semibold text-graphite-900 hover:bg-saffron-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

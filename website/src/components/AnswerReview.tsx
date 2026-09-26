"use client";

import type { Answers, ErrorTags, FullQuestion } from "@/lib/tests";
import ErrorTagger from "./ErrorTagger";
import LangToggle, { useTestLang } from "./LangToggle";
import ReportQuestion from "./ReportQuestion";

/**
 * Answer review on the result page, in the student's chosen language (the
 * same हिंदी/EN choice as the exam screen). Falls back to the other
 * language where a translation is missing.
 */
export default function AnswerReview({
  attemptId,
  questions,
  answers,
  errorTags,
  isOwner,
}: {
  attemptId: string;
  questions: FullQuestion[];
  answers: Answers;
  errorTags: ErrorTags;
  isOwner: boolean;
}) {
  const [lang, setLang] = useTestLang();
  const text = (hi: string | null, en: string | null) => (lang === "hi" ? hi || en : en || hi) ?? "";

  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-white">
          Answer Review
        </h2>
        <LangToggle lang={lang} onChange={setLang} />
      </div>
      <ol className="space-y-4">
        {questions.map((q, i) => {
          const selected = answers[q.id] ?? null;
          const status = selected === null ? "skipped" : selected === q.correct_answer ? "correct" : "wrong";
          const explanation = text(q.explanation_hindi, q.explanation_english);
          return (
            <li key={q.id} className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-saffron-400">Q{i + 1}</span>
                <span
                  className={status === "correct" ? "text-success-400" : status === "wrong" ? "text-danger-400" : "text-graphite-300"}
                >
                  {status === "correct" ? "Correct" : status === "wrong" ? "Wrong" : "Skipped"}
                </span>
              </div>
              <p className="whitespace-pre-line text-base leading-relaxed text-white">{text(q.text_hindi, q.text_english)}</p>
              <ul className="mt-3 space-y-1.5">
                {q.options.map((o) => {
                  const label = text(o.hindi, o.english);
                  if (!label) return null;
                  const isCorrect = o.key === q.correct_answer;
                  const isPicked = o.key === selected;
                  return (
                    <li
                      key={o.key}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        isCorrect
                          ? "border-success-500/50 bg-success-500/10 text-success-100"
                          : isPicked
                            ? "border-danger-500/50 bg-danger-500/10 text-danger-100"
                            : "border-graphite-700 text-graphite-200"
                      }`}
                    >
                      <span className="font-semibold">{o.key}.</span> {label}
                      {isPicked && <span className="ml-2 text-xs opacity-90">({lang === "hi" ? "आपका उत्तर" : "your answer"})</span>}
                    </li>
                  );
                })}
              </ul>
              {status !== "correct" && isOwner && (
                <ErrorTagger attemptId={attemptId} questionId={q.id} initial={errorTags[q.id] ?? null} />
              )}
              {explanation && (
                <div className="mt-3 rounded-lg bg-graphite-800/60 p-3 text-sm text-graphite-200">
                  <span className="font-semibold text-saffron-400">{lang === "hi" ? "व्याख्या" : "Explanation"}: </span>
                  <p className="mt-1 whitespace-pre-line">{explanation}</p>
                </div>
              )}
              {isOwner && <ReportQuestion attemptId={attemptId} questionId={q.id} />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

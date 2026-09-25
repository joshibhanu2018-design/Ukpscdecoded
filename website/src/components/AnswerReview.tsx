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
          उत्तर समीक्षा <span className="text-slate-300">/ Answer Review</span>
        </h2>
        <LangToggle lang={lang} onChange={setLang} />
      </div>
      <ol className="space-y-4">
        {questions.map((q, i) => {
          const selected = answers[q.id] ?? null;
          const status = selected === null ? "skipped" : selected === q.correct_answer ? "correct" : "wrong";
          const explanation = text(q.explanation_hindi, q.explanation_english);
          return (
            <li key={q.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-yellow-500">Q{i + 1}</span>
                <span
                  className={status === "correct" ? "text-green-400" : status === "wrong" ? "text-red-400" : "text-slate-300"}
                >
                  {status === "correct" ? "Correct / सही" : status === "wrong" ? "Wrong / गलत" : "Skipped / छोड़ा"}
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
                          ? "border-green-500/50 bg-green-500/10 text-green-100"
                          : isPicked
                            ? "border-red-500/50 bg-red-500/10 text-red-100"
                            : "border-slate-700 text-slate-200"
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
                <div className="mt-3 rounded-lg bg-slate-800/60 p-3 text-sm text-slate-200">
                  <span className="font-semibold text-yellow-500">{lang === "hi" ? "व्याख्या" : "Explanation"}: </span>
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

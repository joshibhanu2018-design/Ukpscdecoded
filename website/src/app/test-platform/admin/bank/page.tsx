import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { OPTION_KEYS } from "@/lib/tests";
import {
  FORMATS,
  SECTIONS,
  filtersFrom,
  getFilterOptions,
  getQuestionsByIds,
  getTestUsage,
  matchQuestions,
  type BankFilters,
  type BankQuestion,
} from "@/lib/question-bank";
import { CopyIds, StatusButton } from "./BankActions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const qs = (f: BankFilters, page?: number) => {
  const p = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]);
  if (page && page > 1) p.set("page", String(page));
  return p.toString();
};

const field = "min-h-[40px] w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white focus:border-yellow-500 focus:outline-none";

/** Browse, search and filter the whole question bank; deactivate questions. Admin-only via the layout. */
export default async function QuestionBankPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const f = filtersFrom(params);
  const page = Math.max(1, Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1);

  let error: string | null = null;
  let total = 0;
  let questions: BankQuestion[] = [];
  const [{ tests, testsOf }, options] = await Promise.all([getTestUsage(), getFilterOptions(f.section)]);
  try {
    const ids = await matchQuestions(f, testsOf, tests);
    total = ids.length;
    questions = await getQuestionsByIds(ids.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/test-platform/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-yellow-500">
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <h1 className="text-2xl font-bold text-white">Question bank</h1>
        <p className="mt-1 text-sm text-slate-300">
          Search and filter every question. Open one to read it in both languages. <strong>Deactivate</strong> leaves it out of tests
          started from now on (past results keep it); the next loader run replaces it in its tests.
        </p>

        <form method="get" className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs text-slate-300">Search text or Question ID</span>
            <input name="q" defaultValue={f.q} placeholder="e.g. Nanda Devi, UKPCS-UKGK-CH12" className={field} />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-300">Section</span>
            <select name="section" defaultValue={f.section} className={field}>
              <option value="">All sections</option>
              {Object.entries(SECTIONS).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-300">Chapter</span>
            <select name="chapter" defaultValue={f.chapter} className={field}>
              <option value="">All chapters</option>
              {options.chapters.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.name.slice(0, 40)}
                </option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs text-slate-300">Source file</span>
            <select name="source" defaultValue={f.source} className={field}>
              <option value="">All sources</option>
              {options.sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-300">Difficulty</span>
            <select name="difficulty" defaultValue={f.difficulty} className={field}>
              <option value="">Any</option>
              {["Easy", "Medium", "Hard"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-300">Format</span>
            <select name="format" defaultValue={f.format} className={field}>
              <option value="">Any</option>
              {FORMATS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-300">Status</span>
            <select name="status" defaultValue={f.status} className={field}>
              <option value="">Any</option>
              <option value="active">Active</option>
              <option value="inactive">Deactivated</option>
            </select>
          </label>
          <label className="sm:col-span-2 lg:col-span-2">
            <span className="mb-1 block text-xs text-slate-300">Used in</span>
            <select name="usage" defaultValue={f.usage} className={field}>
              <option value="">Any</option>
              <option value="used">In any test</option>
              <option value="unused">Not in any test</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.test_name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <button type="submit" className="min-h-[40px] rounded-lg bg-yellow-500 px-5 text-sm font-semibold text-slate-900 hover:bg-yellow-400">
              Filter
            </button>
            <Link href="/test-platform/admin/bank" className="inline-flex min-h-[40px] items-center rounded-lg px-3 text-sm text-slate-300 hover:text-yellow-500">
              Reset
            </Link>
          </div>
        </form>

        {error ? (
          <p className="mt-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Could not load questions ({error}). Has <code>schema-phase14-bank-browser.sql</code> been run and the loader re-applied?
          </p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-300">
                <strong className="text-white">{total.toLocaleString("en-IN")}</strong> question{total === 1 ? "" : "s"}
                {total > PAGE_SIZE && ` · page ${page} of ${pages}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <CopyIds ids={questions.map((q) => q.question_id)} />
                <a
                  href={`/api/admin/question-bank?${qs(f)}`}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 hover:border-yellow-500/60"
                >
                  <Download className="h-4 w-4" /> Download CSV (all {total.toLocaleString("en-IN")})
                </a>
              </div>
            </div>

            <ol className="mt-4 space-y-3">
              {questions.map((q) => {
                const inTests = testsOf.get(q.id) ?? [];
                const inactive = q.status === "inactive";
                return (
                  <li key={q.id} className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <details>
                      <summary className="cursor-pointer list-none p-4">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="font-mono text-yellow-400">{q.question_id}</span>
                          <span className="text-slate-300">{[q.section_code, q.subtopic].filter(Boolean).join(" · ")}</span>
                          <span className="text-slate-300">{q.difficulty}</span>
                          <span className="text-slate-300">{q.question_format}</span>
                          {inactive && <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-semibold text-red-200">Deactivated</span>}
                        </div>
                        <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-white">{q.question_text_english}</p>
                        <p className="mt-1 text-xs text-slate-300">
                          {inTests.length ? `In: ${inTests.join(", ")}` : "Not in any test"}
                          {q.source_file && <span className="block sm:inline sm:before:content-['_·_']">Source: {q.source_file}</span>}
                        </p>
                      </summary>
                      <div className="border-t border-slate-800 p-4">
                        <p className="whitespace-pre-line text-sm text-white">{q.question_text_hindi}</p>
                        <p className="mt-2 whitespace-pre-line text-sm text-slate-200">{q.question_text_english}</p>
                        <ul className="mt-3 space-y-1.5">
                          {OPTION_KEYS.map((key) => {
                            const k = key.toLowerCase() as "a" | "b" | "c" | "d";
                            const isKey = String(q.correct_answer).toUpperCase() === key;
                            return (
                              <li
                                key={key}
                                className={`rounded-lg border px-3 py-2 text-sm ${
                                  isKey ? "border-green-500/50 bg-green-500/10 text-green-100" : "border-slate-700 text-slate-200"
                                }`}
                              >
                                <span className="font-semibold">{key}.</span> {q[`option_${k}_hindi`]}
                                <span className="block text-slate-300">{q[`option_${k}_english`]}</span>
                                {isKey && <span className="text-xs font-semibold text-green-300">Answer key</span>}
                              </li>
                            );
                          })}
                        </ul>
                        {(q.explanation_hindi || q.explanation_english) && (
                          <div className="mt-3 rounded-lg bg-slate-800/60 p-3 text-sm text-slate-200">
                            <span className="font-semibold text-yellow-500">Explanation</span>
                            {q.explanation_hindi && <p className="mt-1 whitespace-pre-line">{q.explanation_hindi}</p>}
                            {q.explanation_english && <p className="mt-1 whitespace-pre-line">{q.explanation_english}</p>}
                          </div>
                        )}
                        <p className="mt-3 text-xs text-slate-300">{[q.subject, q.topic].filter(Boolean).join(" · ")}</p>
                        <StatusButton questionId={q.id} inactive={inactive} />
                      </div>
                    </details>
                  </li>
                );
              })}
            </ol>

            {pages > 1 && (
              <nav className="mt-6 flex items-center justify-between gap-3 text-sm">
                {page > 1 ? (
                  <Link href={`/test-platform/admin/bank?${qs(f, page - 1)}`} className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-yellow-500/60">
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}
                {page < pages && (
                  <Link href={`/test-platform/admin/bank?${qs(f, page + 1)}`} className="rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-yellow-500/60">
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}

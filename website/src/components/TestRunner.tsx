"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronLeft, ChevronRight, Clock, Grid3X3, Loader2, X } from "lucide-react";
import type { Answers, Confidence, Confidences, OptionKey, PublicQuestion } from "@/lib/tests";

type Lang = "hi" | "en";
type SaveState = "idle" | "saving" | "saved" | "error";

const LANG_KEY = "ukpsc_test_lang";
const AUTOSAVE_DELAY_MS = 800;

const CONFIDENCE_OPTIONS: { key: Confidence; hi: string; en: string }[] = [
  { key: "sure", hi: "पक्का", en: "Sure" },
  { key: "elim2", hi: "2 हटाए", en: "Ruled out 2" },
  { key: "elim1", hi: "1 हटाया", en: "Ruled out 1" },
  { key: "guess", hi: "अंदाज़ा", en: "Guess" },
];

function formatClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function TestRunner({
  attemptId,
  testName,
  questions,
  initialAnswers,
  initialMarked,
  initialConfidence = {},
  deadline,
  serverNow,
}: {
  attemptId: string;
  testName: string;
  questions: PublicQuestion[];
  initialAnswers: Answers;
  initialMarked: string[];
  initialConfidence?: Confidences;
  deadline: number; // epoch ms
  serverNow: number; // epoch ms at render, to correct for a wrong device clock
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [marked, setMarked] = useState<Set<string>>(() => new Set(initialMarked));
  const [confidence, setConfidence] = useState<Confidences>(initialConfidence);
  const [visited, setVisited] = useState<Set<string>>(
    () => new Set([...Object.keys(initialAnswers), ...initialMarked, questions[0]?.id].filter(Boolean) as string[])
  );
  const [lang, setLang] = useState<Lang>("hi");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // The site navbar is itself sticky; pin the timer bar just below it so
  // the clock never scrolls out of view.
  const [navHeight, setNavHeight] = useState(64);

  // Device clock may be off; everything timer-related uses server time.
  const skewRef = useRef(serverNow - Date.now());
  const [remaining, setRemaining] = useState(() => deadline - serverNow);

  const latest = useRef({ answers, marked, confidence });
  latest.current = { answers, marked, confidence };
  const dirty = useRef(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const update = () => setNavHeight(nav.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "hi" || saved === "en") setLang(saved);
    } catch {
      /* storage unavailable — default language is fine */
    }
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  };

  const payload = () =>
    JSON.stringify({
      answers: latest.current.answers,
      marked: [...latest.current.marked],
      confidence: latest.current.confidence,
    });

  const submit = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit");
      }
      dirty.current = false;
      router.replace(`/test-platform/attempts/${attemptId}/result`);
    } catch (err) {
      submittedRef.current = false;
      setSubmitting(false);
      setSubmitError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Network error — your answers are saved. Please try submitting again."
      );
    }
  }, [attemptId, router]);

  const save = useCallback(async () => {
    if (submittedRef.current || !dirty.current) return;
    dirty.current = false;
    setSaveState("saving");
    try {
      const res = await fetch(`/api/attempts/${attemptId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload(),
      });
      if (res.status === 409) {
        // Time is up or already submitted server-side — finalize.
        void submit();
        return;
      }
      if (!res.ok) throw new Error("save failed");
      setSaveState("saved");
    } catch {
      dirty.current = true; // retried on the next change or the interval below
      setSaveState("error");
    }
  }, [attemptId, submit]);

  // Debounced autosave on every change.
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(save, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [answers, marked, confidence, save]);

  // Retry failed saves periodically (e.g. flaky mobile data).
  useEffect(() => {
    const t = setInterval(() => {
      if (dirty.current) void save();
    }, 15000);
    return () => clearInterval(t);
  }, [save]);

  // Best-effort flush when the tab is closed/hidden.
  useEffect(() => {
    const flush = () => {
      if (!dirty.current || submittedRef.current) return;
      fetch(`/api/attempts/${attemptId}/answers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload(),
        keepalive: true,
      }).catch(() => {});
      dirty.current = false;
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [attemptId]);

  // Countdown; auto-submit at zero.
  useEffect(() => {
    const tick = () => {
      const left = deadline - (Date.now() + skewRef.current);
      setRemaining(left);
      if (left <= 0) void submit();
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [deadline, submit]);

  const goTo = (i: number) => {
    const q = questions[i];
    if (!q) return;
    setCurrent(i);
    setVisited((v) => (v.has(q.id) ? v : new Set(v).add(q.id)));
    setPaletteOpen(false);
  };

  const q = questions[current];

  const choose = (key: OptionKey) => {
    dirty.current = true;
    setAnswers((a) => ({ ...a, [q.id]: key }));
  };

  const clearAnswer = () => {
    if (!(q.id in answers)) return;
    dirty.current = true;
    setAnswers((a) => {
      const next = { ...a };
      delete next[q.id];
      return next;
    });
    setConfidence((c) => {
      const next = { ...c };
      delete next[q.id];
      return next;
    });
  };

  const setSureness = (level: Confidence) => {
    dirty.current = true;
    setConfidence((c) => {
      const next = { ...c };
      if (next[q.id] === level) delete next[q.id]; // tap again to un-tag
      else next[q.id] = level;
      return next;
    });
  };

  const toggleMark = () => {
    dirty.current = true;
    setMarked((m) => {
      const next = new Set(m);
      if (next.has(q.id)) next.delete(q.id);
      else next.add(q.id);
      return next;
    });
  };

  const answeredCount = questions.filter((x) => x.id in answers).length;
  const markedCount = questions.filter((x) => marked.has(x.id)).length;
  const lowTime = remaining <= 5 * 60 * 1000;

  const text = (hi: string | null, en: string | null) => (lang === "hi" ? hi || en : en || hi) ?? "";

  const paletteClass = (id: string) => {
    const a = id in answers;
    const m = marked.has(id);
    if (a && m) return "bg-purple-600 text-white ring-2 ring-green-400";
    if (m) return "bg-purple-600 text-white";
    if (a) return "bg-green-600 text-white";
    if (visited.has(id)) return "bg-red-500/80 text-white";
    return "bg-slate-800 text-slate-300";
  };

  const palette = (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((x, i) => (
          <button
            key={x.id}
            onClick={() => goTo(i)}
            className={`h-9 rounded-md text-sm font-semibold ${paletteClass(x.id)} ${
              i === current ? "outline outline-2 outline-offset-2 outline-yellow-500" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-green-600" /> Answered / उत्तर दिया
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-red-500/80" /> Not answered / उत्तर नहीं दिया
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-purple-600" /> Marked for review / समीक्षा हेतु
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-slate-800" /> Not visited / नहीं देखा
        </li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900">
      {/* Header */}
      <div className="sticky z-20 border-b border-slate-800 bg-slate-900/95 backdrop-blur" style={{ top: navHeight }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">{testName}</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {saveState === "saving" && "Saving…"}
              {saveState === "saved" && "Saved"}
              {saveState === "error" && <span className="text-red-300">Offline — will retry</span>}
            </span>
            <div className="flex overflow-hidden rounded-lg border border-slate-700 text-xs">
              {(["hi", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => changeLang(l)}
                  className={`px-2.5 py-1.5 ${lang === l ? "bg-yellow-500 font-semibold text-slate-900" : "text-slate-300"}`}
                >
                  {l === "hi" ? "हिंदी" : "EN"}
                </button>
              ))}
            </div>
            <div
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${
                lowTime ? "bg-red-500/15 text-red-300" : "bg-slate-800 text-white"
              }`}
            >
              <Clock className="h-4 w-4" /> {formatClock(remaining)}
            </div>
            <button
              onClick={() => setPaletteOpen(true)}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-300 lg:hidden"
              aria-label="Question palette"
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Question */}
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-yellow-500">
                Question {current + 1} / {questions.length}
              </span>
              {q.subject && <span className="truncate text-xs text-slate-500">{q.subject}</span>}
            </div>

            <p className="whitespace-pre-line text-base leading-relaxed text-white">
              {text(q.text_hindi, q.text_english)}
            </p>

            <div className="mt-5 space-y-3">
              {q.options.map((o) => {
                const label = text(o.hindi, o.english);
                if (!label) return null;
                const selected = answers[q.id] === o.key;
                return (
                  <button
                    key={o.key}
                    onClick={() => choose(o.key)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-yellow-500 bg-yellow-500/10 text-white"
                        : "border-slate-700 text-slate-200 hover:border-slate-500"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        selected ? "bg-yellow-500 text-slate-900" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {o.key}
                    </span>
                    <span className="pt-0.5">{label}</span>
                  </button>
                );
              })}
            </div>

            {q.id in answers && (
              <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="mb-2 text-xs text-slate-400">
                  कितने निश्चित हैं? <span className="text-slate-500">/ How sure are you? (optional, for your guess analysis)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONFIDENCE_OPTIONS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setSureness(c.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs ${
                        confidence[q.id] === c.key
                          ? "border-sky-400 bg-sky-500/15 text-sky-200"
                          : "border-slate-700 text-slate-400 hover:border-slate-500"
                      }`}
                    >
                      {c.hi} / {c.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={toggleMark}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${
                  marked.has(q.id)
                    ? "border-purple-500 bg-purple-500/15 text-purple-200"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                <Bookmark className="h-4 w-4" />
                {marked.has(q.id) ? "Marked" : "Mark for review"}
              </button>
              <button
                onClick={clearAnswer}
                disabled={!(q.id in answers)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 disabled:opacity-40"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => goTo(current + 1)}
                  className="flex items-center gap-1 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-400"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop palette */}
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <div className="sticky rounded-2xl border border-slate-800 bg-slate-900/60 p-4" style={{ top: navHeight + 80 }}>
            {palette}
            <button
              onClick={() => setConfirmOpen(true)}
              className="mt-5 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500"
            >
              Submit Test / सबमिट करें
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile palette drawer */}
      {paletteOpen && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/60 lg:hidden" onClick={() => setPaletteOpen(false)}>
          <div className="h-full w-72 max-w-[85vw] overflow-y-auto bg-slate-900 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-white">Questions</span>
              <button onClick={() => setPaletteOpen(false)} aria-label="Close" className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            {palette}
            <button
              onClick={() => {
                setPaletteOpen(false);
                setConfirmOpen(true);
              }}
              className="mt-5 w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white"
            >
              Submit Test / सबमिट करें
            </button>
          </div>
        </div>
      )}

      {/* Submit confirmation (also shown while an auto-submit is in flight) */}
      {(confirmOpen || submitting || submitError) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-white">Submit test? / टेस्ट सबमिट करें?</h2>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-green-600/15 p-2">
                <dt className="text-[11px] text-slate-400">Answered</dt>
                <dd className="text-lg font-bold text-green-300">{answeredCount}</dd>
              </div>
              <div className="rounded-lg bg-slate-800 p-2">
                <dt className="text-[11px] text-slate-400">Unanswered</dt>
                <dd className="text-lg font-bold text-white">{questions.length - answeredCount}</dd>
              </div>
              <div className="rounded-lg bg-purple-600/15 p-2">
                <dt className="text-[11px] text-slate-400">Marked</dt>
                <dd className="text-lg font-bold text-purple-300">{markedCount}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">You can&apos;t change answers after submitting.</p>
            {submitError && <p className="mt-3 text-sm text-red-300">{submitError}</p>}
            <div className="mt-5 flex gap-3">
              {remaining > 0 && (
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    setSubmitError(null);
                  }}
                  disabled={submitting}
                  className="flex-1 rounded-lg border border-slate-700 py-2.5 text-sm text-slate-300 disabled:opacity-40"
                >
                  Go back
                </button>
              )}
              <button
                onClick={() => void submit()}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitError ? "Retry" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

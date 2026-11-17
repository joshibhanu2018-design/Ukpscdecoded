"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UK_DISTRICTS } from "@/lib/districts";
import T from "@/components/T";

export type KeyPaper = {
  id: string;
  name: string;
  nameHi: string;
  questions: number;
  marksPerQuestion: number;
  negativePerWrong: number;
  sets: Record<string, string>;
};

const LEAD_KEY = "ukd-answer-key-lead";
const OPTIONS = ["A", "B", "C", "D"] as const;
const input =
  "min-h-[48px] w-full rounded-lg border border-graphite-700 bg-graphite-900 px-3 text-base text-white placeholder:text-graphite-500 focus:border-saffron-400 focus:outline-none";

/**
 * Step 1: name + mobile + district (saved through /api/mock-registrations).
 * Step 2 (only once the key is published): pick the booklet set, tap the
 * answers, and the score is worked out on the phone itself.
 */
export default function AnswerKeyTool({ published, papers }: { published: boolean; papers: KeyPaper[] }) {
  const [lead, setLead] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", district: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(LEAD_KEY)) setLead(true);
    } catch {
      /* storage unavailable: the form is shown again */
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/mock-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "answer-key", page: "/answer-key" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      try {
        localStorage.setItem(LEAD_KEY, "1");
      } catch {
        /* ignore */
      }
      setLead(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!lead) {
    return (
      <form onSubmit={submit} className="space-y-3 rounded-2xl border border-saffron-400/50 bg-graphite-900 p-5 sm:p-6">
        <p className="font-display text-lg font-bold text-white">
          {published ? (
            <T en="Check your score in 2 minutes" hi="2 मिनट में अपना स्कोर देखें" />
          ) : (
            <T en="Get the answer key on WhatsApp on exam evening" hi="परीक्षा की शाम उत्तर कुंजी WhatsApp पर पाएं" />
          )}
        </p>
        <input
          className={input}
          placeholder="Full name / पूरा नाम"
          autoComplete="name"
          value={form.full_name}
          onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          required
        />
        <input
          className={input}
          placeholder="Mobile number (WhatsApp) / मोबाइल नंबर"
          inputMode="numeric"
          autoComplete="tel-national"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
          required
        />
        <select className={input} value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} required>
          <option value="">Your district / आपका ज़िला</option>
          {UK_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-danger-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="min-h-[48px] w-full rounded-lg bg-saffron-400 px-5 text-base font-bold text-graphite-950 hover:bg-saffron-300 disabled:opacity-60"
        >
          {busy ? "…" : published ? <T en="Show the answer key" hi="उत्तर कुंजी दिखाएं" /> : <T en="Send me the answer key" hi="मुझे उत्तर कुंजी भेजें" />}
        </button>
        <p className="text-xs text-graphite-400">
          <T
            en="We use your number only for the answer key, your result and our course updates. See the Privacy Policy."
            hi="आपका नंबर सिर्फ उत्तर कुंजी, रिज़ल्ट और हमारे कोर्स की जानकारी के लिए इस्तेमाल होगा। प्राइवेसी पॉलिसी देखें।"
          />
        </p>
      </form>
    );
  }

  if (!published) {
    return (
      <div className="rounded-2xl border border-jade-500/50 bg-jade-500/10 p-5 sm:p-6">
        <p className="font-display text-lg font-bold text-white">
          <T en="Done. You are on the list." hi="हो गया। आपका नाम सूची में है।" />
        </p>
        <p className="mt-1 text-sm text-graphite-300">
          <T
            en="We will message you on WhatsApp when the answer key is up. Come back to this page on exam evening to check your score."
            hi="उत्तर कुंजी आते ही हम आपको WhatsApp पर मैसेज करेंगे। परीक्षा की शाम इसी पेज पर आकर अपना स्कोर देखें।"
          />
        </p>
      </div>
    );
  }

  return <Calculator papers={papers} />;
}

function Calculator({ papers }: { papers: KeyPaper[] }) {
  const [paperId, setPaperId] = useState(papers[0]?.id ?? "");
  const paper = papers.find((p) => p.id === paperId) ?? papers[0];
  const setNames = useMemo(() => Object.keys(paper?.sets ?? {}).filter((s) => (paper.sets[s] ?? "").trim().length > 0), [paper]);
  const [setName, setSetName] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!paper) return null;
  const key = setName ? paper.sets[setName].trim().toUpperCase() : "";

  let correct = 0;
  let wrong = 0;
  let counted = 0;
  for (let i = 0; i < key.length; i++) {
    if (!OPTIONS.includes(key[i] as (typeof OPTIONS)[number])) continue; // X = question ignored
    counted++;
    const a = answers[i];
    if (!a) continue;
    if (a === key[i]) correct++;
    else wrong++;
  }
  const score = correct * paper.marksPerQuestion - wrong * paper.negativePerWrong;
  const maxMarks = counted * paper.marksPerQuestion;

  return (
    <div className="space-y-5">
      {papers.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {papers.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPaperId(p.id);
                setSetName("");
                setAnswers({});
              }}
              className={`min-h-[44px] rounded-lg border px-4 text-sm font-semibold ${
                p.id === paper.id ? "border-saffron-400 bg-saffron-400 text-graphite-950" : "border-graphite-700 text-graphite-200"
              }`}
            >
              <T en={p.name} hi={p.nameHi} />
            </button>
          ))}
        </div>
      )}

      <div>
        <p className="font-semibold text-white">
          <T en="1. Which booklet set did you get?" hi="1. आपको कौन सा बुकलेट सेट मिला था?" />
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {setNames.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSetName(s);
                setAnswers({});
              }}
              aria-pressed={setName === s}
              className={`min-h-[48px] min-w-[64px] rounded-lg border px-4 text-base font-bold ${
                setName === s ? "border-saffron-400 bg-saffron-400 text-graphite-950" : "border-graphite-700 bg-graphite-900 text-graphite-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {setName && (
        <>
          <div>
            <p className="font-semibold text-white">
              <T en="2. Tap the answer you marked (leave blank if you skipped)" hi="2. जो उत्तर आपने लगाया था उसे दबाएं (छोड़ा हुआ प्रश्न खाली रहने दें)" />
            </p>
            <ol className="mt-3 space-y-1.5">
              {Array.from({ length: key.length }, (_, i) => {
                const ignored = !OPTIONS.includes(key[i] as (typeof OPTIONS)[number]);
                const mine = answers[i];
                return (
                  <li key={i} className="flex items-center gap-2 rounded-lg border border-graphite-800 bg-graphite-900 px-2 py-1.5">
                    <span className="w-9 flex-shrink-0 text-right text-sm font-bold text-graphite-300">{i + 1}.</span>
                    {ignored ? (
                      <span className="text-sm text-graphite-400">
                        <T en="Not counted" hi="गिना नहीं गया" />
                      </span>
                    ) : (
                      <>
                        {OPTIONS.map((o) => {
                          const picked = mine === o;
                          const isKey = key[i] === o;
                          return (
                            <button
                              key={o}
                              type="button"
                              onClick={() => setAnswers((a) => ({ ...a, [i]: picked ? "" : o }))}
                              aria-pressed={picked}
                              className={`on-color h-10 w-10 flex-shrink-0 rounded-lg border text-sm font-bold ${
                                picked
                                  ? isKey
                                    ? "border-success-600 bg-success-600 text-white"
                                    : "border-danger-600 bg-danger-600 text-white"
                                  : "border-graphite-600 text-graphite-900"
                              }`}
                            >
                              {o}
                            </button>
                          );
                        })}
                        <span className="ml-auto flex-shrink-0 text-xs font-semibold text-success-400">
                          <T en="Key" hi="सही" />: {key[i]}
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="sticky bottom-0 z-20 -mx-4 border-t border-graphite-800 bg-graphite-950/95 px-4 py-3 backdrop-blur">
            <p className="text-center font-display text-2xl font-bold text-white">
              {Math.round(score * 100) / 100} / {maxMarks}
            </p>
            <p className="text-center text-xs text-graphite-300">
              <T en={<>Right {correct} · Wrong {wrong} · Left {counted - correct - wrong}</>} hi={<>सही {correct} · गलत {wrong} · छोड़े {counted - correct - wrong}</>} />
            </p>
          </div>

          <div className="rounded-2xl border border-saffron-400/40 bg-saffron-400/5 p-5">
            <p className="font-display text-lg font-bold text-white">
              <T en="What next?" hi="आगे क्या?" />
            </p>
            <p className="mt-1 text-sm text-graphite-300">
              <T
                en="This is an unofficial score. See our courses and test series for the next stage."
                hi="यह अनौपचारिक स्कोर है। अगले चरण के लिए हमारे कोर्स और टेस्ट सीरीज़ देखें।"
              />
            </p>
            <Link
              href="/courses"
              className="mt-3 inline-flex min-h-[44px] items-center rounded-lg bg-saffron-400 px-5 text-sm font-bold text-graphite-950 hover:bg-saffron-300"
            >
              <T en="See courses" hi="कोर्स देखें" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

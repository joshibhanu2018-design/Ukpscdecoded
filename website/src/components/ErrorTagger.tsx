"use client";

import { useState } from "react";
import type { ErrorType } from "@/lib/tests";

const OPTIONS: { key: ErrorType; label: string }[] = [
  { key: "concept", label: "अवधारणा / Concept" },
  { key: "recall", label: "तथ्य / Recall" },
  { key: "misread", label: "गलत पढ़ा / Misread" },
  { key: "silly", label: "लापरवाही / Silly" },
  { key: "time", label: "समय / Time" },
];

/** "Why did I get this wrong?" chips under a wrong/skipped question on the result page. */
export default function ErrorTagger({
  attemptId,
  questionId,
  initial,
}: {
  attemptId: string;
  questionId: string;
  initial: ErrorType | null;
}) {
  const [tag, setTag] = useState<ErrorType | null>(initial);
  const [failed, setFailed] = useState(false);

  const pick = async (next: ErrorType) => {
    const value = tag === next ? null : next; // tap again to clear
    const previous = tag;
    setTag(value);
    setFailed(false);
    const res = await fetch(`/api/attempts/${attemptId}/error-tags`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, tag: value }),
    }).catch(() => null);
    if (!res?.ok) {
      setTag(previous);
      setFailed(true);
    }
  };

  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs text-slate-300">गलती क्यों हुई? / Why did this go wrong?</p>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => pick(o.key)}
            className={`rounded-full border px-2.5 py-1 text-[11px] ${
              tag === o.key ? "border-sky-400 bg-sky-500/15 text-sky-200" : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {failed && <p className="mt-1 text-[11px] text-red-300">Couldn&apos;t save — try again.</p>}
    </div>
  );
}

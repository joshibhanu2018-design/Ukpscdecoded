"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { REPORT_REASONS, REPORT_REASON_LABEL, type ReportReason } from "@/lib/question-reports";

/** "Report error / गलती बताएँ" under a question in the answer review. */
export default function ReportQuestion({ attemptId, questionId }: { attemptId: string; questionId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    if (!reason) return;
    setState("sending");
    setError(null);
    const res = await fetch(`/api/attempts/${attemptId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, reason, note }),
    }).catch(() => null);
    if (res?.ok) {
      setState("sent");
      return;
    }
    const data = await res?.json().catch(() => ({}));
    setError(data?.error || "Couldn't send — try again.");
    setState("idle");
  };

  if (state === "sent") {
    return (
      <p className="mt-3 text-xs text-green-300">धन्यवाद! हम इसे जाँचेंगे। / Thanks — we&apos;ll check this question.</p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700 px-3 text-xs text-slate-300 hover:border-orange-400/60 hover:text-orange-200"
      >
        <Flag className="h-3.5 w-3.5" /> गलती बताएँ / Report error
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-orange-400/30 bg-orange-500/5 p-3">
      <p className="mb-2 text-xs font-semibold text-orange-200">क्या गलत है? / What&apos;s wrong?</p>
      <div className="flex flex-wrap gap-1.5">
        {REPORT_REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            aria-pressed={reason === r}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              reason === r ? "border-orange-300 bg-orange-500/20 text-orange-100" : "border-slate-600 text-slate-300 hover:border-slate-400"
            }`}
          >
            {REPORT_REASON_LABEL[r].hi} / {REPORT_REASON_LABEL[r].en}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={1000}
        rows={2}
        placeholder="सही उत्तर या स्रोत (वैकल्पिक) / Correct answer or source (optional)"
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-orange-300"
      />
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={send}
          disabled={!reason || state === "sending"}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-orange-400 px-4 text-xs font-semibold text-slate-900 disabled:opacity-50"
        >
          {state === "sending" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} भेजें / Send
        </button>
        <button type="button" onClick={() => setOpen(false)} className="min-h-[36px] px-3 text-xs text-slate-300 hover:text-white">
          रद्द / Cancel
        </button>
      </div>
    </div>
  );
}

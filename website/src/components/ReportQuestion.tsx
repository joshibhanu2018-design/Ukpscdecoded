"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { REPORT_REASONS, REPORT_REASON_LABEL, type ReportReason } from "@/lib/question-reports";

/** "Report error" under a question in the answer review. */
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
      <p className="mt-3 text-xs text-success-300">Thanks — we&apos;ll check this question.</p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-graphite-700 px-3 text-xs text-graphite-300 hover:border-saffron-400/60 hover:text-saffron-200"
      >
        <Flag className="h-3.5 w-3.5" /> Report error
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg border border-saffron-400/30 bg-saffron-500/5 p-3">
      <p className="mb-2 text-xs font-semibold text-saffron-200">What&apos;s wrong?</p>
      <div className="flex flex-wrap gap-1.5">
        {REPORT_REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            aria-pressed={reason === r}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              reason === r ? "border-saffron-300 bg-saffron-500/20 text-saffron-100" : "border-graphite-600 text-graphite-300 hover:border-graphite-400"
            }`}
          >
            {REPORT_REASON_LABEL[r].en}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={1000}
        rows={2}
        placeholder="Correct answer or source (optional)"
        className="mt-2 w-full rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none placeholder:text-graphite-400 focus:border-saffron-300"
      />
      {error && <p className="mt-1 text-xs text-danger-300">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={send}
          disabled={!reason || state === "sending"}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-saffron-400 px-4 text-xs font-semibold text-graphite-900 disabled:opacity-50"
        >
          {state === "sending" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Send
        </button>
        <button type="button" onClick={() => setOpen(false)} className="min-h-[36px] px-3 text-xs text-graphite-300 hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  );
}

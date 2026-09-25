"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";

/** Deactivate / reactivate one question from Admin → Question Bank. */
export function StatusButton({ questionId, inactive }: { questionId: string; inactive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const action = inactive ? "reactivate" : "deactivate";

  const act = async () => {
    if (!inactive && !confirm("Deactivate this question? It will be left out of every test started from now on.")) return;
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/question-bank", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, action }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      router.refresh();
      return;
    }
    const data = await res?.json().catch(() => ({}));
    setError(data?.error || "Failed — try again.");
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={act}
        disabled={busy}
        className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-4 text-sm font-semibold disabled:opacity-50 ${
          inactive ? "bg-green-500 text-slate-900" : "border border-red-400/60 text-red-200 hover:bg-red-500/10"
        }`}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} {inactive ? "Reactivate question" : "Deactivate question"}
      </button>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

/** Copies the listed Question IDs (one per line) — handy for telling Claude which questions to prefer. */
export function CopyIds({ ids }: { ids: string[] }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ids.join("\n"));
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      disabled={ids.length === 0}
      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 hover:border-yellow-500/60 disabled:opacity-50"
    >
      {done ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />} Copy IDs on this page
    </button>
  );
}

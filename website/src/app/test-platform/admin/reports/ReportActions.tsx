"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ReportActions({ questionId }: { questionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"resolve" | "deactivate" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (action: "resolve" | "deactivate") => {
    if (action === "deactivate" && !confirm("Deactivate this question? It will be left out of every test started from now on.")) return;
    setBusy(action);
    setError(null);
    const res = await fetch("/api/admin/question-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, action }),
    }).catch(() => null);
    setBusy(null);
    if (res?.ok) {
      router.refresh();
      return;
    }
    const data = await res?.json().catch(() => ({}));
    setError(data?.error || "Failed — try again.");
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => act("resolve")}
          disabled={busy !== null}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-green-500 px-4 text-sm font-semibold text-slate-900 disabled:opacity-50"
        >
          {busy === "resolve" && <Loader2 className="h-4 w-4 animate-spin" />} Resolve
        </button>
        <button
          type="button"
          onClick={() => act("deactivate")}
          disabled={busy !== null}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-red-400/60 px-4 text-sm font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-50"
        >
          {busy === "deactivate" && <Loader2 className="h-4 w-4 animate-spin" />} Deactivate question
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

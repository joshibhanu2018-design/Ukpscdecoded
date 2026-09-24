"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";

export default function StartTestButton({ testId, label }: { testId: string; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tests/${testId}/start`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.attempt_id) {
        setError(data.error || "Could not start the test. Please try again.");
        setLoading(false);
        return;
      }
      router.push(`/test-platform/attempts/${data.attempt_id}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={start}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {label}
      </button>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelBookingButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const cancel = async () => {
    if (!confirm("इस सत्र को रद्द करें? / Cancel this session?")) return;
    const res = await fetch(`/api/mentorship/book/${id}`, { method: "DELETE" }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok) return setError(data?.error || "Could not cancel");
    router.refresh();
  };
  return (
    <div>
      <button onClick={cancel} className="text-xs text-red-300 hover:text-red-200">
        रद्द करें / Cancel
      </button>
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

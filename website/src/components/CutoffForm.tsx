"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CutoffForm({ cutoff, total }: { cutoff: number; total: number }) {
  const router = useRouter();
  const [c, setC] = useState(String(cutoff));
  const [t, setT] = useState(String(total));
  const [msg, setMsg] = useState<string | null>(null);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/mentorship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_cutoff", cutoff: Number(c), total: Number(t) }),
    });
    const d = await res.json().catch(() => ({}));
    setMsg(res.ok ? "Saved" : d.error || "Failed");
    if (res.ok) router.refresh();
  };
  const input = "w-20 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-100";
  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
      Expected cutoff <input value={c} onChange={(e) => setC(e.target.value)} inputMode="decimal" className={input} /> out of{" "}
      <input value={t} onChange={(e) => setT(e.target.value)} inputMode="decimal" className={input} />
      <button className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-slate-900">Save</button>
      {msg && <span className="text-xs text-slate-400">{msg}</span>}
    </form>
  );
}

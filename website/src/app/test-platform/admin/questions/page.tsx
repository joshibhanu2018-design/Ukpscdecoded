"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import ExcelParser from "@/components/ExcelParser";

export default function AdminQuestionsPage() {
  const [secret, setSecret] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-900 px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (secret.trim()) setUnlocked(true);
          }}
          className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl"
        >
          <div className="mb-5 text-center">
            <Lock className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="mt-1 text-sm text-slate-400">Enter the admin import secret to continue.</p>
          </div>
          <input
            type="password"
            required
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-white">Import Questions</h1>
        <p className="mb-6 text-sm text-slate-400">
          Upload an Excel sheet to bulk-add questions to the question bank.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <ExcelParser adminSecret={secret} />
        </div>
      </div>
    </div>
  );
}

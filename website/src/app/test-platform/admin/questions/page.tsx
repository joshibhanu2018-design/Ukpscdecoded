"use client";

import ExcelParser from "@/components/ExcelParser";

export default function AdminQuestionsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-white">Import Questions</h1>
        <p className="mb-6 text-sm text-slate-400">
          Upload an Excel sheet to bulk-add questions to the question bank.
        </p>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <ExcelParser />
        </div>
      </div>
    </div>
  );
}

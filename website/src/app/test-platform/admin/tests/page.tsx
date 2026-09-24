"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type AdminPackage = { id: string; package_name: string; package_type: string };
type AdminTest = {
  id: string;
  test_name: string;
  total_questions: number;
  duration_minutes: number;
  is_free_test: boolean;
  release_at: string | null;
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30";

export default function AdminTestsPage() {
  const [packages, setPackages] = useState<AdminPackage[] | null>(null);
  const [tests, setTests] = useState<AdminTest[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("120");
  const [marks, setMarks] = useState("1");
  const [negative, setNegative] = useState("0.33");
  const [isFree, setIsFree] = useState(false);
  const [releaseAt, setReleaseAt] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<Set<string>>(new Set());
  const [codes, setCodes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = async () => {
    setLoadError(null);
    const res = await fetch("/api/admin/tests");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoadError(data.error || "Could not load");
      return;
    }
    setPackages(data.packages);
    setTests(data.tests);
  };

  useEffect(() => {
    void load();
  }, []);

  if (!packages) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-900 px-4 text-sm text-slate-400">
        {loadError ?? "Loading…"}
      </div>
    );
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const question_codes = codes.split(/[\s,]+/).map((c) => c.trim()).filter(Boolean);
    const res = await fetch("/api/admin/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        test_name: name,
        duration_minutes: Number(duration),
        marks_per_question: Number(marks),
        negative_marking_value: Number(negative),
        is_free_test: isFree,
        // datetime-local has no timezone; the browser's local time (IST) is what the admin means.
        release_at: releaseAt ? new Date(releaseAt).toISOString() : null,
        package_ids: [...selectedPackages],
        question_codes,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      const extra = [
        data.missing?.length ? `Not found: ${data.missing.join(", ")}` : "",
        data.duplicated?.length ? `Duplicate IDs in question bank: ${data.duplicated.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      setMessage({ ok: false, text: `${data.error || "Failed"}${extra ? ` — ${extra}` : ""}` });
      return;
    }
    setMessage({ ok: true, text: `Created "${name}" with ${data.total_questions} questions.` });
    setName("");
    setCodes("");
    void load();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-white">Create Test</h1>
        <p className="mb-6 text-sm text-slate-400">
          Build a test from questions already imported into the question bank.
        </p>

        <form onSubmit={create} className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Test name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="UKPSC Mock Test 1" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Duration (min)</label>
              <input type="number" min={1} required value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Marks / question</label>
              <input type="number" step="0.01" min={0.01} required value={marks} onChange={(e) => setMarks(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Negative (fraction)</label>
              <input type="number" step="0.01" min={0} max={1} required value={negative} onChange={(e) => setNegative(e.target.value)} className={inputClass} />
            </div>
          </div>
          <p className="-mt-3 text-xs text-slate-500">
            Negative is a fraction of the marks per question: 0.33 = one-third deducted per wrong answer, 0 = no negative marking.
          </p>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Release at (optional — leave empty to release now)</label>
            <input type="datetime-local" value={releaseAt} onChange={(e) => setReleaseAt(e.target.value)} className={inputClass} />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Free test (any logged-in student can take it)
          </label>

          <div>
            <p className="mb-2 text-sm text-slate-300">Add to packages</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {packages.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedPackages.has(p.id)}
                    onChange={(e) =>
                      setSelectedPackages((s) => {
                        const next = new Set(s);
                        if (e.target.checked) next.add(p.id);
                        else next.delete(p.id);
                        return next;
                      })
                    }
                  />
                  {p.package_name} <span className="text-xs text-slate-500">({p.package_type})</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              A combo bundle unlocks its component packages automatically — add the test to the test-series package, not the combo.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Question IDs, in order</label>
            <textarea
              required
              rows={6}
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              className={`${inputClass} font-mono`}
              placeholder={"UKGK-001\nUKGK-002\nUKGK-003"}
            />
            <p className="mt-1 text-xs text-slate-500">
              The questionId column from your import sheet — one per line or comma-separated. You can paste a column straight from Excel.
            </p>
          </div>

          {message && (
            <p className={`flex items-start gap-2 text-sm ${message.ok ? "text-green-300" : "text-red-300"}`}>
              {message.ok && <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />}
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-yellow-400 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Test
          </button>
        </form>

        {tests.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 font-semibold text-white">Existing tests</h2>
            <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60 text-sm">
              {tests.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                  <span className="text-white">
                    {t.test_name}
                    {t.is_free_test && <span className="ml-2 text-xs text-green-400">Free</span>}
                  </span>
                  <span className="text-xs text-slate-400">
                    {t.total_questions} Q · {t.duration_minutes} min
                    {t.release_at && ` · releases ${new Date(t.release_at).toLocaleString("en-IN")}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

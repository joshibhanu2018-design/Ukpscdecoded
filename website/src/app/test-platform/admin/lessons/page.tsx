"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Loader2 } from "lucide-react";

type VideoPackage = { id: string; package_name: string; slug: string | null };
type AdminLesson = {
  id: string;
  package_id: string;
  title: string;
  description: string | null;
  youtube_id: string;
  sort_order: number;
  release_at: string | null;
  is_active: boolean;
  views: number;
};
type Student = { email: string; watched: number } | { email: string; notFound: true } | null;

const inputClass =
  "w-full rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-sm text-graphite-100 outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/30";

/** ISO timestamp → value for a datetime-local input, in the browser's (IST) time. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function AdminLessonsPage() {
  const [packages, setPackages] = useState<VideoPackage[] | null>(null);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [packageId, setPackageId] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [youtube, setYoutube] = useState("");
  const [description, setDescription] = useState("");
  const [releaseAt, setReleaseAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const [lookupEmail, setLookupEmail] = useState("");
  const [student, setStudent] = useState<Student>(null);

  const load = useCallback(async (email?: string) => {
    setLoadError(null);
    const res = await fetch(`/api/admin/lessons${email ? `?email=${encodeURIComponent(email)}` : ""}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoadError(data.error || "Could not load");
      return;
    }
    setPackages(data.packages);
    setLessons(data.lessons);
    if (email) setStudent(data.student);
    setPackageId((cur) => cur || data.packages[0]?.id || "");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!packages) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-graphite-950 px-4 text-sm text-graphite-300">
        {loadError ?? "Loading…"}
      </div>
    );
  }

  const courseLessons = lessons.filter((l) => l.package_id === packageId);
  const pkg = packages.find((p) => p.id === packageId);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setYoutube("");
    setDescription("");
    setReleaseAt("");
  };

  const send = async (method: "POST" | "PATCH", body: Record<string, unknown>) => {
    const res = await fetch("/api/admin/lessons", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok ? null : data.error || "Failed";
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const fields = {
      title,
      youtube,
      description,
      // datetime-local has no timezone; the browser's local time (IST) is what the admin means.
      release_at: releaseAt ? new Date(releaseAt).toISOString() : null,
    };
    const error = editingId
      ? await send("PATCH", { id: editingId, ...fields })
      : await send("POST", { package_id: packageId, ...fields });
    setSaving(false);
    if (error) {
      setMessage({ ok: false, text: error });
      return;
    }
    setMessage({ ok: true, text: editingId ? `Updated "${title}".` : `Added "${title}".` });
    resetForm();
    void load();
  };

  const edit = (l: AdminLesson) => {
    setEditingId(l.id);
    setTitle(l.title);
    setYoutube(`https://youtu.be/${l.youtube_id}`);
    setDescription(l.description ?? "");
    setReleaseAt(toLocalInput(l.release_at));
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const move = async (index: number, dir: -1 | 1) => {
    const a = courseLessons[index];
    const b = courseLessons[index + dir];
    if (!a || !b) return;
    // Renumber the whole list so equal/missing sort_orders can't make a swap a no-op.
    const order = courseLessons.map((l) => l.id);
    [order[index], order[index + dir]] = [order[index + dir], order[index]];
    await Promise.all(
      order.map((id, i) => {
        const l = courseLessons.find((x) => x.id === id)!;
        return l.sort_order === i + 1 ? null : send("PATCH", { id, sort_order: i + 1 });
      }),
    );
    void load();
  };

  const toggle = async (l: AdminLesson) => {
    const error = await send("PATCH", { id: l.id, is_active: !l.is_active });
    if (error) setMessage({ ok: false, text: error });
    void load();
  };

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-bold text-white">Video Lessons</h1>
        <p className="mb-6 text-sm text-graphite-300">
          Upload the video to YouTube as <strong className="text-white">Unlisted</strong>, then paste its link here. Only
          enrolled students see lessons.
        </p>

        {packages.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-graphite-700 p-6 text-center text-sm text-graphite-300">
            No video course found.
          </p>
        ) : (
          <>
            {packages.length > 1 && (
              <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className={`${inputClass} mb-4`}>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.package_name}
                  </option>
                ))}
              </select>
            )}

            <form onSubmit={save} className="space-y-4 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6">
              <p className="text-sm font-semibold text-white">
                {editingId ? "Edit lesson" : "Add lesson"} · <span className="text-graphite-300">{pkg?.package_name}</span>
              </p>
              <div>
                <label className="mb-1 block text-sm text-graphite-300">Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Day 1 — Uttarakhand History" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-graphite-300">YouTube link</label>
                <input required value={youtube} onChange={(e) => setYoutube(e.target.value)} className={inputClass} placeholder="https://youtu.be/..." />
              </div>
              <div>
                <label className="mb-1 block text-sm text-graphite-300">Notes (optional)</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="Topics covered, PDF link…" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-graphite-300">Release at (optional — leave empty to show now)</label>
                <input type="datetime-local" value={releaseAt} onChange={(e) => setReleaseAt(e.target.value)} className={inputClass} />
              </div>

              {message && (
                <p className={`flex items-start gap-2 text-sm ${message.ok ? "text-success-300" : "text-danger-300"}`}>
                  {message.ok && <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />}
                  {message.text}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-saffron-400 px-5 py-2.5 text-sm font-semibold text-graphite-900 hover:bg-saffron-300 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Save changes" : "Add lesson"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-lg border border-graphite-700 px-4 py-2.5 text-sm text-graphite-300">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-white">Lessons ({courseLessons.length})</h2>
                {pkg?.slug && (
                  <a href={`/test-platform/lessons/${pkg.slug}`} className="text-sm text-saffron-300 hover:underline">
                    Preview as student →
                  </a>
                )}
              </div>
              {courseLessons.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-graphite-700 p-6 text-center text-sm text-graphite-300">
                  No lessons yet.
                </p>
              ) : (
                <ul className="divide-y divide-graphite-800 rounded-2xl border border-graphite-800 bg-graphite-900/60 text-sm">
                  {courseLessons.map((l, i) => (
                    <li key={l.id} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${l.is_active ? "" : "opacity-50"}`}>
                      <span className="w-5 text-xs text-graphite-300">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-white">
                          {l.title}
                          {!l.is_active && <span className="ml-2 text-xs text-danger-300">Hidden</span>}
                        </span>
                        <span className="text-xs text-graphite-300">
                          {l.views} student{l.views === 1 ? "" : "s"} watched
                          {l.release_at && ` · releases ${new Date(l.release_at).toLocaleString("en-IN")}`}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="rounded p-1.5 text-graphite-300 hover:bg-graphite-800 disabled:opacity-30">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label="Move down" disabled={i === courseLessons.length - 1} onClick={() => move(i, 1)} className="rounded p-1.5 text-graphite-300 hover:bg-graphite-800 disabled:opacity-30">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => edit(l)} className="rounded px-2 py-1 text-xs text-saffron-300 hover:bg-graphite-800">
                          Edit
                        </button>
                        <button type="button" onClick={() => toggle(l)} className="rounded px-2 py-1 text-xs text-graphite-300 hover:bg-graphite-800">
                          {l.is_active ? "Hide" : "Show"}
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-10 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6">
              <h2 className="mb-1 font-semibold text-white">Refund check</h2>
              <p className="mb-3 text-xs text-graphite-300">How many lessons a student has opened (refund only if fewer than 3).</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (lookupEmail.trim()) void load(lookupEmail.trim());
                }}
                className="flex gap-2"
              >
                <input type="email" value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} className={inputClass} placeholder="student@email.com" />
                <button type="submit" className="flex-shrink-0 rounded-lg border border-graphite-700 px-4 py-2 text-sm text-graphite-300 hover:border-saffron-400">
                  Check
                </button>
              </form>
              {student && (
                <p className="mt-3 text-sm text-white">
                  {"notFound" in student
                    ? `No account found for ${student.email}.`
                    : `${student.email} has watched ${student.watched} lesson${student.watched === 1 ? "" : "s"}.`}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

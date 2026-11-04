"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UK_DISTRICTS } from "@/lib/districts";

const input =
  "min-h-[44px] w-full rounded-lg border border-graphite-700 bg-graphite-950 px-3 text-sm text-white placeholder:text-graphite-500 focus:border-saffron-400 focus:outline-none";

/** Free Mock 1 sign-up: name, mobile, email, district. Logged-in students only pick a district. */
export default function JoinForm({ freeTestId, loggedIn }: { freeTestId: string; loggedIn: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", district: "" });
  const [error, setError] = useState("");
  const [loginNeeded, setLoginNeeded] = useState(false);
  const [busy, setBusy] = useState(false);
  const target = `/test-platform/tests/${freeTestId}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/mahasangram/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push(target);
        return;
      }
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoginNeeded(data.reason === "login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={submit} className="space-y-3">
      {!loggedIn && (
        <>
          <input className={input} placeholder="Full name (shown on the rank list)" value={form.full_name} onChange={set("full_name")} required />
          <input className={input} placeholder="Mobile number (WhatsApp)" inputMode="numeric" value={form.phone} onChange={set("phone")} required />
          <input className={input} placeholder="Email" type="email" value={form.email} onChange={set("email")} required />
        </>
      )}
      <select className={input} value={form.district} onChange={set("district")} required>
        <option value="">Your district</option>
        {UK_DISTRICTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-danger-400">
          {error}{" "}
          {loginNeeded && (
            <a href={`/student/login?next=${encodeURIComponent(target)}`} className="font-semibold text-saffron-300 underline">
              Log in
            </a>
          )}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="min-h-[44px] w-full rounded-lg bg-saffron-400 px-5 text-sm font-bold text-graphite-900 hover:bg-saffron-300 disabled:opacity-60"
      >
        {busy ? "Please wait…" : "Join free Mock 1"}
      </button>
      {!loggedIn && (
        <p className="text-xs text-graphite-400">
          Already have an account?{" "}
          <a href={`/student/login?next=${encodeURIComponent("/mahasangram")}`} className="text-saffron-300 underline">
            Log in
          </a>
        </p>
      )}
    </form>
  );
}

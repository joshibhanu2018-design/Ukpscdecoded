"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Phone } from "lucide-react";
import { PHONE_ERROR, PHONE_RE } from "@/lib/phone";

/** Shown on the dashboard to students who signed up before the mobile number was asked at sign-up. */
export default function AddPhoneCard() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!PHONE_RE.test(phone)) {
      setError(PHONE_ERROR);
      return;
    }
    setBusy(true);
    const res = await fetch("/api/auth/update-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      const data = await res?.json().catch(() => ({}));
      setError(data?.error || "Could not save. Please try again.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={save} className="mb-6 rounded-xl border border-saffron-400/30 bg-saffron-400/10 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-white">
        <Phone className="h-4 w-4 text-saffron-400" /> Add your mobile number
      </p>
      <p className="mt-1 text-xs text-graphite-300">For course updates and doubt support on call or WhatsApp. We never share it.</p>
      <div className="mt-3 flex gap-2">
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="10-digit mobile number"
          aria-label="Mobile number"
          className="min-w-0 flex-1 rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-base text-graphite-100 outline-none focus:border-saffron-400"
        />
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-1 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-saffron-300 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-400">{error}</p>}
    </form>
  );
}

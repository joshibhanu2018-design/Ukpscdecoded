"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "If this email is registered, you will receive a reset link.");
    } catch {
      // Same generic message even on a network error — never leak a
      // different state to the client.
      setMessage("If this email is registered, you will receive a reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (message) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p>यह ईमेल रजिस्टर्ड है तो आपको रीसेट लिंक मिलेगा।</p>
            <p className="mt-1 text-green-400/80">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
          ईमेल / Email
        </label>
        <input
          id="email"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Reset Link
      </button>
    </form>
  );
}

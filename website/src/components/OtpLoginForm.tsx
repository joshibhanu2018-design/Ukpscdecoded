"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

type Step = "email" | "code" | "name";

const RESEND_COOLDOWN_S = 60;

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30";
const buttonClass =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-base font-bold text-slate-900 transition-colors hover:bg-yellow-400 disabled:opacity-60";

export default function OtpLoginForm({ next = "/test-platform" }: { next?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  const post = async (url: string, body: unknown) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  };

  const finish = () => {
    router.push(next);
    router.refresh();
  };

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await post("/api/auth/otp/request", { email });
      if (!ok) {
        setError(data.error || "Could not send the code.");
        return;
      }
      setCode("");
      setStep("code");
      setCooldown(RESEND_COOLDOWN_S);
    } catch {
      setError("नेटवर्क त्रुटि / Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (value: string) => {
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await post("/api/auth/otp/verify", { email, code: value });
      if (!ok) {
        setError(data.error || "Incorrect code.");
        setCode("");
        return;
      }
      if (data.needs_name) {
        setTicket(data.ticket);
        setStep("name");
        return;
      }
      finish();
    } catch {
      setError("नेटवर्क त्रुटि / Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await post("/api/auth/otp/complete", { ticket, full_name: name });
      if (!ok) {
        setError(data.error || "Could not create your account.");
        if (data.reason === "ticket") setStep("email");
        return;
      }
      finish();
    } catch {
      setError("नेटवर्क त्रुटि / Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const errorBox = error && (
    <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
      {error}
    </div>
  );

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
            ईमेल / Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        {errorBox}
        <button type="submit" disabled={loading} className={buttonClass}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
          कोड भेजें / Send code
        </button>
        <p className="text-center text-xs text-slate-500">
          नया ईमेल? खाता अपने-आप बन जाएगा। / New here? Your account is created automatically.
        </p>
      </form>
    );
  }

  if (step === "code") {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) void verify(code);
        }}
        className="space-y-4"
      >
        <p className="text-sm text-slate-300">
          6 अंकों का कोड भेजा गया: <span className="font-semibold text-white">{email}</span>
          <br />
          <span className="text-slate-400">We sent a 6-digit code. It&apos;s valid for 10 minutes — check spam too.</span>
        </p>
        <input
          ref={codeRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
          value={code}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setCode(v);
            if (v.length === 6 && !loading) void verify(v); // auto-submit, incl. SMS/email autofill
          }}
          placeholder="••••••"
          aria-label="6-digit code"
          className={`${inputClass} text-center font-mono text-2xl tracking-[0.5em]`}
        />
        {errorBox}
        <button type="submit" disabled={loading || code.length !== 6} className={buttonClass}>
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          लॉग इन करें / Log in
        </button>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError(null);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" /> ईमेल बदलें / Change email
          </button>
          <button
            type="button"
            disabled={cooldown > 0 || loading}
            onClick={() => void sendCode()}
            className="font-medium text-yellow-500 hover:text-yellow-400 disabled:text-slate-500"
          >
            {cooldown > 0 ? `दोबारा भेजें / Resend (${cooldown}s)` : "दोबारा भेजें / Resend"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={complete} className="space-y-4">
      <p className="text-sm text-slate-300">
        स्वागत है! अपना नाम बताएँ। <span className="text-slate-400">/ Welcome! What&apos;s your name?</span>
      </p>
      <input
        type="text"
        autoComplete="name"
        required
        autoFocus
        minLength={2}
        maxLength={100}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="पूरा नाम / Full name"
        className={inputClass}
      />
      {errorBox}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        शुरू करें / Get started
      </button>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Mail, MessageCircle } from "lucide-react";
import { PHONE_ERROR, PHONE_RE } from "@/lib/phone";
import T from "@/components/T";
import { resetClientSession } from "@/lib/session-client";

type Step = "email" | "code" | "name";
type Via = "whatsapp" | "email";

const RESEND_COOLDOWN_S = 60;

const inputClass =
  "w-full rounded-lg border border-graphite-700 bg-graphite-800 px-4 py-3 text-base text-graphite-100 placeholder:text-graphite-500 outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/30";
const buttonClass =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-400 px-4 py-3 text-base font-bold text-graphite-900 transition-colors hover:bg-saffron-300 disabled:opacity-60";

/**
 * Login with a one-time code. `whatsapp` (set by the page only when WhatsApp
 * login is configured) adds "code on WhatsApp" as the first choice; email
 * stays available as the second tab and is the only way when it is off.
 */
export default function OtpLoginForm({ next = "/test-platform", whatsapp = false }: { next?: string; whatsapp?: boolean }) {
  const router = useRouter();
  const [via, setVia] = useState<Via>(whatsapp ? "whatsapp" : "email");
  const [waPhone, setWaPhone] = useState("");
  const byWa = via === "whatsapp";
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
    resetClientSession();
    router.push(next);
    router.refresh();
  };

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (byWa && !PHONE_RE.test(waPhone)) {
      setError(PHONE_ERROR);
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await post("/api/auth/otp/request", byWa ? { phone: waPhone } : { email });
      if (!ok) {
        setError(data.error || "Could not send the code.");
        return;
      }
      setCode("");
      setStep("code");
      setCooldown(RESEND_COOLDOWN_S);
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (value: string) => {
    setError(null);
    setLoading(true);
    try {
      const { ok, data } = await post("/api/auth/otp/verify", byWa ? { phone: waPhone, code: value } : { email, code: value });
      if (!ok) {
        setError(data.error || "Incorrect code.");
        setCode("");
        if (data.reason === "use_email") {
          setVia("email");
          setStep("email");
        }
        return;
      }
      if (data.needs_name) {
        setTicket(data.ticket);
        setStep("name");
        return;
      }
      finish();
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!byWa && !PHONE_RE.test(phone)) {
      setError(PHONE_ERROR);
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await post("/api/auth/otp/complete", byWa ? { ticket, full_name: name, email } : { ticket, full_name: name, phone });
      if (!ok) {
        setError(data.error || "Could not create your account.");
        if (data.reason === "ticket") setStep("email");
        if (data.reason === "use_email") {
          setVia("email");
          setStep("email");
        }
        return;
      }
      finish();
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const errorBox = error && (
    <div role="alert" className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-4 py-2.5 text-sm text-danger-300">
      {error}
    </div>
  );

  if (step === "email") {
    const tab = (value: Via, label: React.ReactNode) => (
      <button
        type="button"
        role="tab"
        aria-selected={via === value}
        onClick={() => {
          setVia(value);
          setError(null);
        }}
        className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
          via === value ? "bg-graphite-900 text-white shadow-sm" : "text-graphite-300 hover:text-white"
        }`}
      >
        {label}
      </button>
    );
    return (
      <form onSubmit={sendCode} className="space-y-4">
        {whatsapp && (
          <div role="tablist" className="flex gap-1 rounded-lg border border-graphite-700 bg-graphite-800 p-1">
            {tab("whatsapp", <T en="WhatsApp" hi="WhatsApp" />)}
            {tab("email", <T en="Email" hi="ईमेल" />)}
          </div>
        )}
        {byWa ? (
          <div>
            <label htmlFor="wa-phone" className="mb-1.5 block text-sm font-medium text-graphite-300">
              <T en="WhatsApp mobile number" hi="WhatsApp वाला मोबाइल नंबर" />
            </label>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-3 text-base text-graphite-300">+91</span>
              <input
                id="wa-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                autoFocus
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit number"
                className={inputClass}
              />
            </div>
            <p className="mt-1.5 text-xs text-graphite-400">
              <T
                en="Already bought a course? Use the mobile number you gave at that time, or log in with your email."
                hi="पहले से कोर्स खरीदा है? वही मोबाइल नंबर डालें जो तब दिया था, या ईमेल से लॉगिन करें।"
              />
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-graphite-300">
              <T en="Email" hi="ईमेल" />
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
        )}
        {errorBox}
        <button type="submit" disabled={loading} className={buttonClass}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : byWa ? <MessageCircle className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
          {byWa ? <T en="Send code on WhatsApp" hi="WhatsApp पर कोड भेजें" /> : <T en="Send code" hi="कोड भेजें" />}
        </button>
        <p className="text-center text-xs text-graphite-300">
          <T en="New here? Your account is created automatically." hi="पहली बार आए हैं? आपका अकाउंट अपने आप बन जाएगा।" />
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
        <p className="text-sm text-graphite-300">
          {byWa ? (
            <T
              en={<>We sent a 6-digit code on WhatsApp to <span className="font-semibold text-white">+91 {waPhone}</span>. It&apos;s valid for 10 minutes.</>}
              hi={<>हमने <span className="font-semibold text-white">+91 {waPhone}</span> के WhatsApp पर 6 अंकों का कोड भेजा है। यह 10 मिनट तक चलेगा।</>}
            />
          ) : (
            <T
              en={<>We sent a 6-digit code to <span className="font-semibold text-white">{email}</span>. It&apos;s valid for 10 minutes — check spam too.</>}
              hi={<>हमने <span className="font-semibold text-white">{email}</span> पर 6 अंकों का कोड भेजा है। यह 10 मिनट तक चलेगा — स्पैम फ़ोल्डर भी देखें।</>}
            />
          )}
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
          <T en="Log in" hi="लॉगिन करें" />
        </button>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError(null);
            }}
            className="flex items-center gap-1 text-graphite-300 hover:text-graphite-200"
          >
            <ArrowLeft className="h-4 w-4" /> {byWa ? <T en="Change number" hi="नंबर बदलें" /> : <T en="Change email" hi="ईमेल बदलें" />}
          </button>
          <button
            type="button"
            disabled={cooldown > 0 || loading}
            onClick={() => void sendCode()}
            className="font-medium text-saffron-400 hover:text-saffron-300 disabled:text-graphite-500"
          >
            {cooldown > 0 ? <T en={<>Resend ({cooldown}s)</>} hi={<>दोबारा भेजें ({cooldown}s)</>} /> : <T en="Resend" hi="दोबारा भेजें" />}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={complete} className="space-y-4">
      <p className="text-sm text-graphite-300">
        {byWa ? (
          <T en="Welcome! Tell us your name and email (your receipt goes there)." hi="स्वागत है! अपना नाम और ईमेल बताएं (रसीद वहीं आएगी)।" />
        ) : (
          <T en="Welcome! Tell us your name and mobile number." hi="स्वागत है! अपना नाम और मोबाइल नंबर बताएं।" />
        )}
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
        placeholder="Full name"
        aria-label="Full name"
        className={inputClass}
      />
      {byWa ? (
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email"
          className={inputClass}
        />
      ) : (
        <div>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit mobile number"
            aria-label="Mobile number"
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-graphite-400">
            <T en="For course updates and doubt support on call or WhatsApp. We never share it." hi="कोर्स की जानकारी और कॉल या WhatsApp पर डाउट सपोर्ट के लिए। हम इसे किसी से साझा नहीं करते।" />
          </p>
        </div>
      )}
      {errorBox}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        <T en="Get started" hi="शुरू करें" />
      </button>
    </form>
  );
}

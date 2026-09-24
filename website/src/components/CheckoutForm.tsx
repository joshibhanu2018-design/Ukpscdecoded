"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Tag } from "lucide-react";
import { formatINR } from "@/lib/packages";
import { loadRazorpayScript } from "@/lib/razorpay-client";

const PHONE_RE = /^[6-9]\d{9}$/;

export default function CheckoutForm({
  pkg,
  userName,
  userEmail,
  userPhone,
}: {
  pkg: { id: string; package_name: string; basePrice: number };
  userName: string;
  userEmail: string;
  userPhone: string | null;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState(userPhone ?? "");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking">("idle");
  const [codeMessage, setCodeMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ original: number; discount: number; final: number } | null>(null);

  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleApplyCode = async () => {
    if (!codeInput.trim()) return;
    setCodeStatus("checking");
    setCodeMessage(null);

    try {
      const res = await fetch("/api/payments/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: pkg.id, code: codeInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCodeMessage({ ok: false, text: data.error || "Invalid code." });
        setAppliedCode(null);
        setPreview(null);
      } else {
        setCodeMessage({ ok: true, text: data.message || "Code applied" });
        setAppliedCode(codeInput.trim());
        setPreview(null); // exact discount is computed server-side at order creation
      }
    } catch {
      setCodeMessage({ ok: false, text: "Could not check that code. Please try again." });
      setAppliedCode(null);
    } finally {
      setCodeStatus("idle");
    }
  };

  const handlePay = async () => {
    setError(null);
    setPhoneError(null);

    if (!PHONE_RE.test(phone.trim())) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setStatus("loading");

    const scriptReady = await loadRazorpayScript();
    if (!scriptReady || !window.Razorpay) {
      setError("Could not load the payment gateway. Please try again.");
      setStatus("idle");
      return;
    }

    try {
      if (phone.trim() !== (userPhone ?? "")) {
        const phoneRes = await fetch("/api/auth/update-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phone.trim() }),
        });
        if (!phoneRes.ok) {
          const data = await phoneRes.json().catch(() => ({}));
          setError(data.error || "Could not save phone number.");
          setStatus("idle");
          return;
        }
      }

      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package_id: pkg.id, code: appliedCode || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not start payment. Please try again.");
        setStatus("idle");
        return;
      }

      setPreview({ original: data.original_amount, discount: data.discount_amount, final: data.amount });

      const razorpay = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "UKPSC Decoded",
        description: data.package_name,
        prefill: { email: userEmail, name: userName, contact: phone.trim() },
        theme: { color: "#f59307" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            if (!verifyRes.ok) {
              setError("Payment succeeded but activation failed. Contact support with your payment ID.");
              setStatus("idle");
              return;
            }

            router.push("/test-platform?purchase=success");
            router.refresh();
          } catch {
            setError("Payment succeeded but activation failed. Contact support with your payment ID.");
            setStatus("idle");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });

      razorpay.open();
    } catch {
      setError("Could not start payment. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-4 text-sm font-bold text-white">आपकी जानकारी / Your Details</h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">नाम / Name</label>
            <input
              value={userName}
              readOnly
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">ईमेल / Email</label>
            <input
              value={userEmail}
              readOnly
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-300"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-medium text-slate-400">
              मोबाइल नंबर / Mobile Number <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30"
            />
            {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-white">
          <Tag className="h-4 w-4 text-yellow-500" /> कूपन / रेफरल कोड / Coupon or Referral Code
        </h2>
        <div className="flex gap-2">
          <input
            value={codeInput}
            onChange={(e) => {
              setCodeInput(e.target.value);
              setAppliedCode(null);
              setCodeMessage(null);
            }}
            placeholder="Enter code (optional)"
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleApplyCode}
            disabled={codeStatus === "checking" || !codeInput.trim()}
            className="flex-shrink-0 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-yellow-500 hover:text-yellow-400 disabled:opacity-50"
          >
            {codeStatus === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
        </div>
        {codeMessage && (
          <p className={`mt-2 text-xs ${codeMessage.ok ? "text-green-400" : "text-red-400"}`}>{codeMessage.text}</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="mb-3 text-sm font-bold text-white">भुगतान विवरण / Price Breakdown</h2>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-400">
            <dt>Original Price</dt>
            <dd>{formatINR(preview ? preview.original / 100 : pkg.basePrice)}</dd>
          </div>
          {preview && preview.discount > 0 && (
            <div className="flex justify-between text-green-400">
              <dt>Discount</dt>
              <dd>-{formatINR(preview.discount / 100)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold text-white">
            <dt>Total Payable</dt>
            <dd>{formatINR(preview ? preview.final / 100 : pkg.basePrice)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[11px] text-slate-500">
          {preview ? "Final amount after applying your code." : "Exact discount is confirmed when you proceed to pay."}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-400 disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Pay {formatINR(pkg.basePrice)}
      </button>

      <p className="text-center text-[11px] leading-snug text-slate-500">
        खाता साझा करने पर बिना रिफंड के निलंबन होगा।{" "}
        <span className="text-slate-600">/ Account sharing leads to suspension without refund.</span>{" "}
        <Link href="/terms" className="underline hover:text-slate-400">
          Terms
        </Link>
      </p>
    </div>
  );
}

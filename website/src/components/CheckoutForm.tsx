"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Tag } from "lucide-react";
import { formatINR } from "@/lib/format";
import { loadRazorpayScript } from "@/lib/razorpay-client";
import { computeOrderTotal } from "@/lib/pricing";

const PHONE_RE = /^[6-9]\d{9}$/;

export default function CheckoutForm({
  pkg,
  userName,
  userEmail,
  userPhone,
  storeCreditPaise = 0,
}: {
  pkg: { id: string; package_name: string; basePrice: number };
  userName: string;
  userEmail: string;
  userPhone: string | null;
  storeCreditPaise?: number;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState(userPhone ?? "");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking">("idle");
  const [codeMessage, setCodeMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  // From check-code: the base (a price-lock coupon can change it) and the code's discount, in paise.
  const [codePreview, setCodePreview] = useState<{ basePaise: number; discountPaise: number } | null>(null);
  const total = computeOrderTotal(
    codePreview?.basePaise ?? Math.round(pkg.basePrice * 100),
    codePreview?.discountPaise ?? 0,
    storeCreditPaise
  );

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
        setCodePreview(null);
      } else {
        setCodeMessage({ ok: true, text: data.message || "Code applied" });
        setAppliedCode(codeInput.trim());
        setCodePreview({
          basePaise: Number(data.basePaise ?? Math.round(pkg.basePrice * 100)),
          discountPaise: Number(data.discountAmount ?? 0),
        });
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
      <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-5">
        <h2 className="mb-4 text-sm font-bold text-white">Your details</h2>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-graphite-300">Name</label>
            <input
              value={userName}
              readOnly
              className="w-full rounded-lg border border-graphite-700 bg-graphite-800/60 px-4 py-2.5 text-sm text-graphite-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-graphite-300">Email</label>
            <input
              value={userEmail}
              readOnly
              className="w-full rounded-lg border border-graphite-700 bg-graphite-800/60 px-4 py-2.5 text-sm text-graphite-300"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-xs font-medium text-graphite-300">
              Mobile number <span className="text-danger-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border border-graphite-700 bg-graphite-800 px-4 py-2.5 text-sm text-graphite-100 placeholder:text-graphite-500 outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/30"
            />
            {phoneError && <p className="mt-1 text-xs text-danger-400">{phoneError}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-white">
          <Tag className="h-4 w-4 text-saffron-400" /> Coupon or referral code
        </h2>
        <div className="flex gap-2">
          <input
            value={codeInput}
            onChange={(e) => {
              setCodeInput(e.target.value);
              setAppliedCode(null);
              setCodePreview(null);
              setCodeMessage(null);
            }}
            placeholder="Enter code (optional)"
            className="min-w-0 flex-1 rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2.5 text-sm text-graphite-100 placeholder:text-graphite-500 outline-none focus:border-saffron-400"
          />
          <button
            onClick={handleApplyCode}
            disabled={codeStatus === "checking" || !codeInput.trim()}
            className="flex-shrink-0 rounded-lg border border-graphite-700 px-4 py-2.5 text-sm font-semibold text-graphite-300 hover:border-saffron-400 hover:text-saffron-300 disabled:opacity-50"
          >
            {codeStatus === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </button>
        </div>
        {codeMessage && (
          <p className={`mt-2 text-xs ${codeMessage.ok ? "text-success-400" : "text-danger-400"}`}>{codeMessage.text}</p>
        )}
      </div>

      <div className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-5">
        <h2 className="mb-3 text-sm font-bold text-white">Price breakdown</h2>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between text-graphite-300">
            <dt>Price</dt>
            <dd>{formatINR(total.basePaise / 100)}</dd>
          </div>
          {total.codeDiscountPaise > 0 && (
            <div className="flex justify-between text-success-400">
              <dt>Discount</dt>
              <dd>−{formatINR(total.codeDiscountPaise / 100)}</dd>
            </div>
          )}
          {total.creditAppliedPaise > 0 && (
            <div className="flex justify-between text-success-400">
              <dt>Store credit</dt>
              <dd>−{formatINR(total.creditAppliedPaise / 100)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-graphite-800 pt-1.5 font-bold text-white">
            <dt>Total</dt>
            <dd>{formatINR(total.finalPaise / 100)}</dd>
          </div>
        </dl>
      </div>

      {error && (
        <div className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-4 py-2.5 text-sm text-danger-300">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-400 px-4 py-3 text-sm font-bold text-graphite-900 transition-colors hover:bg-saffron-300 disabled:opacity-60"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Pay {formatINR(total.finalPaise / 100)}
      </button>

      <p className="text-center text-[11px] leading-snug text-graphite-300">
        Account sharing leads to suspension without refund.{" "}
        <Link href="/terms" className="underline hover:text-graphite-400">
          Terms
        </Link> ·{" "}
        <Link href="/refund-policy" className="underline hover:text-graphite-400">
          Refund Policy
        </Link>
      </p>
    </div>
  );
}

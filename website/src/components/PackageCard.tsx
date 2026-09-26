"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Check, Loader2, Sparkles, Tag, Users } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { Package, Savings } from "@/lib/packages";
import { formatFoundingLabel, type PriceInfo } from "@/lib/pricing";
import { loadRazorpayScript } from "@/lib/razorpay-client";

export default function PackageCard({
  pkg,
  priceInfo,
  savings,
  owned,
  isBestValue,
  classStartLabel,
  userEmail,
  userName,
  paymentsEnabled,
  seatsRemaining,
}: {
  pkg: Package;
  priceInfo: PriceInfo;
  savings: Savings | null;
  owned: boolean;
  isBestValue?: boolean;
  classStartLabel?: string | null;
  userEmail: string;
  userName: string;
  paymentsEnabled: boolean;
  seatsRemaining: number | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const bullets = (pkg.description || "").split("\n").filter(Boolean);
  const foundingLabel = formatFoundingLabel(priceInfo);
  const soldOut = seatsRemaining !== null && seatsRemaining <= 0;

  const [showCodeField, setShowCodeField] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking">("idle");
  const [codeMessage, setCodeMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

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
      } else {
        setCodeMessage({ ok: true, text: data.message || "Code applied" });
        setAppliedCode(codeInput.trim());
      }
    } catch {
      setCodeMessage({ ok: false, text: "Could not check that code. Please try again." });
      setAppliedCode(null);
    } finally {
      setCodeStatus("idle");
    }
  };

  const handleBuy = async () => {
    setError(null);
    setStatus("loading");

    const scriptReady = await loadRazorpayScript();
    if (!scriptReady || !window.Razorpay) {
      setError("Could not load the payment gateway. Please try again.");
      setStatus("idle");
      return;
    }

    try {
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
        prefill: { email: userEmail, name: userName },
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
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-xl ${
        isBestValue
          ? "border-saffron-400 bg-graphite-900/80 ring-1 ring-saffron-400/50"
          : "border-graphite-800 bg-graphite-900/60"
      }`}
    >
      {isBestValue && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-saffron-400 px-3 py-1 text-xs font-bold text-graphite-900">
          <Sparkles className="h-3.5 w-3.5" /> Best Value
        </span>
      )}

      <h3 className="text-lg font-bold text-white">{pkg.package_name}</h3>

      {classStartLabel && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-saffron-300">
          <CalendarDays className="h-4 w-4" /> Classes start {classStartLabel}
        </p>
      )}

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{formatINR(priceInfo.amount)}</span>
        {savings && (
          <span className="text-sm text-graphite-300 line-through">{formatINR(savings.componentTotal)}</span>
        )}
      </div>

      {foundingLabel && <p className="mt-1 text-xs font-medium text-saffron-300">{foundingLabel}</p>}

      {savings && (
        <p className="mt-1 text-sm font-medium text-success-400">
          Save {formatINR(savings.saving)} ({savings.savingPercent}%) vs buying separately
        </p>
      )}

      {seatsRemaining !== null && (
        <p className={`mt-1 flex items-center gap-1.5 text-xs ${soldOut ? "text-danger-400" : "text-graphite-300"}`}>
          <Users className="h-3.5 w-3.5" />
          {soldOut ? "All seats full" : `${seatsRemaining} seat${seatsRemaining === 1 ? "" : "s"} left`}
        </p>
      )}

      {pkg.access_valid_till && (
        <p className="mt-1 text-xs text-graphite-300">
          Access valid till{" "}
          {new Date(`${pkg.access_valid_till}T00:00:00`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      {bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-graphite-300">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-saffron-400" /> {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {owned ? (
          <div className="w-full rounded-lg border border-success-500/30 bg-success-500/10 px-4 py-2.5 text-center text-sm font-semibold text-success-400">
            Purchased
          </div>
        ) : !paymentsEnabled ? (
          <div className="w-full rounded-lg border border-graphite-700 bg-graphite-800 px-4 py-2.5 text-center text-sm font-semibold text-graphite-300">
            Sales open soon
          </div>
        ) : soldOut ? (
          <div className="w-full rounded-lg border border-graphite-700 bg-graphite-800 px-4 py-2.5 text-center text-sm font-semibold text-graphite-300">
            All seats are full
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-3 rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-xs text-danger-300">
                {error}
              </div>
            )}

            {showCodeField ? (
              <div className="mb-3">
                <div className="flex gap-2">
                  <input
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value);
                      setAppliedCode(null);
                      setCodeMessage(null);
                    }}
                    placeholder="Coupon or referral code"
                    className="min-w-0 flex-1 rounded-lg border border-graphite-700 bg-graphite-800 px-3 py-2 text-xs text-graphite-100 placeholder:text-graphite-500 outline-none focus:border-saffron-400"
                  />
                  <button
                    onClick={handleApplyCode}
                    disabled={codeStatus === "checking" || !codeInput.trim()}
                    className="flex-shrink-0 rounded-lg border border-graphite-700 px-3 py-2 text-xs font-semibold text-graphite-300 hover:border-saffron-400 hover:text-saffron-300 disabled:opacity-50"
                  >
                    {codeStatus === "checking" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                  </button>
                </div>
                {codeMessage && (
                  <p className={`mt-1.5 text-xs ${codeMessage.ok ? "text-success-400" : "text-danger-400"}`}>
                    {codeMessage.text}
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowCodeField(true)}
                className="mb-3 flex items-center gap-1.5 text-xs font-medium text-graphite-300 hover:text-saffron-300"
              >
                <Tag className="h-3.5 w-3.5" /> Have a coupon or referral code?
              </button>
            )}

            <button
              onClick={handleBuy}
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-400 px-4 py-2.5 text-sm font-semibold text-graphite-900 transition-colors hover:bg-saffron-300 disabled:opacity-60"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              Buy Now
            </button>
            <p className="mt-2 text-center text-[11px] leading-snug text-graphite-300">
              Account sharing leads to suspension without refund.{" "}
              <Link href="/terms" className="underline hover:text-graphite-400">
                Terms
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

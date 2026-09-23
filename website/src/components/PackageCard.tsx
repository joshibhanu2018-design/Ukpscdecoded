"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Check, Loader2, Sparkles } from "lucide-react";
import { formatINR, type Package, type Savings } from "@/lib/packages";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void };

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { email: string; name: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PackageCard({
  pkg,
  savings,
  owned,
  isBestValue,
  classStartLabel,
  userEmail,
  userName,
  paymentsEnabled,
}: {
  pkg: Package;
  savings: Savings | null;
  owned: boolean;
  isBestValue?: boolean;
  classStartLabel?: string | null;
  userEmail: string;
  userName: string;
  paymentsEnabled: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const bullets = (pkg.description || "").split("\n").filter(Boolean);

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
        body: JSON.stringify({ package_id: pkg.id }),
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
          ? "border-yellow-500 bg-slate-900/80 ring-1 ring-yellow-500/50"
          : "border-slate-800 bg-slate-900/60"
      }`}
    >
      {isBestValue && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-slate-900">
          <Sparkles className="h-3.5 w-3.5" /> Best Value
        </span>
      )}

      <h3 className="text-lg font-bold text-white">{pkg.package_name}</h3>

      {classStartLabel && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-yellow-400">
          <CalendarDays className="h-4 w-4" /> Classes start {classStartLabel}
        </p>
      )}

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{formatINR(pkg.price)}</span>
        {savings && (
          <span className="text-sm text-slate-500 line-through">{formatINR(savings.componentTotal)}</span>
        )}
      </div>

      {savings && (
        <p className="mt-1 text-sm font-medium text-green-400">
          Save {formatINR(savings.saving)} ({savings.savingPercent}%) vs buying separately
        </p>
      )}

      {pkg.access_valid_till && (
        <p className="mt-1 text-xs text-slate-500">
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
            <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" /> {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {owned ? (
          <div className="w-full rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-center text-sm font-semibold text-green-400">
            Purchased
          </div>
        ) : !paymentsEnabled ? (
          <div className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-center text-sm font-semibold text-slate-400">
            बिक्री जल्द शुरू <span className="text-slate-500">/ Sales open soon</span>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}
            <button
              onClick={handleBuy}
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400 disabled:opacity-60"
            >
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              Buy Now
            </button>
            <p className="mt-2 text-center text-[11px] leading-snug text-slate-500">
              खाता साझा करने पर बिना रिफंड के निलंबन होगा।{" "}
              <span className="text-slate-600">
                / Account sharing leads to suspension without refund.
              </span>{" "}
              <Link href="/terms" className="underline hover:text-slate-400">
                Terms
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

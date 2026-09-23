"use client";

import { useState } from "react";
import { CalendarDays, Check, Sparkles } from "lucide-react";
import { formatINR, type Package, type Savings } from "@/lib/packages";

export default function PackageCard({
  pkg,
  savings,
  owned,
  isBestValue,
  classStartLabel,
}: {
  pkg: Package;
  savings: Savings | null;
  owned: boolean;
  isBestValue?: boolean;
  classStartLabel?: string | null;
}) {
  const [buying, setBuying] = useState(false);
  const bullets = (pkg.description || "").split("\n").filter(Boolean);

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
        ) : buying ? (
          <div className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-center text-sm text-slate-300">
            Payment coming soon — Razorpay checkout is the next step.
          </div>
        ) : (
          <button
            onClick={() => setBuying(true)}
            className="w-full rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
}

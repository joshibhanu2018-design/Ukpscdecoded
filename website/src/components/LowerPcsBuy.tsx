"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOwned } from "@/lib/session-client";
import T from "@/components/T";

/**
 * The one main button of the Lower PCS page ("Buy Now" for the Complete
 * course). Students who already own it see "Open My Courses" instead; that
 * check runs in the browser so the page itself can stay cached.
 */
export function LowerPcsBuyButton({ packageId, slug, className = "" }: { packageId: string; slug: string; className?: string }) {
  const owned = useOwned(packageId);
  if (owned) {
    return (
      <Link
        href="/test-platform"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-success-500/40 bg-success-500/10 px-6 py-3.5 text-base font-bold text-success-400 ${className}`}
      >
        <CheckCircle2 className="h-5 w-5" /> <T en="Purchased · open My Courses" hi="खरीदा हुआ · मेरे कोर्स खोलें" />
      </Link>
    );
  }
  return (
    <Link
      href={`/checkout/${slug}`}
      className={`web-only inline-flex items-center justify-center rounded-xl bg-saffron-400 px-8 py-3.5 text-base font-bold text-graphite-900 shadow-lg shadow-saffron-400/20 transition-colors hover:bg-saffron-300 ${className}`}
    >
      <T en="Buy Now" hi="अभी खरीदें" />
    </Link>
  );
}

/** Bottom bar on phones: price + Buy Now, always in reach while scrolling. */
export function LowerPcsMobileBar({ packageId, slug, price, was }: { packageId: string; slug: string; price: string; was: string | null }) {
  const owned = useOwned(packageId);
  if (owned) return null;
  return (
    <div className="web-only fixed bottom-0 left-0 right-0 z-40 border-t border-graphite-800 bg-graphite-900/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight">
          <p className="text-[11px] text-graphite-300">
            <T en="Complete course" hi="पूरा कोर्स" />
          </p>
          <p className="text-lg font-bold text-white">
            {price} {was && <span className="text-xs font-normal text-graphite-400 line-through">{was}</span>}
          </p>
        </div>
        <Link
          href={`/checkout/${slug}`}
          className="flex-1 rounded-xl bg-saffron-400 px-4 py-3 text-center text-base font-bold text-graphite-900"
        >
          <T en="Buy Now" hi="अभी खरीदें" />
        </Link>
      </div>
    </div>
  );
}

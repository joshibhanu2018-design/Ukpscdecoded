"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOwned } from "@/lib/session-client";
import AppPurchaseNote from "./AppPurchaseNote";
import T from "@/components/T";

/**
 * The buttons at the bottom of a product card. The card itself is the same
 * for every visitor (so the page can be cached); whether this student
 * already owns the product is checked in the browser.
 */
export default function CourseCardActions({ packageId, slug, owned: ownedProp }: { packageId: string; slug: string | null; owned?: boolean }) {
  const ownedNow = useOwned(packageId);
  const owned = ownedProp || ownedNow;

  if (owned) {
    return (
      <Link
        href="/test-platform"
        className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-success-500/30 bg-success-500/10 px-4 py-2.5 text-center text-sm font-semibold text-success-400"
      >
        <CheckCircle2 className="h-4 w-4" /> <T en="Purchased · open My Courses" hi="खरीदा हुआ · मेरे कोर्स खोलें" />
      </Link>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <Link
          href={`/checkout/${slug}`}
          className="web-only flex min-h-[44px] flex-[1.4] items-center justify-center rounded-xl bg-saffron-400 px-4 py-2.5 text-center text-sm font-bold text-graphite-900 shadow-sm transition-colors hover:bg-saffron-300"
        >
          <T en="Buy Now" hi="अभी खरीदें" />
        </Link>
        <Link
          href={`/courses/${slug}`}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-graphite-600 px-3 py-2.5 text-center text-sm font-semibold text-graphite-200 transition-colors hover:border-saffron-400 hover:text-saffron-300"
        >
          <T en="Details" hi="जानकारी" />
        </Link>
      </div>
      <AppPurchaseNote className="mt-2" />
    </>
  );
}

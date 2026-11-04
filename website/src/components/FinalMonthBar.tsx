"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// No bar during a test, in admin, or on checkout.
const HIDDEN_PREFIXES = ["/test-platform/tests", "/test-platform/attempts", "/test-platform/admin", "/checkout"];

export type FinalMonthItem = { label: string; price: string; was: string | null; href: string };

/**
 * Last-month prices bar (till 29 Nov 2026). Prices come from the database
 * (the layout passes them in), so it never shows a price the store doesn't
 * charge; "was" is the price it sold for until the cut. Website only.
 */
export default function FinalMonthBar({ items }: { items: FinalMonthItem[] }) {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  return (
    <div className="web-only border-b border-saffron-500/40 bg-gradient-to-r from-saffron-500 via-saffron-400 to-saffron-500 px-3 py-2 text-graphite-950">
      <p className="text-center text-xs font-bold sm:text-sm">
        Prices cut till 29 Nov, for one month, to make courses affordable for all
      </p>
      <div className="mt-1 flex snap-x gap-2 overflow-x-auto pb-0.5 text-[11px] font-semibold sm:flex-wrap sm:justify-center sm:overflow-visible sm:text-xs [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            className="flex-shrink-0 snap-start whitespace-nowrap rounded-full bg-graphite-950/10 px-2.5 py-0.5 hover:bg-graphite-950/20"
          >
            {it.label} <span className="font-bold">{it.price}</span>
            {it.was && <span className="ml-1 font-normal line-through opacity-70">{it.was}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

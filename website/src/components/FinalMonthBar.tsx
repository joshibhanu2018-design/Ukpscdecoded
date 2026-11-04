"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Flame } from "lucide-react";

// No bar during a test, in admin, or on checkout.
const HIDDEN_PREFIXES = ["/test-platform/tests", "/test-platform/attempts", "/test-platform/admin", "/checkout"];
const DESKTOP_ITEMS = 4;
const ROTATE_MS = 3500;

export type FinalMonthItem = { label: string; price: string; was: string | null; href: string };

function Price({ it }: { it: FinalMonthItem }) {
  return (
    <>
      <span className="text-graphite-200">{it.label}</span>{" "}
      <span className="font-bold text-saffron-300">{it.price}</span>
      {it.was && <span className="ml-1 text-graphite-500 line-through">{it.was}</span>}
    </>
  );
}

/**
 * Last-month prices bar (till 29 Nov 2026): one slim line. Desktop shows the
 * first few offers side by side; phones show one offer at a time, changing
 * every few seconds. Every offer links to its page. Prices come from the
 * database (the layout passes them in); "was" is the price before the cut.
 * Website only.
 */
export default function FinalMonthBar({ items }: { items: FinalMonthItem[] }) {
  const pathname = usePathname();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [items.length]);

  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p)) || items.length === 0) return null;
  const current = items[i % items.length];

  return (
    <div className="web-only relative border-b border-graphite-800 bg-graphite-950 text-xs sm:text-[13px]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron-400/70 to-transparent" />
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4">
        <span className="flex flex-shrink-0 items-center gap-1.5 font-semibold text-white">
          <Flame className="h-4 w-4 text-saffron-400" aria-hidden />
          <span className="hidden sm:inline">Last-month prices</span>
          <span className="rounded-full bg-saffron-400/15 px-2 py-0.5 text-[11px] font-bold text-saffron-300">till 29 Nov</span>
        </span>

        {/* Phones: one offer at a time */}
        <Link href={current.href} className="min-w-0 flex-1 truncate whitespace-nowrap hover:underline md:hidden" aria-live="polite">
          <Price it={current} />
        </Link>

        {/* Desktop: the first offers side by side */}
        <div className="hidden min-w-0 flex-1 items-center justify-center divide-x divide-graphite-700 md:flex">
          {items.slice(0, DESKTOP_ITEMS).map((it) => (
            <Link key={it.label} href={it.href} className="whitespace-nowrap px-4 hover:underline">
              <Price it={it} />
            </Link>
          ))}
        </div>

        <Link
          href="/courses"
          className="flex flex-shrink-0 items-center gap-1 font-semibold text-saffron-300 hover:text-saffron-200"
        >
          <span className="hidden sm:inline">All offers</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only sm:hidden">All offers</span>
        </Link>
      </div>
    </div>
  );
}

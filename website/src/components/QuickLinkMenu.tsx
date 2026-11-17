"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import T from "@/components/T";

export type QuickMenuItem = { href: string; title: string; price: string | null };

/**
 * "Choose a course" dropdown on a homepage quick-link card: the products of
 * one exam page with their prices (prices hidden in the Android app).
 * `primary` = the card's main button; otherwise a quieter "More courses" link.
 */
export default function QuickLinkMenu({ items, primary }: { items: QuickMenuItem[]; primary: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div ref={box} className={`relative mx-3 mb-4 sm:mx-4 ${primary ? "" : "-mt-1"}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={
          primary
            ? "flex min-h-[40px] w-full items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-saffron-400 px-2 text-sm font-bold text-saffron-500 transition-colors hover:bg-saffron-400 hover:text-[#1c1917]"
            : "flex w-full items-center justify-center gap-1 py-1 text-xs font-semibold text-graphite-300 hover:text-saffron-400"
        }
      >
        {primary ? (
          <>
            <span className="sm:hidden"><T en="See courses" hi="कोर्स देखें" /></span>
            <span className="hidden sm:inline"><T en="Choose a course" hi="कोर्स चुनें" /></span>
          </>
        ) : (
          <T en="More courses" hi="और कोर्स" />
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute -left-3 -right-3 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-graphite-800 bg-graphite-900 py-1 shadow-xl shadow-black/20">
          {items.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-[13px] leading-snug text-graphite-100 hover:bg-saffron-400/10 hover:text-saffron-400"
              >
                <span className="block font-medium">{it.title}</span>
                {it.price && <span className="web-only block text-xs font-semibold text-saffron-500">{it.price}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

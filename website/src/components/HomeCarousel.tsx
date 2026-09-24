"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Banner } from "@/lib/banners";

export default function HomeCarousel({ banners }: { banners: (Banner & { href: string })[] }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const userInteracted = useRef(false);

  // Auto-advance every 5s, paused briefly after manual interaction.
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[active] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [active]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    userInteracted.current = true;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active) setActive(index);
  };

  if (banners.length === 0) return null;

  return (
    <div className="bg-slate-900">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="flex w-full flex-shrink-0 snap-start items-center justify-center px-6 py-16 text-center sm:py-24"
            style={{ background: `linear-gradient(135deg, ${b.gradient_from}, ${b.gradient_to})` }}
          >
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{b.title}</h2>
              {b.subtitle && <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">{b.subtitle}</p>}
            </div>
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-yellow-500" : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

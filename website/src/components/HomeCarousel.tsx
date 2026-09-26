"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/banners";

const INTERVAL_MS = 5000;
// After a swipe/tap the carousel waits this long before sliding on its own again.
const RESUME_AFTER_TOUCH_MS = 8000;

/**
 * Home page course carousel. Slides every 5s; pauses while hovered, focused
 * or touched; never auto-slides for prefers-reduced-motion. Swiping is
 * native scroll-snap, so it works before hydration too.
 *
 * A banner shows its designed image when `image_url` is set (desktop
 * 1920×600, phones `image_url_mobile` 1080×1080 — or `image_url` again),
 * otherwise the text banner on its gradient.
 */
export default function HomeCarousel({ banners }: { banners: (Banner & { href: string })[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchedAt, setTouchedAt] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const count = banners.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el || count === 0) return;
      const i = ((index % count) + count) % count;
      // Scroll only the carousel, never the page (scrollIntoView would).
      el.scrollTo({ left: i * el.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
      setActive(i);
    },
    [count, reducedMotion]
  );

  const paused = hovered || focused || reducedMotion;

  // One timer per slide: restarts whenever the slide changes or a pause ends.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const sinceTouch = Date.now() - touchedAt;
    const delay = sinceTouch < RESUME_AFTER_TOUCH_MS ? RESUME_AFTER_TOUCH_MS - sinceTouch + INTERVAL_MS : INTERVAL_MS;
    const timer = setTimeout(() => goTo(active + 1), delay);
    return () => clearTimeout(timer);
  }, [active, paused, count, touchedAt, goTo]);

  // Keep the dots in sync with swipes and keep the slide aligned on resize.
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active && index >= 0 && index < count) setActive(index);
  };

  useEffect(() => {
    const onResize = () => {
      const el = scrollerRef.current;
      if (el) el.scrollTo({ left: active * el.clientWidth, behavior: "auto" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Courses"
      className="relative bg-graphite-950"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Keyboard focus pauses; a mouse click or tap on a dot doesn't.
      onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onTouchStart={() => setTouchedAt(Date.now())}
      onTouchEnd={() => setTouchedAt(Date.now())}
    >
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((b, i) => (
          <Link
            key={b.id}
            href={b.href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${b.title}`}
            className="relative block w-full flex-shrink-0 snap-start snap-always"
            tabIndex={i === active ? 0 : -1}
          >
            {b.image_url ? (
              <picture>
                {b.image_url_mobile && <source media="(max-width: 639px)" srcSet={b.image_url_mobile} />}
                {/* eslint-disable-next-line @next/next/no-img-element -- owner-uploaded Storage URL, already sized and compressed */}
                <img
                  src={b.image_url}
                  alt={b.subtitle ? `${b.title} — ${b.subtitle}` : b.title}
                  width={1920}
                  height={600}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  className={`block w-full object-cover ${b.image_url_mobile ? "aspect-square sm:aspect-[16/5]" : "aspect-[16/5]"}`}
                />
              </picture>
            ) : (
              <div
                className="flex h-full min-h-[220px] items-center justify-center px-12 py-14 text-center sm:min-h-[280px] sm:py-20"
                style={{ background: `linear-gradient(135deg, ${b.gradient_from}, ${b.gradient_to})` }}
              >
                <div>
                  <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">{b.title}</h2>
                  {b.subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-lg">{b.subtitle}</p>}
                  <span className="mt-6 inline-block rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25">
                    View course
                  </span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-graphite-950/60 text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-graphite-950/80 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-graphite-950/60 text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-graphite-950/80 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                // 24px tap target around a small dot.
                className="flex h-6 items-center px-1"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    i === active ? "w-6 bg-saffron-400" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TestTab = { key: string; label: string; count: number; panel: ReactNode };

/**
 * Tab bar for a test series (Full Length · Sectional · Uttarakhand · …).
 * Every panel is rendered on the server and only hidden, so the lists are
 * in the HTML for search engines and work before hydration (first tab).
 */
export default function TestTabs({ tabs, initialKey }: { tabs: TestTab[]; initialKey?: string }) {
  const [active, setActive] = useState(() => (tabs.some((t) => t.key === initialKey) ? initialKey! : tabs[0]?.key));
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;
  if (tabs.length === 1) return <>{tabs[0].panel}</>;

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const j = (next + tabs.length) % tabs.length;
    setActive(tabs[j].key);
    buttons.current[j]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Test types"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {tabs.map((t, i) => {
          const selected = t.key === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                buttons.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${t.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex min-h-[44px] flex-shrink-0 items-center justify-center rounded-lg border px-4 py-2 text-center transition-colors ${
                selected
                  ? "border-saffron-400 bg-saffron-400 text-graphite-900"
                  : "border-graphite-700 bg-graphite-900/60 text-graphite-200 hover:border-saffron-400/60"
              }`}
            >
              <span className="whitespace-nowrap text-sm font-semibold">
                {t.label} <span className={selected ? "text-graphite-800" : "text-graphite-300"}>({t.count})</span>
              </span>
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${id}-panel-${t.key}`}
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={t.key !== active}
          className="mt-4"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}

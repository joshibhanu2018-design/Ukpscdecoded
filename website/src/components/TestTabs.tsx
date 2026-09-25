"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TestTab = { key: string; label: string; hindi: string; count: number; panel: ReactNode };

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
              className={`flex min-h-[44px] flex-shrink-0 flex-col items-center justify-center rounded-lg border px-3 py-1.5 text-center transition-colors ${
                selected
                  ? "border-yellow-500 bg-yellow-500 text-slate-900"
                  : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-yellow-500/60"
              }`}
            >
              <span className="whitespace-nowrap text-sm font-semibold">
                {t.label} <span className={selected ? "text-slate-800" : "text-slate-300"}>({t.count})</span>
              </span>
              <span className={`whitespace-nowrap text-[11px] ${selected ? "text-slate-800" : "text-slate-300"}`}>{t.hindi}</span>
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

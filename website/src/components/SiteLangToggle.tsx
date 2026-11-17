"use client";

import { useEffect, useState } from "react";

export const SITE_LANG_KEY = "ukd-site-lang";

/** हिंदी / EN switch for the public pages (see T.tsx). Remembered on this device. */
/** `compact` (phones): one button that names the other language. */
export default function SiteLangToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    setLang(document.documentElement.getAttribute("data-lang") === "hi" ? "hi" : "en");
  }, []);

  const change = (l: "en" | "hi") => {
    setLang(l);
    if (l === "hi") document.documentElement.setAttribute("data-lang", "hi");
    else document.documentElement.removeAttribute("data-lang");
    try {
      localStorage.setItem(SITE_LANG_KEY, l);
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => change(lang === "hi" ? "en" : "hi")}
        aria-label={lang === "hi" ? "Switch to English" : "हिंदी में देखें"}
        className={`min-h-[36px] whitespace-nowrap rounded-lg border border-saffron-400/70 px-2 text-xs font-bold text-saffron-300 ${className}`}
      >
        {lang === "hi" ? "EN" : "हिंदी"}
      </button>
    );
  }

  return (
    <div role="group" aria-label="Language / भाषा" className={`flex overflow-hidden rounded-lg border border-saffron-400/70 ${className}`}>
      {(["hi", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => change(l)}
          aria-pressed={lang === l}
          className={`min-h-[36px] px-2.5 text-xs font-semibold transition-colors ${
            lang === l ? "bg-saffron-400 text-graphite-950" : "bg-graphite-900 text-graphite-200 hover:bg-graphite-800"
          }`}
        >
          {l === "hi" ? "हिंदी" : "EN"}
        </button>
      ))}
    </div>
  );
}

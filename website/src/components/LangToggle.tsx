"use client";

import { useEffect, useState } from "react";

export type Lang = "hi" | "en";

const LANG_KEY = "ukpsc_test_lang";

/** The student's question language, shared by the exam and result screens (remembered in localStorage). */
export function useTestLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("hi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "hi" || saved === "en") setLang(saved);
    } catch {
      /* storage unavailable — default language is fine */
    }
  }, []);

  const change = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  };

  return [lang, change];
}

/** हिंदी / EN switch — 44px tap targets, the active side filled yellow. */
export default function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div role="group" aria-label="Question language" className="flex overflow-hidden rounded-lg border-2 border-saffron-400/70">
      {(["hi", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={`min-h-[44px] min-w-[52px] px-3 text-sm font-semibold transition-colors ${
            lang === l ? "bg-saffron-400 text-graphite-900" : "bg-graphite-900 text-graphite-200 hover:bg-graphite-800"
          }`}
        >
          {l === "hi" ? "हिंदी" : "EN"}
        </button>
      ))}
    </div>
  );
}

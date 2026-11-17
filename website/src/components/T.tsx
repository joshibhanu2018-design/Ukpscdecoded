import type { ReactNode } from "react";

/**
 * Two-language text for the public pages. Both versions are in the page;
 * CSS shows one (`html[data-lang="hi"]` → Hindi, otherwise English), so it
 * works in server and client components and needs no cookie or reload.
 * The visitor's choice is kept by SiteLangToggle (localStorage).
 */
export default function T({ en, hi }: { en: ReactNode; hi: ReactNode }) {
  return (
    <>
      <span className="lang-en">{en}</span>
      <span className="lang-hi" lang="hi">
        {hi}
      </span>
    </>
  );
}

/**
 * Parsing helpers shared by the question bank loader and the combined-question
 * builder, so both read option cells exactly the same way.
 */

export const str = (v: unknown) => (v === undefined || v === null ? "" : String(v)).trim();
export const DEV = /[ऀ-ॿ]/;

export const NUMERIC = /^[\d.,\s%₹-]+$/;

/** Digits in a string (Devanagari digits folded to ASCII, thousands commas ignored), sorted. */
export const numbersIn = (s: string) =>
  (s.replace(/[०-९]/g, (c) => String(c.charCodeAt(0) - 0x966)).replace(/(\d),(?=\d)/g, "$1").match(/\d+(?:\.\d+)?/g) ?? [])
    .sort()
    .join(" ");

/**
 * "English / Hindi" option cell -> parts. The split point is the last " / "
 * before the first part containing Devanagari. Many cells have the Hindi's
 * leading number cut off into its own part ("100 meters per decade / 100 /
 * मीटर प्रति दशक", "August 15, 1947 / 15 / अगस्त 1947"): a short part with a
 * number the English already contains goes back onto the Hindi side.
 * Cells without Hindi keep the same text in both languages (numbers, names),
 * except pure number pairs such as "100,86,292 / 1,00,86,292".
 */
export function splitOption(raw: string): { en: string; hi: string } {
  const s = raw.trim();
  const parts = s.split(" / ");
  const k = parts.findIndex((p) => DEV.test(p));
  if (k > 0) {
    const en = parts.slice(0, k);
    let hi = parts.slice(k).join(" / ").trim();
    const last = en[en.length - 1].trim();
    const restNums = new Set(numbersIn(en.slice(0, -1).join(" ")).split(" "));
    const lastNums = numbersIn(last).split(" ");
    if (en.length > 1 && last.length <= 20 && /\d/.test(last) && lastNums.every((n) => restNums.has(n))) {
      en.pop();
      hi = `${last} ${hi}`;
    }
    return { en: en.join(" / ").trim(), hi };
  }
  if (k === 0) return { en: s, hi: s };
  if (parts.length === 2 && parts.every((p) => NUMERIC.test(p))) {
    return { en: parts[0].trim(), hi: parts[1].trim() };
  }
  return { en: s, hi: s };
}

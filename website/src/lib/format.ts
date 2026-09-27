/** Pure formatting helpers — safe to import from client components. */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

const LIST_TAIL =
  /([^\n])\s+(?=(?:Which (?:of the|one of the)|Select the correct|Choose the correct|How many of the|Consider the above|उपर्युक्त|ऊपर दिए|नीचे दिए|सही उत्तर))/;

/**
 * Puts each numbered statement of a question on its own line. Many bank
 * questions store "…? 1. Statement one. 2. Statement two." on one line.
 * Only acts when a list is present (both "1. " and "2. ", or "I. " and
 * "II. "), and "1.9" or "Article 21." are left alone (no space after the dot
 * / more than one digit). The closing question after the last statement
 * ("Which of the statements given above…") also starts a new line.
 */
export function formatQuestionText(raw: string): string {
  let s = raw;
  const arabic = /(^|\s)1\.\s/.test(s) && /\s2\.\s/.test(s);
  const roman = /(^|\s)I\.\s/.test(s) && /\sII\.\s/.test(s);
  if (!arabic && !roman) return s;
  if (arabic) s = s.replace(/([^\n])[ \t]+(?=[1-9]\.\s+\S)/g, "$1\n");
  if (roman) s = s.replace(/([^\n])[ \t]+(?=(?:I|II|III|IV|V|VI)\.\s+\S)/g, "$1\n");
  const lastItem = s.lastIndexOf("\n");
  return lastItem < 0 ? s : s.slice(0, lastItem) + s.slice(lastItem).replace(LIST_TAIL, "$1\n");
}

/** "Video 12: …" → 12: links an uploaded lesson to its slot in the crash course plan. */
export function lessonVideoNumber(title: string): number | null {
  const m = title.match(/\bvideo\s*(\d{1,3})\b/i);
  return m ? Number(m[1]) : null;
}

/**
 * Puts lessons with "Video N" in the title in number order (1, 2, 3 …), so a
 * video uploaded late still appears in its place. Lessons without a number
 * (e.g. a live session) keep the position the admin gave them; the numbered
 * ones fill the remaining positions in number order.
 */
export function sortLessonsByVideoNumber<T extends { title: string }>(lessons: T[]): T[] {
  const numbered = lessons
    .map((l, i) => ({ l, i, n: lessonVideoNumber(l.title) }))
    .filter((x): x is { l: T; i: number; n: number } => x.n !== null)
    .sort((a, b) => a.n - b.n || a.i - b.i);
  let next = 0;
  return lessons.map((l) => (lessonVideoNumber(l.title) === null ? l : numbered[next++].l));
}

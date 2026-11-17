import Link from "next/link";
import { FileText, PlayCircle } from "lucide-react";
import { getCourseLessons, isLessonReleased, type Lesson } from "@/lib/lessons";
import T from "@/components/T";

export type SampleLesson = { slug: string; id: string; title: string };

const hasVideo = (l: Lesson) => !!(l.bunny_video_id || l.youtube_id);

/** "Video 9 · UK History Prehistory …" → "UK History Prehistory …" */
function cleanTitle(title: string): string {
  return title.replace(/^\s*video\s*\d{1,3}\s*[·:|.\-–—]?\s*/i, "").replace(/^\s*[·:|\-–—]\s*/, "").trim() || title;
}

/** Free sample lessons (lessons.is_free, released, with a video) of the given video courses, one per video. */
export async function getSampleLessons(slugs: string[]): Promise<SampleLesson[]> {
  const results = await Promise.all(slugs.map((s) => getCourseLessons(s, null).catch(() => null)));
  const seen = new Set<string>();
  const out: SampleLesson[] = [];
  results.forEach((r, i) => {
    for (const l of r?.lessons ?? []) {
      if (!l.is_free || !hasVideo(l) || !isLessonReleased(l)) continue;
      const key = (l.bunny_video_id || l.youtube_id)!;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ slug: slugs[i], id: l.id, title: cleanTitle(l.title) });
    }
  });
  return out;
}

/**
 * Free sample class card(s) in the course page's "Watch Free Demo" area: video + PDF notes,
 * for any logged-in student.
 */
export default function FreeSampleLessons({ samples }: { samples: SampleLesson[] }) {
  if (samples.length === 0) return null;
  return (
    <div className="space-y-3">
      {samples.map((s) => (
        <div key={s.id} className="rounded-xl border border-success-500/30 bg-success-500/5 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-success-300">
            <T en="Free sample class" hi="फ्री सैंपल क्लास" />
          </p>
          <p className="mt-1 font-semibold leading-snug text-white">{s.title}</p>
          <p className="mt-1.5 text-sm text-graphite-300">
            <T
              en="Check our teaching quality before you buy: a sample class from our courses, with its PDF notes, free."
              hi="खरीदने से पहले हमारी पढ़ाई की क्वालिटी खुद देखें: हमारे कोर्स की एक सैंपल क्लास, PDF नोट्स के साथ, फ्री।"
            />
          </p>
          <Link
            href={`/test-platform/lessons/${s.slug}?v=${s.id}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-success-500 px-4 py-2 text-sm font-bold text-white hover:bg-success-400"
          >
            <PlayCircle className="h-4 w-4" /> <T en="Watch free" hi="फ्री देखें" />
            <span className="flex items-center gap-1 font-medium opacity-90">
              + <FileText className="h-3.5 w-3.5" /> <T en="notes" hi="नोट्स" />
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}

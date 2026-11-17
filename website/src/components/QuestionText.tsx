import { formatQuestionText } from "@/lib/format";

// A line "[[img:/path.png]]" in a question shows that figure (e.g. the
// previous-year papers' reasoning figures in public/pyq/). Only site-relative
// paths are allowed, so a question can never load an outside image.
const FIGURE = /^\[\[img:(\/[A-Za-z0-9/_.-]+\.(?:png|webp|jpe?g))\]\]$/;

/** Question text with its line breaks and any figures. */
export default function QuestionText({ text, className = "" }: { text: string; className?: string }) {
  const parts = formatQuestionText(text).split(/(\[\[img:[^\]\n]+\]\])/);
  return (
    <div className={`whitespace-pre-line text-base leading-relaxed text-white ${className}`}>
      {parts.map((part, i) => {
        const m = part.match(FIGURE);
        if (!m) return part ? <span key={i}>{part.replace(/^\n+|\n+$/g, "")}</span> : null;
        return (
          // eslint-disable-next-line @next/next/no-img-element -- small static figure from public/
          <img
            key={i}
            src={m[1]}
            alt="Figure for this question"
            loading="lazy"
            className="my-3 block max-h-72 w-auto max-w-full rounded-lg bg-white p-2 ring-1 ring-graphite-800"
          />
        );
      })}
    </div>
  );
}

import type { Package } from "@/lib/packages";
import { courseHeader } from "@/lib/course-display";

// One colour per kind of product, so the store's choices look different at
// a glance. All are dark enough for white text at AA (≥4.5:1 at the light end).
const TONES: Record<string, string> = {
  combo_bundle: "linear-gradient(135deg, #b45309, #78300d)",
  test_series: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
  video_course: "linear-gradient(135deg, #0f766e, #134e4a)",
  mentorship: "linear-gradient(135deg, #6d28d9, #3b0764)",
};

export function courseTone(pkg: Package): string {
  return TONES[pkg.package_type] ?? TONES.combo_bundle;
}

/**
 * The top block of a course card: `image_url` if set, otherwise the course
 * name and a one-line "what you get" in large text on the product colour.
 */
export default function CourseHeader({
  pkg,
  size = "md",
  titleAs: Title = "p",
  className = "",
}: {
  pkg: Package;
  size?: "sm" | "md" | "lg";
  /** The title is the card's heading when there's no image. */
  titleAs?: "p" | "h1" | "h2" | "h3";
  className?: string;
}) {
  const { title, tagline } = courseHeader(pkg);

  if (pkg.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URL from any host; next/image would need every host allow-listed
      <img
        src={pkg.image_url}
        alt={`${title}${tagline ? ` — ${tagline}` : ""}`}
        loading="lazy"
        decoding="async"
        className={`aspect-[16/9] w-full object-cover ${className}`}
      />
    );
  }

  const titleSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";
  const taglineSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className={`flex flex-col justify-center px-5 py-5 text-white ${className}`} style={{ background: courseTone(pkg) }}>
      <Title className={`${titleSize} font-extrabold uppercase leading-tight tracking-wide`}>{title}</Title>
      {tagline && <p className={`mt-2 ${taglineSize} font-semibold leading-snug text-white`}>{tagline}</p>}
    </div>
  );
}

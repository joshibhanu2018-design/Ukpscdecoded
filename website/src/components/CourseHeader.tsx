import type { Package } from "@/lib/packages";
import { courseHeader } from "@/lib/course-display";

// One jewel tone per kind of product, so the store's choices look different
// at a glance and sit on the graphite theme (each fades towards near-black).
// White text is AA (>= 4.5:1) at the light end of every gradient.
const TONES: Record<string, string> = {
  combo_bundle: "linear-gradient(135deg, #9a6a0c, #3d2a05)", // gold
  test_series: "linear-gradient(135deg, #9f1d3a, #3f0b18)", // garnet
  video_course: "linear-gradient(135deg, #0f766e, #083733)", // teal
  mentorship: "linear-gradient(135deg, #6d28d9, #2a1159)", // amethyst
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

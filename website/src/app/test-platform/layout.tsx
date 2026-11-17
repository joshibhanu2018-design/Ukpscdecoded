/**
 * The student area (My Courses, tests, results, admin) uses the same white
 * theme as the rest of the site. To bring the old dark look back, add the
 * class `theme-dark` to this div (see globals.css).
 */
export default function TestPlatformLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-graphite-950">{children}</div>;
}

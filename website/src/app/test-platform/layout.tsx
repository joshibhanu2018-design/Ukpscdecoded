/**
 * The student area (dashboard, tests, results, admin) keeps the dark theme:
 * `.theme-dark` restores the dark colour values (see globals.css). The public
 * pages and the store are light.
 */
export default function TestPlatformLayout({ children }: { children: React.ReactNode }) {
  return <div className="theme-dark min-h-screen bg-graphite-950">{children}</div>;
}

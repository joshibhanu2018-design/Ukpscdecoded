import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Download,
  GraduationCap,
  LayoutDashboard,
  Newspaper,
  Target,
  Video,
} from "lucide-react";
import FreeSampleTest from "@/components/FreeSampleTest";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

// App home: the manifest's start_url, so the installed app (and later the
// Play Store app) opens on big tiles instead of the marketing home page.
export const metadata: Metadata = {
  title: "App",
  description: "UKPSC Decoded app: test series, video courses, books and free resources.",
  alternates: { canonical: "/app" },
  robots: { index: false, follow: true },
};

type Tile = { href: string; title: string; sub: string; icon: React.ReactNode };

const products: Tile[] = [
  { href: "/test-series", title: "Test Series", sub: "Full mocks, sectionals & UK GK tests", icon: <ClipboardList className="h-6 w-6" /> },
  { href: "/courses", title: "Video Courses", sub: "Crash course & mentorship", icon: <Video className="h-6 w-6" /> },
];

const freeResources: Tile[] = [
  { href: "/pyq-tracker", title: "PYQ Tracker", sub: "Topic trends from past papers", icon: <Target className="h-5 w-5" /> },
  { href: "/uploads/UKPSC-60-Day-Prep-Tracker.pdf", title: "60-Day Plan", sub: "Day-by-day study plan (PDF)", icon: <CalendarDays className="h-5 w-5" /> },
  { href: "/current-affairs", title: "Current Affairs", sub: "Daily news & MCQs", icon: <Newspaper className="h-5 w-5" /> },
];

const tileClass =
  "group flex min-h-[44px] rounded-xl border border-graphite-800 bg-graphite-900 transition-colors hover:border-saffron-400/50 hover:bg-graphite-800/70";

function TileIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-saffron-400/10 text-saffron-400 group-hover:bg-saffron-400/20">
      {children}
    </span>
  );
}

export default async function AppHome() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  const firstName = user?.full_name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="font-display text-2xl font-bold text-white">
            {firstName ? `Namaste, ${firstName}` : "UKPSC Decoded"}
          </h1>
          <p className="text-sm text-graphite-400">Your UKPSC preparation, in one place.</p>
        </header>

        {user && (
          <Link
            href="/test-platform"
            className="flex min-h-[64px] items-center gap-4 rounded-xl bg-saffron-400 p-4 text-graphite-950 transition-colors hover:bg-saffron-300"
          >
            <LayoutDashboard className="h-7 w-7 flex-shrink-0" />
            <span className="flex-1">
              <span className="block font-display text-lg font-bold">My Courses</span>
              <span className="block text-sm">Your tests, lessons and progress</span>
            </span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        )}

        <section aria-labelledby="app-study" className="space-y-3">
          <h2 id="app-study" className="text-xs font-semibold uppercase tracking-wider text-graphite-400">
            Study
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {products.map((t) => (
              <Link key={t.href} href={t.href} className={`${tileClass} flex-col gap-3 p-4`}>
                <TileIcon>{t.icon}</TileIcon>
                <span>
                  <span className="block font-display font-semibold text-white">{t.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-graphite-400">{t.sub}</span>
                </span>
              </Link>
            ))}

            {/* Books & E-book: one tile, two destinations. */}
            <div className="col-span-2 flex flex-col gap-3 rounded-xl border border-graphite-800 bg-graphite-900 p-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <TileIcon>
                  <BookOpen className="h-6 w-6" />
                </TileIcon>
                <span>
                  <span className="block font-display font-semibold text-white">Books &amp; E-book</span>
                  <span className="mt-0.5 block text-xs leading-snug text-graphite-400">Print book delivered home, or read the e-book now</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:w-64">
                <Link
                  href="/buy-book"
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-graphite-700 text-sm font-semibold text-white hover:border-saffron-400/60"
                >
                  <BookMarked className="h-4 w-4 text-saffron-400" /> Print book
                </Link>
                <Link
                  href="/buy-ebooks"
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-graphite-700 text-sm font-semibold text-white hover:border-saffron-400/60"
                >
                  <Download className="h-4 w-4 text-saffron-400" /> E-book
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FreeSampleTest compact />

        <section aria-labelledby="app-free" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="app-free" className="text-xs font-semibold uppercase tracking-wider text-graphite-400">
              Free resources
            </h2>
            <Link href="/free-content" className="inline-flex min-h-[44px] items-center px-1 text-sm font-medium text-saffron-400 hover:text-saffron-300">
              See all
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
            {freeResources.map((t) => {
              const body = (
                <>
                  <TileIcon>{t.icon}</TileIcon>
                  <span className="flex-1">
                    <span className="block font-semibold text-white">{t.title}</span>
                    <span className="block text-xs text-graphite-400">{t.sub}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-graphite-500 sm:hidden" />
                </>
              );
              const cls = `${tileClass} items-center gap-3 p-3 sm:flex-col sm:items-start sm:p-4`;
              // PDFs are static files, not pages: a plain link opens the viewer.
              return t.href.endsWith(".pdf") ? (
                <a key={t.href} href={t.href} className={cls}>{body}</a>
              ) : (
                <Link key={t.href} href={t.href} className={cls}>{body}</Link>
              );
            })}
          </div>
        </section>

        {!user && (
          <Link
            href="/student/login?next=/app"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-graphite-700 p-4 text-sm text-graphite-300 hover:border-saffron-400/60"
          >
            <GraduationCap className="h-4 w-4 text-saffron-400" />
            New here? Log in with your email to take the free sample mock
          </Link>
        )}
      </div>
    </div>
  );
}

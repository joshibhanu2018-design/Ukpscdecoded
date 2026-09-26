"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, BookOpen, ChevronDown, LogIn } from "lucide-react";
import settings from "@content/settings.json";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/test-series", label: "Test Series" },
  { href: "/buy-book", label: "Books" },
  { href: "/free-content", label: "Free Content" },
];

const moreLinks = [
  { href: "/articles", label: "Articles" },
  { href: "/current-affairs", label: "Daily Current Affairs & MCQ" },
  { href: "/pyq-tracker", label: "PYQ Tracker" },
  { href: "/buy-ebooks", label: "E-Books" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // "Courses" shouldn't light up on the test series course page, which has its own link.
  if (href === "/courses") return pathname === "/courses" || pathname.startsWith("/courses/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ user }: { user: { fullName: string } | null }) {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // "More" opens on hover (desktop) or click/tap/keyboard; closes on outside click or Escape.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const ctaHref = user ? "/test-platform" : "/student/login";
  const ctaLabel = user ? "My Courses" : "Login / Register";
  const moreActive = moreLinks.some((l) => isActive(pathname, l.href));

  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-graphite-800 hover:text-saffron-300 ${
      active ? "text-saffron-400" : "text-graphite-200"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-graphite-800 bg-graphite-950/95 text-white backdrop-blur supports-[backdrop-filter]:bg-graphite-950/85">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-saffron-400 transition-colors group-hover:text-saffron-300" />
            <span className="whitespace-nowrap font-display text-lg font-bold text-white sm:text-xl">
              {settings.brandName1} <span className="text-saffron-400">{settings.brandName2}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={linkClass(isActive(pathname, link.href))}
              >
                {link.label}
              </Link>
            ))}

            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 ${linkClass(moreActive)}`}
              >
                More <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && (
                // pt-2 keeps the hover area continuous between the button and the menu.
                <div className="absolute right-0 top-full w-64 pt-2">
                  <div className="rounded-xl border border-graphite-800 bg-graphite-900 py-2 shadow-2xl shadow-black/40">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2.5 text-sm hover:bg-graphite-800 hover:text-saffron-300 ${
                          isActive(pathname, link.href) ? "text-saffron-400" : "text-graphite-200"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={ctaHref}
              className="ml-3 flex items-center gap-1.5 rounded-lg bg-saffron-400 px-5 py-2.5 text-sm font-bold text-graphite-950 shadow-md transition-colors hover:bg-saffron-300"
            >
              <LogIn className="h-4 w-4" /> {ctaLabel}
            </Link>
          </div>

          {/* Mobile: CTA always visible + menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href={ctaHref}
              className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-saffron-400 px-3 py-2 text-xs font-bold text-graphite-950 shadow-md"
            >
              <LogIn className="h-3.5 w-3.5" /> {user ? "My Courses" : "Login"}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 transition-colors hover:bg-graphite-800"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-graphite-800 pb-4 pt-3 lg:hidden">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-graphite-800 hover:text-saffron-300 ${
                  isActive(pathname, link.href) ? "text-saffron-400" : "text-graphite-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-3 px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-graphite-400">More</p>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-graphite-800 hover:text-saffron-300 ${
                  isActive(pathname, link.href) ? "text-saffron-400" : "text-graphite-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

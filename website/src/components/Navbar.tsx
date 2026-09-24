"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen, ChevronDown, LogIn } from "lucide-react";
import settings from "@content/settings.json";

const primaryLinks = [
  { href: "/", labelHi: "होम", labelEn: "Home" },
  { href: "/courses", labelHi: "कोर्स", labelEn: "Courses" },
  { href: "/test-series", labelHi: "टेस्ट सीरीज", labelEn: "Test Series" },
  { href: "/buy-book", labelHi: "किताबें", labelEn: "Books" },
  { href: "/free-content", labelHi: "फ्री कंटेंट", labelEn: "Free Content" },
];

const moreLinks = [
  { href: "/articles", labelHi: "लेख", labelEn: "Articles" },
  { href: "/current-affairs", labelHi: "करेंट अफेयर्स", labelEn: "Current Affairs & MCQ" },
  { href: "/pyq-tracker", labelHi: "PYQ ट्रैकर", labelEn: "PYQ Tracker" },
  { href: "/buy-ebooks", labelHi: "ई-बुक्स", labelEn: "Buy E-Books" },
  { href: "/paid-courses", labelHi: "पेड कोर्स", labelEn: "Paid Courses" },
  { href: "/about", labelHi: "हमारे बारे में", labelEn: "About" },
];

export default function Navbar({ user }: { user: { fullName: string } | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const ctaHref = user ? "/test-platform" : "/student/login";
  const ctaLabel = user ? `मेरे कोर्स / My Courses` : `Login / Register`;

  return (
    <nav className="bg-graphite-950 text-white sticky top-0 z-50 shadow-lg">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-18">
          <Link href="/" className="group flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-saffron-400 transition-colors group-hover:text-saffron-300" />
            <span className="font-display text-xl font-bold text-white">
              {settings.brandName1} <span className="text-saffron-400">{settings.brandName2}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-graphite-200 transition-all duration-200 hover:bg-graphite-800 hover:text-saffron-400"
              >
                {link.labelHi} <span className="text-graphite-500">/ {link.labelEn}</span>
              </Link>
            ))}

            <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-graphite-200 transition-all duration-200 hover:bg-graphite-800 hover:text-saffron-400">
                और / More <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full w-56 rounded-lg border border-graphite-800 bg-graphite-950 py-2 shadow-xl">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-graphite-200 hover:bg-graphite-800 hover:text-saffron-400"
                    >
                      {link.labelHi} <span className="text-graphite-500">/ {link.labelEn}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={ctaHref}
              className="ml-3 flex items-center gap-1.5 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-md transition-colors hover:bg-yellow-400"
            >
              <LogIn className="h-4 w-4" /> {ctaLabel}
            </Link>
          </div>

          {/* Mobile: CTA always visible + menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href={ctaHref}
              className="flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-bold text-slate-900 shadow-md"
            >
              <LogIn className="h-3.5 w-3.5" /> {ctaLabel}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 transition-colors hover:bg-graphite-800"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="mt-2 border-t border-graphite-800 pb-4 pt-4 lg:hidden">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-4 py-3 text-base font-medium text-graphite-200 transition-all hover:bg-graphite-800 hover:text-saffron-400"
              >
                {link.labelHi} <span className="text-graphite-500">/ {link.labelEn}</span>
              </Link>
            ))}
            <p className="mt-2 px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-graphite-500">
              और / More
            </p>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-4 py-3 text-base font-medium text-graphite-200 transition-all hover:bg-graphite-800 hover:text-saffron-400"
              >
                {link.labelHi} <span className="text-graphite-500">/ {link.labelEn}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

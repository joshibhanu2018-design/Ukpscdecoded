"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import settings from "@content/settings.json";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/free-content", label: "Free Content" },
  { href: "/current-affairs", label: "Current Affairs & MCQ" },
  { href: "/pyq-tracker", label: "PYQ Tracker" },
  { href: "/courses", label: "Courses" },
  { href: "/buy-book", label: "Buy Book" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-graphite-950 text-white sticky top-0 z-50 shadow-lg">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2 group">
            <BookOpen className="w-8 h-8 text-saffron-400 group-hover:text-saffron-300 transition-colors" />
            <span className="font-display font-bold text-xl text-white">
              {settings.brandName1}{" "}
              <span className="text-saffron-400">{settings.brandName2}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-graphite-200 hover:text-saffron-400 hover:bg-graphite-800 rounded-md transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/buy-book" className="ml-3 btn-primary text-sm py-2 px-4">
              {settings.navCtaText}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-graphite-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-graphite-800 mt-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-graphite-200 hover:text-saffron-400 hover:bg-graphite-800 rounded-md transition-all"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/buy-book"
              onClick={() => setIsOpen(false)}
              className="block mt-3 mx-4 text-center btn-primary"
            >
              {settings.navCtaText}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

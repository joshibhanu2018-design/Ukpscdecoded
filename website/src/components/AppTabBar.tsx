"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, Gift, Home, UserRound } from "lucide-react";

// While a test is running the bar would cover the question navigator and submit button.
const HIDDEN_PREFIXES = ["/test-platform/attempts", "/test-platform/tests/", "/checkout"];

/**
 * Bottom tab bar shown only inside the installed Android app / home-screen
 * app (CSS display-mode: standalone). In a normal browser it never renders
 * visibly, so the website is unchanged.
 */
export default function AppTabBar({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname() ?? "/";
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const tabs = [
    { href: "/app", label: "Home", icon: Home, active: pathname === "/app" || pathname === "/" },
    { href: "/courses", label: "Courses", icon: BookOpen, active: pathname.startsWith("/courses") },
    { href: "/test-series", label: "Tests", icon: ClipboardList, active: pathname.startsWith("/test-series") },
    { href: "/free-content", label: "Free", icon: Gift, active: ["/free-content", "/pyq-tracker", "/current-affairs"].some((p) => pathname.startsWith(p)) },
    {
      href: loggedIn ? "/test-platform" : "/student/login",
      label: loggedIn ? "My Courses" : "Login",
      icon: UserRound,
      active: pathname.startsWith("/test-platform") || pathname.startsWith("/student"),
    },
  ];

  return (
    <>
      {/* Spacer so page content and the footer are not hidden behind the bar. */}
      <div aria-hidden className="hidden h-16 [@media(display-mode:standalone)]:block" />
      <nav
        aria-label="App navigation"
        className="fixed inset-x-0 bottom-0 z-50 hidden border-t border-graphite-800 bg-graphite-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur [@media(display-mode:standalone)]:block"
      >
        <ul className="mx-auto flex max-w-lg">
          {tabs.map(({ href, label, icon: Icon, active }) => (
            <li key={label} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${active ? "text-saffron-400" : "text-graphite-300"}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

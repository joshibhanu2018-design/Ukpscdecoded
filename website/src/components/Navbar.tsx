"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import settings from "@content/settings.json";
import T from "@/components/T";
import SiteLangToggle from "@/components/SiteLangToggle";
import { resetClientSession, useLoggedIn } from "@/lib/session-client";

export type MenuItem = { href: string; label: string; hi?: string };
export type NavMenus = { courses: MenuItem[]; tests: MenuItem[] };

type NavLink = { href: string; label: string; hi: string; highlight?: boolean; children?: MenuItem[] };

/** Top menu. Courses, Test Series and Books open a list of their products. */
function buildLinks(menus: NavMenus): NavLink[] {
  return [
    { href: "/", label: "Home", hi: "होम" },
    { href: "/revision", label: "Revision Series", hi: "रिवीजन सीरीज़", highlight: true },
    {
      href: "/courses",
      label: "Courses",
      hi: "कोर्स",
      children: [{ href: "/courses", label: "All courses", hi: "सभी कोर्स" }, ...menus.courses],
    },
    {
      href: "/test-series",
      label: "Test Series",
      hi: "टेस्ट सीरीज़",
      children: [{ href: "/test-series", label: "All test series", hi: "सभी टेस्ट सीरीज़" }, ...menus.tests],
    },
    {
      href: "/buy-book",
      label: "Books",
      hi: "किताबें",
      children: [
        { href: "/buy-book", label: "UKPSC Decoded Guidebook (English & Hindi)", hi: "UKPSC Decoded गाइडबुक (हिंदी और English)" },
        { href: "/buy-ebooks", label: "Polity Decoded e-Book", hi: "Polity Decoded ई-बुक" },
      ],
    },
    { href: "/free-content", label: "Free Content", hi: "फ्री कंटेंट" },
  ];
}

const moreLinks = [
  { href: "/answer-key", label: "Prelims Answer Key", hi: "प्रीलिम्स उत्तर कुंजी" },
  { href: "/articles", label: "Articles", hi: "लेख" },
  { href: "/current-affairs", label: "Daily Current Affairs & MCQ", hi: "डेली करेंट अफेयर्स और MCQ" },
  { href: "/pyq-tracker", label: "PYQ Tracker", hi: "PYQ ट्रैकर" },
  { href: "/about", label: "About", hi: "हमारे बारे में" },
  { href: "/contact", label: "Contact", hi: "संपर्क" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // "Courses" shouldn't light up on the test series course page, which has its own link.
  if (href === "/courses") return pathname === "/courses" || pathname.startsWith("/courses/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

const PRIVATE_PREFIXES = ["/test-platform", "/checkout", "/order-confirmation", "/student"];

export default function Navbar({ menus }: { menus: NavMenus }) {
  const pathname = usePathname() ?? "/";
  const loggedIn = useLoggedIn();
  const primaryLinks = buildLinks(menus);
  const [isOpen, setIsOpen] = useState(false);
  // Which desktop dropdown is open ("more" or a link's href), and which group is expanded on phones.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const lastPath = useRef(pathname);

  // Coming back from login, checkout or My Courses: ask again who is logged in and what they own.
  useEffect(() => {
    const wasPrivate = PRIVATE_PREFIXES.some((p) => lastPath.current.startsWith(p));
    const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
    if (wasPrivate && !isPrivate) resetClientSession();
    lastPath.current = pathname;
    setOpenMenu(null);
    setIsOpen(false);
  }, [pathname]);

  // Dropdowns open on hover (desktop) or click/tap/keyboard; close on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  const ctaHref = loggedIn ? "/test-platform" : "/student/login";
  const ctaLabel = loggedIn ? <T en="My Courses" hi="मेरे कोर्स" /> : <T en="Login / Register" hi="लॉगिन / रजिस्टर" />;
  const moreActive = moreLinks.some((l) => isActive(pathname, l.href));

  const linkClass = (active: boolean) =>
    `whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-200 hover:bg-graphite-800 hover:text-saffron-300 ${
      active ? "text-saffron-400" : "text-graphite-200"
    }`;

  const dropdown = (key: string, label: React.ReactNode, active: boolean, items: MenuItem[], align: "left" | "right") => (
    <div key={key} className="relative" onMouseEnter={() => setOpenMenu(key)} onMouseLeave={() => setOpenMenu(null)}>
      <button
        type="button"
        onClick={() => setOpenMenu((o) => (o === key ? null : key))}
        aria-expanded={openMenu === key}
        aria-haspopup="true"
        className={`flex items-center gap-1 ${linkClass(active)}`}
      >
        {label} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === key ? "rotate-180" : ""}`} />
      </button>
      {openMenu === key && (
        // pt-2 keeps the hover area continuous between the button and the menu.
        <div className={`absolute top-full w-72 pt-2 ${align === "right" ? "right-0" : "left-0"}`}>
          <div className="rounded-xl border border-graphite-800 bg-graphite-900 py-2 shadow-xl shadow-black/10">
            {items.map((item, i) => (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                onClick={() => setOpenMenu(null)}
                className={`block px-4 py-2.5 text-sm hover:bg-graphite-800 hover:text-saffron-300 ${
                  i === 0 && key !== "more" ? "font-semibold " : ""
                }${pathname === item.href ? "text-saffron-400" : "text-graphite-200"}`}
              >
                <T en={item.label} hi={item.hi ?? item.label} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-graphite-800 bg-graphite-950/95 text-white backdrop-blur supports-[backdrop-filter]:bg-graphite-950/85">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-badge-160.webp" alt="" width={36} height={36} className="h-9 w-9 flex-shrink-0" />
            <span className="whitespace-nowrap font-display text-base font-bold text-white sm:text-xl">
              {settings.brandName1} <span className="text-saffron-400">{settings.brandName2}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div ref={navRef} className="hidden items-center gap-0.5 xl:flex">
            {primaryLinks.map((link) =>
              link.children ? (
                dropdown(link.href, <T en={link.label} hi={link.hi} />, isActive(pathname, link.href), link.children, "left")
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={
                    link.highlight
                      ? "flex items-center gap-1.5 whitespace-nowrap rounded-full border border-saffron-400/70 bg-saffron-400/10 px-3 py-1.5 text-sm font-semibold text-saffron-300 transition-colors hover:bg-saffron-400/20"
                      : linkClass(isActive(pathname, link.href))
                  }
                >
                  <T en={link.label} hi={link.hi} />
                  {link.highlight && (
                    <span className="rounded-full bg-saffron-400 px-1.5 text-[10px] font-bold uppercase leading-4 text-graphite-950">New</span>
                  )}
                </Link>
              )
            )}

            {dropdown("more", <T en="More" hi="और" />, moreActive, moreLinks, "right")}

            <SiteLangToggle className="ml-2" />
            <Link
              href={ctaHref}
              className="ml-2 flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-saffron-400 px-4 py-2.5 text-sm font-bold text-graphite-950 shadow-md transition-colors hover:bg-saffron-300"
            >
              <LogIn className="h-4 w-4" /> {ctaLabel}
            </Link>
          </div>

          {/* Mobile: CTA always visible + menu toggle */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <SiteLangToggle compact />
            <Link
              href={ctaHref}
              className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-saffron-400 px-2.5 py-2 text-xs font-bold text-graphite-950 shadow-md"
            >
              <LogIn className="hidden h-3.5 w-3.5 min-[420px]:block" /> {loggedIn ? <T en="My Courses" hi="मेरे कोर्स" /> : <T en="Login" hi="लॉगिन" />}
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
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-graphite-800 pb-4 pt-3 xl:hidden">
            {primaryLinks.map((link) =>
              link.children ? (
                <div key={link.href}>
                  <button
                    type="button"
                    onClick={() => setOpenGroup((g) => (g === link.href ? null : link.href))}
                    aria-expanded={openGroup === link.href}
                    className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-left text-base font-medium transition-colors hover:bg-graphite-800 ${
                      isActive(pathname, link.href) ? "text-saffron-400" : "text-graphite-200"
                    }`}
                  >
                    <T en={link.label} hi={link.hi} />
                    <ChevronDown className={`h-5 w-5 transition-transform ${openGroup === link.href ? "rotate-180" : ""}`} />
                  </button>
                  {openGroup === link.href && (
                    <div className="mb-2 ml-4 border-l-2 border-graphite-800 pl-2">
                      {link.children.map((item, i) => (
                        <Link
                          key={`${item.href}-${i}`}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`block rounded-md px-3 py-2.5 text-sm hover:bg-graphite-800 hover:text-saffron-300 ${
                            i === 0 ? "font-semibold " : ""
                          }${pathname === item.href ? "text-saffron-400" : "text-graphite-200"}`}
                        >
                          <T en={item.label} hi={item.hi ?? item.label} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-graphite-800 hover:text-saffron-300 ${
                    isActive(pathname, link.href) || link.highlight ? "text-saffron-400" : "text-graphite-200"
                  }`}
                >
                  <T en={link.label} hi={link.hi} />
                  {link.highlight && (
                    <span className="ml-2 rounded-full bg-saffron-400 px-1.5 text-[10px] font-bold uppercase text-graphite-950">New</span>
                  )}
                </Link>
              )
            )}
            <p className="mt-3 px-4 pb-1 text-xs font-semibold uppercase tracking-wider text-graphite-400"><T en="More" hi="और" /></p>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-graphite-800 hover:text-saffron-300 ${
                  isActive(pathname, link.href) ? "text-saffron-400" : "text-graphite-200"
                }`}
              >
                <T en={link.label} hi={link.hi} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

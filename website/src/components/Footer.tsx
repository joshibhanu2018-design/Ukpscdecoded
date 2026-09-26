import Link from "next/link";
import { BookOpen, Video, Send, Camera } from "lucide-react";
import settings from "@content/settings.json";

// Every public page is reachable from here or the navbar.
const columns = [
  {
    heading: "Courses & Books",
    links: [
      { href: "/courses", label: "All Courses" },
      { href: "/test-series", label: "Test Series" },
      { href: "/courses/crash-course", label: "Crash Course" },
      { href: "/courses/prelims-mentorship", label: "Mentorship" },
      { href: "/buy-book?lang=en", label: "Book — English Edition" },
      { href: "/buy-book?lang=hi", label: "Book — Hindi Edition" },
      { href: "/buy-ebooks", label: "E-Books" },
    ],
  },
  {
    heading: "Free Resources",
    links: [
      { href: "/free-content", label: "Free Video Lectures" },
      { href: "/current-affairs", label: "Daily Current Affairs & MCQ" },
      { href: "/pyq-tracker", label: "PYQ Tracker" },
      { href: "/articles", label: "Articles" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact Us" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
];

export default function Footer() {
  const { footer, social } = settings;

  return (
    <footer className="border-t border-graphite-800 bg-graphite-950 text-graphite-300">
      <div className="container-custom mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + connect */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-saffron-400" />
              <span className="font-display text-xl font-bold text-white">
                {settings.brandName1} <span className="text-saffron-400">{settings.brandName2}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-graphite-300">{footer.aboutText}</p>
            <p className="mt-3 text-xs leading-relaxed text-graphite-400">
              {footer.exams.map((exam) => exam.name).join(" · ")}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-graphite-800 transition-colors hover:bg-graphite-700 hover:text-saffron-300"
                aria-label="YouTube"
              >
                <Video className="h-5 w-5" />
              </a>
              <a
                href={social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-graphite-800 transition-colors hover:bg-graphite-700 hover:text-saffron-300"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-graphite-800 transition-colors hover:bg-graphite-700 hover:text-saffron-300"
                aria-label="Instagram"
              >
                <Camera className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-sm text-graphite-300">Email: {footer.email}</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 font-display font-semibold text-white">{col.heading}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-saffron-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-graphite-800 pt-8 text-center text-sm text-graphite-400">
          <p>
            &copy; {new Date().getFullYear()} {settings.brandName1} {settings.brandName2}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

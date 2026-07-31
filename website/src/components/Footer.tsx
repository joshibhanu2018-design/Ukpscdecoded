import Link from "next/link";
import { BookOpen, Video, Send, Camera } from "lucide-react";
import settings from "@content/settings.json";

const quickLinks = [
  { href: "/free-content", label: "Free Video Lectures" },
  { href: "/current-affairs", label: "Current Affairs & MCQ" },
  { href: "/pyq-tracker", label: "PYQ Tracker" },
  { href: "/courses", label: "Courses" },
  { href: "/buy-book", label: "Buy the Book" },
];

export default function Footer() {
  const { footer, social } = settings;

  return (
    <footer className="bg-graphite-950 text-graphite-300">
      <div className="container-custom mx-auto section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-7 h-7 text-saffron-400" />
              <span className="font-display font-bold text-xl text-white">
                {settings.brandName1}{" "}
                <span className="text-saffron-400">{settings.brandName2}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-graphite-400">
              {footer.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-saffron-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exams Covered */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Exams Covered</h4>
            <ul className="space-y-2 text-sm text-graphite-400">
              {footer.exams.map((exam) => (
                <li key={exam.name}>{exam.name}</li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Connect With Us
            </h4>
            <div className="flex gap-4 mb-4">
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-graphite-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Video className="w-5 h-5" />
              </a>
              <a
                href={social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-graphite-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-graphite-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-graphite-400">Email: {footer.email}</p>
          </div>
        </div>

        <div className="border-t border-graphite-800 mt-10 pt-8 text-center text-sm text-graphite-500">
          <p>
            &copy; {new Date().getFullYear()} {settings.brandName1}{" "}
            {settings.brandName2}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

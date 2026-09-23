import type { Metadata } from "next";
import Link from "next/link";
import { Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your UKPSC Decoded test platform password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          पासवर्ड भूल गए? <span className="text-slate-400">/ Forgot Password?</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Self-serve password reset by email isn&apos;t set up yet — it needs an email delivery
          provider wired into a later phase. For now, message us on Telegram with your registered
          email and we&apos;ll help reset it manually.
        </p>
      </div>

      <a
        href="https://t.me/ukpscdecoded"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-yellow-400"
      >
        <Send className="h-4 w-4" /> Contact us on Telegram
      </a>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered your password?{" "}
        <Link href="/student/login" className="font-medium text-yellow-500 hover:text-yellow-400">
          Log In
        </Link>
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Student Login",
  description: "Log in to your UKPSC Decoded test platform account.",
};

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; next?: string }>;
}) {
  const { reset, next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          लॉग इन करें <span className="text-slate-400">/ Log In</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">Welcome back. Log in to continue your preparation.</p>
      </div>

      {reset === "success" && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-300">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          पासवर्ड रीसेट हो गया — कृपया लॉग इन करें।{" "}
          <span className="text-green-400/80">/ Password reset — please log in.</span>
        </div>
      )}

      <LoginForm next={safeNext} />

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href={safeNext ? `/student/signup?next=${encodeURIComponent(safeNext)}` : "/student/signup"}
          className="font-medium text-yellow-500 hover:text-yellow-400"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

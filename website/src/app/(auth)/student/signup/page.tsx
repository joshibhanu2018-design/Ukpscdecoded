import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Student Sign Up",
  description: "Create your free UKPSC Decoded test platform account.",
};

export default async function StudentSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          खाता बनाएं <span className="text-slate-400">/ Create Account</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign up to start taking UKPSC mock tests and track your progress.
        </p>
      </div>

      <SignupForm next={safeNext} />

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href={safeNext ? `/student/login?next=${encodeURIComponent(safeNext)}` : "/student/login"}
          className="font-medium text-yellow-500 hover:text-yellow-400"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}

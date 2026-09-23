import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your UKPSC Decoded account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          नया पासवर्ड सेट करें <span className="text-slate-400">/ Set New Password</span>
        </h1>
      </div>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          यह लिंक अमान्य है। <span className="text-red-300/80">/ This reset link is invalid.</span>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        <Link href="/student/forgot-password" className="font-medium text-yellow-500 hover:text-yellow-400">
          Request a new reset link
        </Link>
      </p>
    </div>
  );
}

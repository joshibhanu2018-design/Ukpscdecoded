import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

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
          अपना ईमेल दर्ज करें और हम आपको एक रीसेट लिंक भेजेंगे।{" "}
          <span className="text-slate-500">/ Enter your email and we&apos;ll send you a reset link.</span>
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered your password?{" "}
        <Link href="/student/login" className="font-medium text-yellow-500 hover:text-yellow-400">
          Log In
        </Link>
      </p>
    </div>
  );
}

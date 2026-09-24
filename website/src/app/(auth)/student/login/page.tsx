import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import OtpLoginForm from "@/components/OtpLoginForm";

export const metadata: Metadata = {
  title: "Login / Register",
  description: "Log in or create your UKPSC Decoded account with a one-time email code.",
};

export default async function StudentLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  // Only same-site paths — never an open redirect to another domain.
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/test-platform";

  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (user) redirect(safeNext);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          लॉग इन / रजिस्टर <span className="block text-base font-medium text-slate-400">Login / Register</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          पासवर्ड की ज़रूरत नहीं — ईमेल पर कोड आएगा। <span className="block text-slate-500">No password needed — we&apos;ll email you a code.</span>
        </p>
      </div>
      <OtpLoginForm next={safeNext} />
    </div>
  );
}

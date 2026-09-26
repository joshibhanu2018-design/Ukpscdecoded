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
    <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          Login / Register
        </h1>
        <p className="mt-2 text-sm text-graphite-300">
          No password needed — we&apos;ll email you a code.
        </p>
      </div>
      <OtpLoginForm next={safeNext} />
      <p className="mt-5 text-center text-[11px] leading-snug text-graphite-300">
        One account works on up to 2 devices at a time. Logging in on a third logs out the oldest.
      </p>
    </div>
  );
}

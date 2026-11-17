import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import OtpLoginForm from "@/components/OtpLoginForm";
import T from "@/components/T";
import { whatsappLoginEnabled } from "@/lib/whatsapp";

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
  const whatsapp = whatsappLoginEnabled();

  return (
    <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6 shadow-xl sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          <T en="Login / Register" hi="लॉगिन / रजिस्टर" />
        </h1>
        <p className="mt-2 text-sm text-graphite-300">
          {whatsapp ? (
            <T en="No password needed — we'll send you a code on WhatsApp or email." hi="पासवर्ड की ज़रूरत नहीं — हम WhatsApp या ईमेल पर एक कोड भेजेंगे।" />
          ) : (
            <T en="No password needed — we'll email you a code." hi="पासवर्ड की ज़रूरत नहीं — हम आपके ईमेल पर एक कोड भेजेंगे।" />
          )}
        </p>
      </div>
      <OtpLoginForm next={safeNext} whatsapp={whatsapp} />
      <p className="mt-5 text-center text-[11px] leading-snug text-graphite-300">
        <T en="One account works on up to 2 devices at a time. Logging in on a third logs out the oldest." hi="एक अकाउंट एक समय में 2 डिवाइस पर चलता है। तीसरे पर लॉगिन करने से सबसे पुराना लॉगआउट हो जाएगा।" />
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Test Platform",
  description: "Your UKPSC Decoded test platform dashboard.",
};

export default async function TestPlatformPage() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);

  if (!user) {
    redirect("/student/login");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              स्वागत है, <span className="text-yellow-500">{user.full_name}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400 shadow-xl">
          Mock tests and question sets will appear here in the next phase.
        </div>
      </div>
    </div>
  );
}

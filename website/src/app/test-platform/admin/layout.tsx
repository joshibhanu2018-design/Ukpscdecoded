import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

// Every /test-platform/admin/* page renders through this guard. The API
// routes check the role again on their own (lib/admin.ts) — this only
// decides who sees the screens.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) redirect("/student/login?next=/test-platform/admin");
  if (user.role !== "admin") notFound(); // don't reveal that an admin area exists
  return children;
}

import { redirect } from "next/navigation";

// Password accounts were replaced by email OTP login — old links land on the new login screen.
export default async function LegacyAuthRedirect({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  redirect(safeNext ? `/student/login?next=${encodeURIComponent(safeNext)}` : "/student/login");
}

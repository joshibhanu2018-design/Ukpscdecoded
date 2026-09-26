import { notFound, redirect } from "next/navigation";
import { findUserIdByEmail, normalizeEmail } from "@/lib/otp";

// Admin-only (guarded by ../layout.tsx): look a student up by email and open their performance page.
export default async function StudentLookup({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  const id = email ? await findUserIdByEmail(normalizeEmail(email)) : null;
  if (!id) notFound();
  redirect(`/test-platform/performance?user=${id}`);
}

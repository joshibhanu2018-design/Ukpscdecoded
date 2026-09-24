import { supabaseAdmin } from "./supabase";

export type TestListItem = {
  id: string;
  test_name: string;
  subject: string | null;
  total_questions: number | null;
  duration_minutes: number | null;
  release_at: string | null;
};

/** Full test list for a course detail page — name, subject, question count, duration, release date. */
export async function getPackageTestList(packageId: string): Promise<TestListItem[]> {
  const db = supabaseAdmin();

  const { data: links, error: linkError } = await db
    .from("package_tests")
    .select("test_id")
    .eq("package_id", packageId);

  if (linkError || !links || links.length === 0) return [];

  const { data: tests, error } = await db
    .from("tests")
    .select("id, test_name, subject, total_questions, duration_minutes, release_at")
    .in(
      "id",
      links.map((l) => l.test_id)
    );

  if (error || !tests) return [];
  return tests;
}

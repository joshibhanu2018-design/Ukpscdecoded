import { supabaseAdmin } from "./supabase";

export type StudentRow = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  purchases: string[];
};

const PAGE = 1000;

async function fetchAll<T>(query: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await query(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) return rows;
  }
}

/** Every student account, newest first, with the names of the packages they bought. */
export async function getStudents(): Promise<StudentRow[]> {
  const db = supabaseAdmin();
  const [users, enrollments, packages] = await Promise.all([
    fetchAll<{ id: string; full_name: string | null; email: string; phone: string | null; created_at: string }>((from, to) =>
      db.from("users").select("id, full_name, email, phone, created_at").eq("role", "student").order("created_at", { ascending: false }).range(from, to)
    ),
    fetchAll<{ user_id: string; package_id: string }>((from, to) =>
      db.from("enrollments").select("user_id, package_id").order("created_at").range(from, to)
    ),
    fetchAll<{ id: string; package_name: string }>((from, to) => db.from("packages").select("id, package_name").range(from, to)),
  ]);

  const packageName = new Map(packages.map((p) => [p.id, p.package_name]));
  const bought = new Map<string, string[]>();
  for (const e of enrollments) {
    const list = bought.get(e.user_id) ?? [];
    const name = packageName.get(e.package_id) ?? "Unknown package";
    if (!list.includes(name)) list.push(name);
    bought.set(e.user_id, list);
  }

  return users.map((u) => ({ ...u, purchases: bought.get(u.id) ?? [] }));
}

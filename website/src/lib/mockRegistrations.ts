import { supabaseAdmin } from "./supabase";
import { fetchAll } from "./students";

export type MockRegistration = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  district: string | null;
  source: string;
  page: string | null;
  created_at: string;
};

/** Every free-mock popup registration, newest first. */
export async function getMockRegistrations(): Promise<MockRegistration[]> {
  const db = supabaseAdmin();
  return fetchAll<MockRegistration>((from, to) =>
    db
      .from("mock_registrations")
      .select("id, full_name, phone, email, district, source, page, created_at")
      .order("created_at", { ascending: false })
      .range(from, to)
  );
}

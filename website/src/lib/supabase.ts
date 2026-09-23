import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Public client — safe to import from client components. Uses the anon key,
 * which is subject to Row Level Security (RLS is deny-by-default for every
 * test-platform table, see supabase/schema.sql).
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

let adminClient: SupabaseClient | null = null;

/**
 * Server-only client backed by the service role key, which bypasses RLS.
 * Only call this from API routes / server components. Never import the
 * result into a "use client" component — the service role key is never
 * bundled to the browser (it's not NEXT_PUBLIC_-prefixed), but this keeps
 * the admin client itself out of client code paths too.
 */
export function supabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-side only, never NEXT_PUBLIC_)."
    );
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}

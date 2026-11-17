import { supabaseAdmin } from "./supabase";
import { FINAL_SCHEDULE, MAHASANGRAM_SLUG } from "./finalMonth";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, type Enrollment } from "./packages";
import { sendWhatsApp, whatsappCampaignName } from "./whatsapp";

/**
 * Morning WhatsApp reminder on a Rank Challenge mock day, to every student
 * who has the mocks (bought directly, or included with another pack).
 * Runs from the daily 8 am cron. Does nothing unless the AiSensy key and
 * AISENSY_CAMPAIGN_MOCK_DAY are set, and nothing on days without a mock.
 */
export async function sendMockDayReminders(): Promise<{ mock: string | null; recipients: number; sent: number }> {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const mock = FINAL_SCHEDULE.find((t) => t.kind === "mock" && t.date === today);
  if (!mock || !whatsappCampaignName("mock_day")) return { mock: mock?.name ?? null, recipients: 0, sent: 0 };

  const db = supabaseAdmin();
  const [all, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  const maha = all.find((p) => p.slug === MAHASANGRAM_SLUG);
  if (!maha) return { mock: mock.name, recipients: 0, sent: 0 };

  // Active enrollments, 1,000 rows at a time (the API's page size).
  const byUser = new Map<string, Enrollment[]>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("enrollments")
      .select("id, user_id, package_id, status, access_valid_till, attempts_used, created_at")
      .eq("status", "active")
      .or(`access_valid_till.is.null,access_valid_till.gte.${today}`)
      .order("id")
      .range(from, from + 999);
    if (error) throw new Error(`Could not load enrollments: ${error.message}`);
    for (const e of (data ?? []) as Enrollment[]) byUser.set(e.user_id, [...(byUser.get(e.user_id) ?? []), e]);
    if (!data || data.length < 1000) break;
  }
  const userIds = [...byUser.entries()].filter(([, es]) => getOwnedPackageIds(es, includes, all).has(maha.id)).map(([id]) => id);

  const people: { phone: string | null; full_name: string | null }[] = [];
  for (let i = 0; i < userIds.length; i += 300) {
    const { data } = await db.from("users").select("phone, full_name").in("id", userIds.slice(i, i + 300));
    people.push(...((data ?? []) as { phone: string | null; full_name: string | null }[]));
  }

  let sent = 0;
  const withPhone = people.filter((p) => p.phone);
  for (let i = 0; i < withPhone.length; i += 10) {
    const results = await Promise.all(
      withPhone.slice(i, i + 10).map((p) => sendWhatsApp("mock_day", { phone: p.phone, name: p.full_name }, [p.full_name?.trim() || "Student", mock.name]))
    );
    sent += results.filter(Boolean).length;
  }
  return { mock: mock.name, recipients: withPhone.length, sent };
}

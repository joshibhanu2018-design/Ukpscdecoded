import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { toCsv } from "@/lib/csv";
import { fetchAll, getStudents } from "@/lib/students";
import { supabaseAdmin } from "@/lib/supabase";
import { LIVE_SERIES, WARMUP_SERIES } from "@/lib/liveMock";

/**
 * CSV for calling and broadcasting: everyone who signed up through the free
 * Rank Challenge form or opened the Warm-up Mock or a live mock. Name, mobile,
 * email, district, warm-up status and score, live mocks taken, purchases.
 */
export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const db = supabaseAdmin();
  const { data: tests, error } = await db.from("tests").select("id, live_series").in("live_series", [WARMUP_SERIES, LIVE_SERIES]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const warmupIds = new Set((tests ?? []).filter((t) => t.live_series === WARMUP_SERIES).map((t) => t.id as string));
  const testIds = (tests ?? []).map((t) => t.id as string);

  const [attempts, formUsers, students] = await Promise.all([
    testIds.length
      ? fetchAll<{ user_id: string; test_id: string; status: string | null; score: number | null }>((from, to) =>
          db.from("attempts").select("user_id, test_id, status, score").in("test_id", testIds).order("id").range(from, to)
        )
      : Promise.resolve([]),
    fetchAll<{ id: string; district: string | null; signup_source: string | null }>((from, to) =>
      db.from("users").select("id, district, signup_source").or("signup_source.eq.mahasangram,district.not.is.null").order("id").range(from, to)
    ),
    getStudents(),
  ]);

  type Info = { warmup: "submitted" | "started" | ""; score: number | null; live: Set<string> };
  const info = new Map<string, Info>();
  for (const a of attempts) {
    const i = info.get(a.user_id) ?? { warmup: "", score: null, live: new Set<string>() };
    if (warmupIds.has(a.test_id)) {
      if (a.status === "submitted") {
        i.warmup = "submitted";
        i.score = Math.max(i.score ?? -Infinity, a.score ?? 0);
      } else if (!i.warmup) i.warmup = "started";
    } else if (a.status === "submitted") i.live.add(a.test_id);
    info.set(a.user_id, i);
  }
  const extra = new Map(formUsers.map((u) => [u.id, u]));

  const rows = students
    .filter((s) => info.has(s.id) || extra.get(s.id)?.signup_source === "mahasangram")
    .map((s) => {
      const i = info.get(s.id);
      return {
        name: s.full_name ?? "",
        phone: s.phone ?? "",
        email: s.email,
        district: extra.get(s.id)?.district ?? "",
        joined: new Date(s.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
        warmup: i?.warmup || "not started",
        warmup_score: i?.score ?? "",
        live_mocks_taken: i?.live.size ?? 0,
        purchases: s.purchases.join("; "),
      };
    });

  const header = "name,phone,email,district,joined,warmup,warmup_score,live_mocks_taken,purchases";
  return new NextResponse("﻿" + (rows.length ? toCsv(rows) : header), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rank-challenge-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

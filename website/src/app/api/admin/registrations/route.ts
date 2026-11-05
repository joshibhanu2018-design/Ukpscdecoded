import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { toCsv } from "@/lib/csv";
import { getMockRegistrations } from "@/lib/mockRegistrations";

/** CSV of every free-mock popup registration. */
export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const rows = (await getMockRegistrations()).map((r) => ({
    name: r.full_name,
    phone: r.phone,
    email: r.email,
    district: r.district ?? "",
    registered: new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    page: r.page ?? "",
  }));
  const header = "name,phone,email,district,registered,page";
  return new NextResponse("﻿" + (rows.length ? toCsv(rows) : header), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mock-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

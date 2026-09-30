import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { toCsv } from "@/lib/csv";
import { getStudents } from "@/lib/students";

/** CSV of every student account (name, email, mobile, joined, purchases). */
export async function GET() {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const rows = (await getStudents()).map((s) => ({
    name: s.full_name ?? "",
    email: s.email,
    phone: s.phone ?? "",
    joined: new Date(s.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
    purchases: s.purchases.join("; "),
  }));

  // BOM so Excel opens Hindi names correctly.
  return new NextResponse("﻿" + toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="students-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

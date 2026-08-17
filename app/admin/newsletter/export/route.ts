import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireAdminSession();

  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });

  const rows = [
    ["email", "subscribed_at", "status"],
    ...subscribers.map((s) => [s.email, s.createdAt.toISOString(), s.consented ? "subscribed" : "unsubscribed"]),
  ];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

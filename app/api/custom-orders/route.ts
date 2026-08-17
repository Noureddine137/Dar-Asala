import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(60).optional(),
  requestedProductName: z.string().max(200).optional(),
  leatherColor: z.string().max(200).optional(),
  dimensions: z.string().max(200).optional(),
  strapLength: z.string().max(200).optional(),
  initials: z.string().max(10).optional(),
  lining: z.string().max(200).optional(),
  hardware: z.string().max(200).optional(),
  message: z.string().max(4000).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }

  await prisma.customOrderRequest.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}

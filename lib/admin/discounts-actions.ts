"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

export async function createDiscountCode(formData: FormData) {
  await requireAdminSession();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) throw new Error("Code is required.");

  const percentOffRaw = formData.get("percentOff");
  const amountOffRaw = formData.get("amountOff");
  const expiresAtRaw = formData.get("expiresAt");

  try {
    await prisma.discountCode.create({
      data: {
        code,
        percentOff: percentOffRaw ? Number(percentOffRaw) : null,
        amountOff: amountOffRaw ? Number(amountOffRaw) : null,
        expiresAt: expiresAtRaw ? new Date(String(expiresAtRaw)) : null,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`Code "${code}" already exists.`);
    }
    throw err;
  }

  revalidatePath("/admin/discounts");
}

export async function toggleDiscountCode(discountId: string, active: boolean) {
  await requireAdminSession();
  await prisma.discountCode.update({ where: { id: discountId }, data: { active } });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscountCode(discountId: string) {
  await requireAdminSession();
  await prisma.discountCode.delete({ where: { id: discountId } });
  revalidatePath("/admin/discounts");
}

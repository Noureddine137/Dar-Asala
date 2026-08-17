"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

function num(formData: FormData, key: string) {
  const raw = formData.get(key);
  return raw ? Number(raw) : null;
}

export async function addShippingZone(formData: FormData) {
  await requireAdminSession();
  const region = String(formData.get("region") ?? "").trim();
  const countries = String(formData.get("countries") ?? "").trim();
  const estimate = String(formData.get("estimate") ?? "").trim();
  if (!region || !countries || !estimate) throw new Error("Region, countries and estimate are required.");

  const maxPosition = await prisma.shippingZone.aggregate({ _max: { position: true } });

  await prisma.shippingZone.create({
    data: {
      region,
      countries,
      estimate,
      price: num(formData, "price") ?? 0,
      freeThreshold: num(formData, "freeThreshold"),
      carrier: String(formData.get("carrier") ?? "").trim() || null,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  revalidatePath("/admin/shipping");
  revalidatePath("/shipping");
  revalidatePath("/", "layout");
}

export async function updateShippingZone(zoneId: string, formData: FormData) {
  await requireAdminSession();
  const region = String(formData.get("region") ?? "").trim();
  const countries = String(formData.get("countries") ?? "").trim();
  const estimate = String(formData.get("estimate") ?? "").trim();
  if (!region || !countries || !estimate) throw new Error("Region, countries and estimate are required.");

  await prisma.shippingZone.update({
    where: { id: zoneId },
    data: {
      region,
      countries,
      estimate,
      price: num(formData, "price") ?? 0,
      freeThreshold: num(formData, "freeThreshold"),
      carrier: String(formData.get("carrier") ?? "").trim() || null,
      active: formData.get("active") === "on",
    },
  });

  revalidatePath("/admin/shipping");
  revalidatePath("/shipping");
  revalidatePath("/", "layout");
}

export async function deleteShippingZone(zoneId: string) {
  await requireAdminSession();
  await prisma.shippingZone.delete({ where: { id: zoneId } });
  revalidatePath("/admin/shipping");
  revalidatePath("/shipping");
  revalidatePath("/", "layout");
}

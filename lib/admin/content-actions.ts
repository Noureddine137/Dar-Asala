"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

async function ensureSettings() {
  return prisma.storeSettings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });
}

export async function updateStoreSettings(formData: FormData) {
  await requireAdminSession();
  await ensureSettings();

  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const optStr = (key: string) => str(key) || null;

  await prisma.storeSettings.update({
    where: { id: "singleton" },
    data: {
      storeName: str("storeName"),
      contactEmail: str("contactEmail"),
      contactPhone: optStr("contactPhone"),
      whatsappNumber: optStr("whatsappNumber"),
      businessAddress: optStr("businessAddress"),
      currency: str("currency") || "EUR",
      freeShippingThreshold: Number(formData.get("freeShippingThreshold") ?? 0),
      defaultProductionTime: str("defaultProductionTime"),
      instagramUrl: optStr("instagramUrl"),
      facebookUrl: optStr("facebookUrl"),
      tiktokUrl: optStr("tiktokUrl"),
      brandOriginCountry: str("brandOriginCountry"),
      brandWorkshopLocations: str("brandWorkshopLocations"),
      leatherClaim: str("leatherClaim"),
      artisanProcessClaim: str("artisanProcessClaim"),
      productionModelClaim: str("productionModelClaim"),
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

export async function updateHomepageContent(formData: FormData) {
  await requireAdminSession();
  await ensureSettings();

  const str = (key: string) => String(formData.get(key) ?? "").trim();

  await prisma.storeSettings.update({
    where: { id: "singleton" },
    data: {
      heroHeadline: str("heroHeadline"),
      heroSubtitle: str("heroSubtitle"),
      heroImageUrl: str("heroImageUrl"),
      heroCtaLabel: str("heroCtaLabel"),
      heroCtaHref: str("heroCtaHref"),
      brandStoryHeading: str("brandStoryHeading"),
      brandStoryBody: str("brandStoryBody"),
      brandStoryImageUrl: str("brandStoryImageUrl"),
      customOrderHeading: str("customOrderHeading"),
      customOrderBody: str("customOrderBody"),
      customOrderImageUrl: str("customOrderImageUrl"),
      newsletterHeading: str("newsletterHeading"),
      newsletterBody: str("newsletterBody"),
    },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

export async function addTestimonial(formData: FormData) {
  await requireAdminSession();
  const quote = String(formData.get("quote") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  if (!quote || !authorName || !country) throw new Error("Quote, author and country are required.");

  const maxPosition = await prisma.testimonial.aggregate({ _max: { position: true } });

  await prisma.testimonial.create({
    data: {
      quote,
      authorName,
      country,
      rating: Number(formData.get("rating") ?? 5),
      avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

export async function updateTestimonial(testimonialId: string, formData: FormData) {
  await requireAdminSession();
  const quote = String(formData.get("quote") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  if (!quote || !authorName || !country) throw new Error("Quote, author and country are required.");

  await prisma.testimonial.update({
    where: { id: testimonialId },
    data: {
      quote,
      authorName,
      country,
      rating: Number(formData.get("rating") ?? 5),
      avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
      active: formData.get("active") === "on",
    },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

export async function deleteTestimonial(testimonialId: string) {
  await requireAdminSession();
  await prisma.testimonial.delete({ where: { id: testimonialId } });
  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

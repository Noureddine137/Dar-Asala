"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

async function ensureSettings() {
  return prisma.storeSettings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });
}

// General/operational fields — not customer-copy, so never translated.
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
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

// English business claims — the canonical/fallback source, stored directly
// on StoreSettings (not a translation row); see updateBusinessClaimsTranslation
// in translation-actions.ts for DE/FR. Split out of updateStoreSettings so
// the admin "Content" locale tabs can each submit independently.
export async function updateBusinessClaimsEn(formData: FormData) {
  await requireAdminSession();
  await ensureSettings();

  const str = (key: string) => String(formData.get(key) ?? "").trim();

  await prisma.storeSettings.update({
    where: { id: "singleton" },
    data: {
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

// Images and links — shared across every language, never duplicated per
// translation. Split from updateHomepageContentEn() below so the admin
// "Content" locale tabs can each submit independently.
export async function updateHomepageMedia(formData: FormData) {
  await requireAdminSession();
  await ensureSettings();

  const str = (key: string) => String(formData.get(key) ?? "").trim();

  await prisma.storeSettings.update({
    where: { id: "singleton" },
    data: {
      heroImageUrl: str("heroImageUrl"),
      heroCtaHref: str("heroCtaHref"),
      brandStoryImageUrl: str("brandStoryImageUrl"),
      customOrderImageUrl: str("customOrderImageUrl"),
    },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

// English content — the canonical/fallback source, stored directly on
// StoreSettings (not a translation row); see StoreSettingsTranslation for
// DE/FR (lib/admin/translation-actions.ts).
export async function updateHomepageContentEn(formData: FormData) {
  await requireAdminSession();
  await ensureSettings();

  const str = (key: string) => String(formData.get(key) ?? "").trim();

  await prisma.storeSettings.update({
    where: { id: "singleton" },
    data: {
      heroHeadline: str("heroHeadline"),
      heroSubtitle: str("heroSubtitle"),
      heroCtaLabel: str("heroCtaLabel"),
      brandStoryHeading: str("brandStoryHeading"),
      brandStoryBody: str("brandStoryBody"),
      customOrderHeading: str("customOrderHeading"),
      customOrderBody: str("customOrderBody"),
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

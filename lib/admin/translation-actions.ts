"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";
import { toPrismaLocale, type Locale } from "@/lib/i18n/merge";

function requirePrismaLocale(locale: Locale) {
  const prismaLocale = toPrismaLocale(locale);
  if (!prismaLocale) throw new Error("English is edited directly on the product/collection/settings form, not as a translation.");
  return prismaLocale;
}

export async function updateProductTranslation(productId: string, locale: Locale, formData: FormData) {
  await requireAdminSession();
  const prismaLocale = requirePrismaLocale(locale);
  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const optStr = (key: string) => str(key) || null;

  await prisma.productTranslation.upsert({
    where: { productId_locale: { productId, locale: prismaLocale } },
    update: {
      name: str("name"),
      shortDescription: str("shortDescription"),
      description: str("description"),
      story: optStr("story"),
      materials: str("materials"),
      careInstructions: str("careInstructions"),
      seoTitle: optStr("seoTitle"),
      seoDescription: optStr("seoDescription"),
    },
    create: {
      productId,
      locale: prismaLocale,
      name: str("name"),
      shortDescription: str("shortDescription"),
      description: str("description"),
      story: optStr("story"),
      materials: str("materials"),
      careInstructions: str("careInstructions"),
      seoTitle: optStr("seoTitle"),
      seoDescription: optStr("seoDescription"),
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function updateCollectionTranslation(collectionId: string, locale: Locale, formData: FormData) {
  await requireAdminSession();
  const prismaLocale = requirePrismaLocale(locale);
  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const optStr = (key: string) => str(key) || null;

  await prisma.collectionTranslation.upsert({
    where: { collectionId_locale: { collectionId, locale: prismaLocale } },
    update: {
      title: str("title"),
      description: str("description"),
      seoTitle: optStr("seoTitle"),
      seoDescription: optStr("seoDescription"),
    },
    create: {
      collectionId,
      locale: prismaLocale,
      title: str("title"),
      description: str("description"),
      seoTitle: optStr("seoTitle"),
      seoDescription: optStr("seoDescription"),
    },
  });

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/");
}

async function ensureSettings() {
  return prisma.storeSettings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } });
}

// Split into two actions (rather than one covering all StoreSettingsTranslation
// columns) because they're edited on two different admin pages — Homepage
// and Settings — each submitting independently. Each `update`/`create` data
// object only ever names its own subset of columns, so saving one never
// blanks out fields the other action owns on the same translation row.
export async function updateHomepageTranslation(locale: Locale, formData: FormData) {
  await requireAdminSession();
  const prismaLocale = requirePrismaLocale(locale);
  await ensureSettings();
  const optStr = (key: string) => String(formData.get(key) ?? "").trim() || null;

  const data = {
    heroHeadline: optStr("heroHeadline"),
    heroSubtitle: optStr("heroSubtitle"),
    heroCtaLabel: optStr("heroCtaLabel"),
    brandStoryHeading: optStr("brandStoryHeading"),
    brandStoryBody: optStr("brandStoryBody"),
    customOrderHeading: optStr("customOrderHeading"),
    customOrderBody: optStr("customOrderBody"),
    newsletterHeading: optStr("newsletterHeading"),
    newsletterBody: optStr("newsletterBody"),
  };

  await prisma.storeSettingsTranslation.upsert({
    where: { settingsId_locale: { settingsId: "singleton", locale: prismaLocale } },
    update: data,
    create: { settingsId: "singleton", locale: prismaLocale, ...data },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

export async function updateBusinessClaimsTranslation(locale: Locale, formData: FormData) {
  await requireAdminSession();
  const prismaLocale = requirePrismaLocale(locale);
  await ensureSettings();
  const optStr = (key: string) => String(formData.get(key) ?? "").trim() || null;

  const data = {
    brandOriginCountry: optStr("brandOriginCountry"),
    brandWorkshopLocations: optStr("brandWorkshopLocations"),
    leatherClaim: optStr("leatherClaim"),
    artisanProcessClaim: optStr("artisanProcessClaim"),
    productionModelClaim: optStr("productionModelClaim"),
  };

  await prisma.storeSettingsTranslation.upsert({
    where: { settingsId_locale: { settingsId: "singleton", locale: prismaLocale } },
    update: data,
    create: { settingsId: "singleton", locale: prismaLocale, ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

export async function updateTestimonialTranslation(testimonialId: string, locale: Locale, formData: FormData) {
  await requireAdminSession();
  const prismaLocale = requirePrismaLocale(locale);
  const quote = String(formData.get("quote") ?? "").trim() || null;

  await prisma.testimonialTranslation.upsert({
    where: { testimonialId_locale: { testimonialId, locale: prismaLocale } },
    update: { quote: quote ?? "" },
    create: { testimonialId, locale: prismaLocale, quote: quote ?? "" },
  });

  revalidatePath("/admin/homepage");
  revalidatePath("/", "layout");
}

import "server-only";
import { cache } from "react";
import type { StoreSettings } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

// Mirrors the @default() values in prisma/schema.prisma — used only if the
// singleton row hasn't been created yet (e.g. migrated but not seeded).
const FALLBACK: Omit<StoreSettings, "id" | "updatedAt"> = {
  storeName: "Dar Asala",
  contactEmail: "hello@darasala.example",
  contactPhone: null,
  whatsappNumber: null,
  businessAddress: null,
  currency: "EUR",
  freeShippingThreshold: 250 as unknown as StoreSettings["freeShippingThreshold"],
  defaultProductionTime: "Made to order — handcrafted in 7-14 business days",
  instagramUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
  brandOriginCountry: "Morocco",
  brandWorkshopLocations: "Marrakech and Fez",
  leatherClaim: "full-grain, vegetable-tanned leather",
  artisanProcessClaim: "hand-cut, hand-stitched and finished by a single artisan from start to finish",
  productionModelClaim: "small-batch, made to order",
  heroHeadline: "Handcrafted in Morocco. Made to last.",
  heroSubtitle: "Timeless leather bags shaped by our artisans, carried by you.",
  heroImageUrl: "/images/hero/hero-main.webp",
  heroCtaLabel: "Shop the Collection",
  heroCtaHref: "/collections/all",
  brandStoryHeading: "Slow by design.",
  brandStoryBody: "Each Dar Asala piece is shaped by artisans using techniques rooted in Moroccan leather craftsmanship.",
  brandStoryImageUrl: "/images/brand/story.webp",
  customOrderHeading: "Made for You",
  customOrderBody: "Choose your leather, color, strap and selected finishing details, and our artisans will hand-build a piece around your choices.",
  customOrderImageUrl: "/images/brand/custom-orders.webp",
  newsletterHeading: "Letters from the Atelier",
  newsletterBody: "New pieces, artisan stories and private releases — straight to your inbox, roughly once a month.",
};

/**
 * Single settings row, editable from /admin/settings and /admin/homepage.
 * Wrapped in React's cache() so the many storefront components that each
 * need a slice of this (hero, brand story, footer, contact info, business
 * claims...) share one query per request instead of one each.
 */
export const getStoreSettings = cache(async function getStoreSettings(): Promise<StoreSettings> {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;
  return { id: "singleton", updatedAt: new Date(), ...FALLBACK };
});

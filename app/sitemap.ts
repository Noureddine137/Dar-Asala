import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { JOURNAL_ARTICLES } from "@/lib/content/journal";
import { LEGAL_PAGES } from "@/lib/content/legal";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/collections/all",
  "/collections/new-arrivals",
  "/collections/best-sellers",
  "/about",
  "/about/craftsmanship",
  "/about/materials",
  "/artisans",
  "/contact",
  "/custom-orders",
  "/faq",
  "/shipping",
  "/returns",
  "/journal",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${siteUrl}/collections/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const journalEntries: MetadataRoute.Sitemap = JOURNAL_ARTICLES.map((a) => ({
    url: `${siteUrl}/journal/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const legalEntries: MetadataRoute.Sitemap = Object.keys(LEGAL_PAGES).map((slug) => ({
    url: `${siteUrl}/legal/${slug}`,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [...staticEntries, ...productEntries, ...collectionEntries, ...journalEntries, ...legalEntries];
}

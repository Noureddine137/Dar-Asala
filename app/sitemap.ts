import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { JOURNAL_ARTICLES } from "@/lib/content/journal";
import { LEGAL_PAGES } from "@/lib/content/legal";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/utils/seo";

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

type Entry = { lastModified?: Date; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number };

/**
 * One <url> per locale for every route, each carrying hreflang alternates to
 * every other locale (+ x-default -> English) — this is what tells search
 * engines the per-locale URLs are intentional alternates of the same page
 * rather than duplicate content, which matters most for the legal/journal
 * pages whose body copy is still English-only across all three locales.
 */
function localizedEntries(path: string, { lastModified, changeFrequency, priority }: Entry): MetadataRoute.Sitemap {
  const languages: Record<string, string> = { "x-default": localizedUrl(routing.defaultLocale, path) };
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  return routing.locales.map((locale) => ({
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries = STATIC_ROUTES.flatMap((path) =>
    localizedEntries(path, {
      lastModified: new Date(),
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })
  );

  const productEntries = products.flatMap((p) =>
    localizedEntries(`/products/${p.slug}`, { lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.8 })
  );

  const collectionEntries = collections.flatMap((c) =>
    localizedEntries(`/collections/${c.slug}`, { lastModified: c.updatedAt, changeFrequency: "weekly", priority: 0.7 })
  );

  const journalEntries = JOURNAL_ARTICLES.flatMap((a) =>
    localizedEntries(`/journal/${a.slug}`, { changeFrequency: "monthly", priority: 0.5 })
  );

  const legalEntries = Object.keys(LEGAL_PAGES).flatMap((slug) =>
    localizedEntries(`/legal/${slug}`, { changeFrequency: "yearly", priority: 0.2 })
  );

  return [...staticEntries, ...productEntries, ...collectionEntries, ...journalEntries, ...legalEntries];
}

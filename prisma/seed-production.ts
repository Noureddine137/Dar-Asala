/**
 * Safe production bootstrap — run ONCE against a fresh Neon production
 * database after `prisma migrate deploy`, before pointing customers at it.
 *
 * This script creates only structural records the app requires to render
 * without crashing (a missing StoreSettings singleton or zero ShippingZone
 * rows both break real pages/checkout), plus the real collection taxonomy.
 * It never touches products, reviews, testimonials, or subscribers — those
 * are either entered for real through /admin or must stay entirely out of
 * production. See prisma/seed.ts for the demo/development catalog that
 * MUST NOT be run against production.
 *
 * Idempotent: safe to re-run. StoreSettings is upserted (never overwrites
 * an admin edit after the first run), Collections are upserted on slug, and
 * ShippingZone defaults are only inserted if the table is still empty.
 *
 * ACTION REQUIRED AFTER RUNNING THIS SCRIPT — none of the following ships
 * as "final" content, only as the minimum the app needs to boot:
 *   1. Review/edit StoreSettings copy in Admin → Settings and Admin →
 *      Homepage (hero, brand story, custom-order, newsletter copy, and the
 *      business claims — origin country, leather claim, artisan-process
 *      claim — are all placeholder text pending business/legal sign-off).
 *   2. Confirm real shipping rates, thresholds, and countries in Admin →
 *      Shipping. The rows below are reasonable defaults, not verified
 *      pricing.
 *   3. Add real products through Admin → Products (with real SKUs, stock,
 *      and images) — this script intentionally seeds none.
 *   4. Fill in DE/FR translations for whatever you actually publish, via
 *      each editor's locale tabs. `prisma/seed-translations.ts` is a
 *      demo-only reference script keyed to the sample catalog and must not
 *      be run against production.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLLECTIONS: { slug: string; title: string; description: string }[] = [
  {
    slug: "handbags",
    title: "Handbags",
    description: "Structured, top-handle silhouettes for everyday elegance.",
  },
  {
    slug: "shoulder-bags",
    title: "Shoulder Bags",
    description: "Softly structured bags made to sit easily at the shoulder or hip.",
  },
  {
    slug: "crossbody-bags",
    title: "Crossbody Bags",
    description: "Compact, hands-free companions for travelling light.",
  },
  {
    slug: "tote-bags",
    title: "Tote Bags",
    description: "Spacious, unstructured totes built for the everyday carry.",
  },
  {
    slug: "mini-bags",
    title: "Mini Bags",
    description: "Small-scale silhouettes for the essentials, from day into evening.",
  },
  {
    slug: "leather-accessories",
    title: "Leather Accessories",
    description: "Small leather goods, made in the same workshop as our bags — arriving soon.",
  },
];

async function main() {
  console.log("Running SAFE production bootstrap (no products, reviews, testimonials, or subscribers)...");

  for (const [index, c] of COLLECTIONS.entries()) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        heroImage: `/images/categories/${c.slug}.webp`,
        position: index,
      },
    });
  }
  console.log(`Ensured ${COLLECTIONS.length} collections exist.`);

  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "Handcrafted in Morocco.\nMade to last.",
      heroSubtitle: "Timeless leather bags shaped by our artisans, carried by you.",
      heroImageUrl: "/images/hero/hero-main.webp",
      heroCtaLabel: "Shop the Collection",
      heroCtaHref: "/collections/all",
      brandStoryHeading: "Slow by design.",
      brandStoryBody:
        "Each Dar Asala piece is shaped by artisans using techniques rooted in Moroccan leather craftsmanship — hand-cut, hand-stitched and finished one bag at a time in small workshops across Marrakech and Fez.\nWe work in small batches by choice, not necessity: it is the only way to keep the quality — and the people — behind every bag visible.",
      brandStoryImageUrl: "/images/brand/story.webp",
      customOrderHeading: "Made for You",
      customOrderBody:
        "Choose your leather, color, strap and selected finishing details, and our artisans will hand-build a piece around your choices.",
      customOrderImageUrl: "/images/brand/custom-orders.webp",
      newsletterHeading: "Letters from the Atelier",
      newsletterBody:
        "New pieces, artisan stories and private releases — straight to your inbox, roughly once a month.",
    },
  });
  console.log("Ensured StoreSettings singleton exists.");

  const existingZones = await prisma.shippingZone.count();
  if (existingZones === 0) {
    await prisma.shippingZone.createMany({
      data: [
        {
          region: "European Union",
          countries: "DE, FR, NL, BE, AT, ES, IT, PT, LU, IE",
          price: 12,
          freeThreshold: 250,
          estimate: "3-7 business days",
          carrier: "DHL Express",
          active: true,
          position: 0,
        },
        {
          region: "United Kingdom",
          countries: "GB",
          price: 15,
          freeThreshold: 250,
          estimate: "4-8 business days",
          carrier: "DHL Express",
          active: true,
          position: 1,
        },
        {
          region: "United States",
          countries: "US",
          price: 20,
          freeThreshold: 250,
          estimate: "5-10 business days",
          carrier: "DHL Express",
          active: true,
          position: 2,
        },
        {
          region: "Switzerland",
          countries: "CH",
          price: 18,
          freeThreshold: 250,
          estimate: "4-8 business days",
          carrier: "DHL Express",
          active: true,
          position: 3,
        },
      ],
    });
    console.log("Created 4 default shipping zones — verify pricing/countries in Admin → Shipping before launch.");
  } else {
    console.log(`ShippingZone table already has ${existingZones} row(s) — left untouched.`);
  }

  console.log(
    "\nBootstrap complete. NOT seeded (by design): products, variants, images, reviews, testimonials, " +
      "newsletter subscribers, DE/FR sample translations. Add real products and translations through /admin."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

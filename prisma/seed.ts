import { PrismaClient, LeatherColor, BagSize, HardwareFinish, StrapType } from "@prisma/client";

const prisma = new PrismaClient();

type SeedVariant = {
  color: LeatherColor;
  size: BagSize;
  hardware?: HardwareFinish;
  strap?: StrapType;
  stock: number;
  isMadeToOrder?: boolean;
};

type SeedProduct = {
  slug: string;
  name: string;
  category: "handbags" | "shoulder-bags" | "crossbody-bags" | "tote-bags" | "mini-bags";
  shortDescription: string;
  description: string;
  story?: string;
  price: number;
  compareAtPrice?: number;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isMadeToOrder?: boolean;
  materials: string;
  careInstructions: string;
  productionTime: string;
  variants: SeedVariant[];
};

const MATERIALS_DEFAULT =
  "Full-grain, vegetable-tanned Moroccan leather. Solid brass or antique-brass hardware. Cotton-twill lining.";
const CARE_DEFAULT =
  "Wipe clean with a soft, dry cloth. Condition the leather every few months with a natural leather balm. Avoid prolonged exposure to direct sun and rain. Store stuffed with tissue in the dust bag when not in use.";

const PRODUCTS: SeedProduct[] = [
  {
    slug: "lalla-leather-bag",
    name: "Lalla Leather Bag",
    category: "handbags",
    shortDescription: "A structured handmade handbag finished by hand in Morocco.",
    description:
      "A structured handmade handbag crafted from genuine leather and finished by hand in Morocco. The Lalla balances a clean silhouette with hand-burnished edges and a fully lined interior, made to move easily from morning to evening.",
    story:
      "Cut and stitched by a single artisan from start to finish, each Lalla bag carries small, deliberate variations in grain that mark it as handmade, not mass-produced.",
    price: 245,
    compareAtPrice: 285,
    featured: true,
    isBestSeller: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "COGNAC", size: "MEDIUM", stock: 6 },
      { color: "COGNAC", size: "LARGE", stock: 4 },
      { color: "DARK_BROWN", size: "MEDIUM", stock: 5 },
      { color: "DARK_BROWN", size: "LARGE", stock: 3 },
      { color: "OLIVE", size: "MEDIUM", stock: 4 },
      { color: "OLIVE", size: "LARGE", stock: 0, isMadeToOrder: true },
      { color: "BLACK", size: "MEDIUM", stock: 7 },
      { color: "BLACK", size: "LARGE", stock: 2 },
    ],
  },
  {
    slug: "zahra-tote",
    name: "Zahra Tote",
    category: "tote-bags",
    shortDescription: "An oversized everyday tote in supple full-grain leather.",
    description:
      "The Zahra Tote is built for the everyday carry — spacious enough for a laptop and daily essentials, with reinforced hand-stitched straps and a soft, unstructured drape that only improves with age.",
    story:
      "Named after the orange blossom, the Zahra takes shape over two full days of hand-cutting, skiving and stitching in a small Marrakech workshop.",
    price: 285,
    featured: true,
    isNew: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "Made to order — handcrafted in 7–14 business days",
    isMadeToOrder: true,
    variants: [
      { color: "COGNAC", size: "LARGE", stock: 0, isMadeToOrder: true },
      { color: "DARK_BROWN", size: "LARGE", stock: 0, isMadeToOrder: true },
      { color: "NATURAL", size: "LARGE", stock: 0, isMadeToOrder: true },
    ],
  },
  {
    slug: "atlas-crossbody",
    name: "Atlas Crossbody",
    category: "crossbody-bags",
    shortDescription: "A compact crossbody with an adjustable hand-braided strap.",
    description:
      "Named for the mountain range that shapes so much of Morocco's leather-working tradition, the Atlas Crossbody pairs a compact, structured body with a long adjustable strap for effortless everyday wear.",
    story: "The strap is hand-braided by our leather artisans from three individually cut leather cords.",
    price: 195,
    featured: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "BLACK", size: "MEDIUM", strap: "ADJUSTABLE", stock: 8 },
      { color: "DARK_BROWN", size: "MEDIUM", strap: "ADJUSTABLE", stock: 5 },
      { color: "OLIVE", size: "MEDIUM", strap: "ADJUSTABLE", stock: 3 },
    ],
  },
  {
    slug: "riad-shoulder-bag",
    name: "Riad Shoulder Bag",
    category: "shoulder-bags",
    shortDescription: "A softly structured shoulder bag with a hand-stitched flap.",
    description:
      "Inspired by the courtyard homes of the medina, the Riad Shoulder Bag has a softly structured body, a flap secured by a brass twist-lock, and a shoulder strap sized to sit comfortably at the hip.",
    price: 225,
    isBestSeller: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "OLIVE", size: "MEDIUM", stock: 4 },
      { color: "OLIVE", size: "LARGE", stock: 2 },
      { color: "COGNAC", size: "MEDIUM", stock: 6 },
      { color: "COGNAC", size: "LARGE", stock: 3 },
      { color: "BLACK", size: "MEDIUM", stock: 5 },
      { color: "BLACK", size: "LARGE", stock: 0, isMadeToOrder: true },
    ],
  },
  {
    slug: "medina-mini-bag",
    name: "Medina Mini Bag",
    category: "mini-bags",
    shortDescription: "A miniature top-handle bag sized for the essentials.",
    description:
      "Small in scale but rich in detail, the Medina Mini Bag carries a phone, cards and keys with room to spare, finished with the same hand-burnished edges as our full-size pieces.",
    price: 165,
    isNew: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "NATURAL", size: "MINI", stock: 9 },
      { color: "COGNAC", size: "MINI", stock: 6 },
      { color: "BLACK", size: "MINI", stock: 4 },
    ],
  },
  {
    slug: "noor-bucket-bag",
    name: "Noor Bucket Bag",
    category: "shoulder-bags",
    shortDescription: "A drawstring bucket bag with a hand-rolled top edge.",
    description:
      "The Noor takes its rounded silhouette from traditional Moroccan basket weaving, reinterpreted in soft, drawstring-cinched leather with a detachable shoulder strap.",
    price: 235,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "COGNAC", size: "MEDIUM", stock: 5 },
      { color: "DARK_BROWN", size: "MEDIUM", stock: 3 },
    ],
  },
  {
    slug: "essaouira-tote",
    name: "Essaouira Tote",
    category: "tote-bags",
    shortDescription: "A breezy, coastal-inspired tote in natural leather.",
    description:
      "Named for the windswept port city, the Essaouira Tote is cut from lighter natural leather with open sides and short hand-rolled handles — an easy companion for travel days.",
    price: 310,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "Made to order — handcrafted in 7–14 business days",
    isMadeToOrder: true,
    variants: [
      { color: "NATURAL", size: "LARGE", stock: 0, isMadeToOrder: true },
      { color: "DARK_BROWN", size: "LARGE", stock: 0, isMadeToOrder: true },
    ],
  },
  {
    slug: "amira-bag",
    name: "Amira Bag",
    category: "handbags",
    shortDescription: "A refined top-handle bag with a detachable crossbody strap.",
    description:
      "The Amira combines a polished top-handle silhouette with a detachable, adjustable strap — one bag built to move between a structured handbag and a relaxed crossbody.",
    price: 265,
    featured: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "DARK_BROWN", size: "MEDIUM", stock: 5 },
      { color: "DARK_BROWN", size: "LARGE", stock: 2 },
      { color: "BLACK", size: "MEDIUM", stock: 6 },
      { color: "BLACK", size: "LARGE", stock: 3 },
      { color: "COGNAC", size: "MEDIUM", stock: 4 },
      { color: "COGNAC", size: "LARGE", stock: 0, isMadeToOrder: true },
    ],
  },
  {
    slug: "bahia-shoulder-bag",
    name: "Bahia Shoulder Bag",
    category: "shoulder-bags",
    shortDescription: "A slim, architectural shoulder bag with a brass frame clasp.",
    description:
      "Named after the Bahia Palace, this slim shoulder bag pairs a clean architectural silhouette with a signature brass frame clasp, hand-fitted by our metalworkers.",
    price: 245,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "BLACK", size: "MEDIUM", hardware: "ANTIQUE_BRASS", stock: 4 },
      { color: "OLIVE", size: "MEDIUM", hardware: "ANTIQUE_BRASS", stock: 3 },
    ],
  },
  {
    slug: "safi-crossbody",
    name: "Safi Crossbody",
    category: "crossbody-bags",
    shortDescription: "A slim pouch-style crossbody for travelling light.",
    description:
      "A slim, pouch-style crossbody designed for travelling light — one zip compartment, a flat card slot, and a long adjustable strap worn close to the body.",
    price: 185,
    isNew: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "OLIVE", size: "MEDIUM", strap: "ADJUSTABLE", stock: 5 },
      { color: "COGNAC", size: "MEDIUM", strap: "ADJUSTABLE", stock: 6 },
    ],
  },
  {
    slug: "kasbah-tote",
    name: "Kasbah Tote",
    category: "tote-bags",
    shortDescription: "A limited-run oversized tote in heavyweight leather.",
    description:
      "Produced in small, limited runs, the Kasbah Tote is cut from a heavier weight leather for a bag with real structure and presence — reinforced corners, an interior zip pocket and full-length top handles.",
    story: "Each limited run is numbered and does not return once sold out.",
    price: 340,
    featured: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "Made to order — handcrafted in 7–14 business days",
    isMadeToOrder: true,
    variants: [
      { color: "COGNAC", size: "LARGE", stock: 0, isMadeToOrder: true },
      { color: "NATURAL", size: "LARGE", stock: 0, isMadeToOrder: true },
    ],
  },
  {
    slug: "yasmine-mini",
    name: "Yasmine Mini",
    category: "mini-bags",
    shortDescription: "A rounded mini shoulder bag with a delicate chain strap.",
    description:
      "The Yasmine Mini pairs a rounded, jasmine-inspired silhouette with a fine brass chain strap for a piece that moves easily from day into evening.",
    price: 155,
    isBestSeller: true,
    materials: MATERIALS_DEFAULT,
    careInstructions: CARE_DEFAULT,
    productionTime: "In stock — ships in 1–3 business days",
    variants: [
      { color: "DARK_BROWN", size: "MINI", stock: 7 },
      { color: "NATURAL", size: "MINI", stock: 5 },
      { color: "BLACK", size: "MINI", stock: 6 },
    ],
  },
];

const COLLECTIONS: { slug: string; title: string; description: string; category: SeedProduct["category"] }[] = [
  {
    slug: "handbags",
    title: "Handbags",
    description: "Structured, top-handle silhouettes for everyday elegance.",
    category: "handbags",
  },
  {
    slug: "shoulder-bags",
    title: "Shoulder Bags",
    description: "Softly structured bags made to sit easily at the shoulder or hip.",
    category: "shoulder-bags",
  },
  {
    slug: "crossbody-bags",
    title: "Crossbody Bags",
    description: "Compact, hands-free companions for travelling light.",
    category: "crossbody-bags",
  },
  {
    slug: "tote-bags",
    title: "Tote Bags",
    description: "Spacious, unstructured totes built for the everyday carry.",
    category: "tote-bags",
  },
  {
    slug: "mini-bags",
    title: "Mini Bags",
    description: "Small-scale silhouettes for the essentials, from day into evening.",
    category: "mini-bags",
  },
  {
    slug: "leather-accessories",
    title: "Leather Accessories",
    description: "Small leather goods, made in the same workshop as our bags — arriving soon.",
    category: "handbags", // no products assigned; intentionally left empty for now
  },
];

const REVIEWS: Record<string, { rating: number; title: string; content: string; author: string; country: string }[]> = {
  "lalla-leather-bag": [
    {
      rating: 5,
      title: "Better than the photos",
      content:
        "The leather is even richer in person and the stitching is immaculate. Worth every euro and it only gets better with wear.",
      author: "Sophie B.",
      country: "France",
    },
    {
      rating: 5,
      title: "A genuine investment piece",
      content: "Structured but not stiff, and the size is perfect for daily use without being bulky.",
      author: "Laura M.",
      country: "Germany",
    },
    {
      rating: 4,
      title: "Lovely bag, slow shipping",
      content: "The bag itself is beautiful — took a little longer to arrive than expected but was worth the wait.",
      author: "Anke K.",
      country: "Netherlands",
    },
  ],
  "riad-shoulder-bag": [
    {
      rating: 5,
      title: "Exactly what I wanted",
      content: "Fits my laptop sleeve and still looks elegant for evenings out. The twist-lock feels really solid.",
      author: "Nora H.",
      country: "Belgium",
    },
    {
      rating: 5,
      title: "Compliments every time I wear it",
      content: "The olive colour is gorgeous in person — deeper and warmer than I expected.",
      author: "Elise R.",
      country: "France",
    },
  ],
  "atlas-crossbody": [
    {
      rating: 5,
      title: "Perfect travel bag",
      content: "Took this through three countries. Comfortable strap, fits a passport and phone with room to spare.",
      author: "Sophie B.",
      country: "France",
    },
  ],
  "yasmine-mini": [
    {
      rating: 4,
      title: "Small but mighty",
      content: "Smaller than I imagined but the chain strap is a lovely detail and it holds more than it looks like it should.",
      author: "Anke K.",
      country: "Netherlands",
    },
  ],
  "amira-bag": [
    {
      rating: 5,
      title: "My everyday bag now",
      content: "The detachable strap means it works as a handbag for meetings and a crossbody for the weekend.",
      author: "Laura M.",
      country: "Germany",
    },
  ],
};

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.shippingZone.deleteMany();

  for (const [index, c] of COLLECTIONS.entries()) {
    await prisma.collection.create({
      data: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        heroImage: `/images/categories/${c.slug}.webp`,
        position: index,
      },
    });
  }

  for (const [index, p] of PRODUCTS.entries()) {
    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        story: p.story ?? null,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        category: p.category,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isMadeToOrder: p.isMadeToOrder ?? false,
        materials: p.materials,
        careInstructions: p.careInstructions,
        productionTime: p.productionTime,
        images: {
          create: [
            { url: `/images/products/${p.slug}-front.webp`, alt: `${p.name} — front view`, position: 0, kind: "front" },
            { url: `/images/products/${p.slug}-side.webp`, alt: `${p.name} — side view`, position: 1, kind: "side" },
            { url: `/images/products/${p.slug}-back.webp`, alt: `${p.name} — back view`, position: 2, kind: "back" },
            { url: `/images/products/${p.slug}-detail-stitching.webp`, alt: `${p.name} — stitching detail`, position: 3, kind: "detail-stitching" },
            { url: `/images/products/${p.slug}-detail-hardware.webp`, alt: `${p.name} — hardware detail`, position: 4, kind: "detail-hardware" },
            { url: `/images/products/${p.slug}-lifestyle.webp`, alt: `${p.name} — lifestyle`, position: 5, kind: "lifestyle" },
          ],
        },
      },
      include: { images: true },
    });

    const hoverImage = product.images[1] ?? null;
    await prisma.productVariant.createMany({
      data: p.variants.map((v) => ({
        productId: product.id,
        sku: `${p.slug.toUpperCase()}-${v.color}-${v.size}`,
        color: v.color,
        size: v.size,
        hardware: v.hardware ?? "BRASS",
        strap: v.strap ?? "STANDARD",
        stock: v.stock,
        isMadeToOrder: v.isMadeToOrder ?? p.isMadeToOrder ?? false,
        imageId: hoverImage?.id ?? null,
      })),
    });

    const collection = await prisma.collection.findUnique({ where: { slug: p.category } });
    if (collection) {
      await prisma.collectionProduct.create({
        data: { collectionId: collection.id, productId: product.id, position: index },
      });
    }

    const reviews = REVIEWS[p.slug];
    if (reviews) {
      await prisma.review.createMany({
        data: reviews.map((r) => ({
          productId: product.id,
          rating: r.rating,
          title: r.title,
          content: r.content,
          author: r.author,
          country: r.country,
          verifiedPurchase: true,
        })),
      });
    }
  }

  await prisma.newsletterSubscriber.createMany({
    data: [{ email: "demo@darasala.example", consented: true }],
    skipDuplicates: true,
  });

  // Store settings singleton — seeded once from the values that used to be hardcoded across
  // components (lib/config.ts, lib/content/business-claims.ts, hero/brand-story/etc.). Re-running
  // the seed will NOT overwrite admin edits, since this is an upsert that only creates on first run.
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

  await prisma.testimonial.createMany({
    data: [
      {
        quote:
          "The leather is even richer in person and the stitching is immaculate. This is the kind of bag you buy once and keep for a decade.",
        rating: 5,
        authorName: "Sophie B.",
        country: "France",
        avatarUrl: "/images/avatars/s-b.webp",
        position: 0,
      },
      {
        quote: "Structured but not stiff, and the size is perfect for daily use without ever feeling bulky.",
        rating: 5,
        authorName: "Laura M.",
        country: "Germany",
        avatarUrl: "/images/avatars/l-m.webp",
        position: 1,
      },
      {
        quote: "You can feel that it's handmade — small, honest details you just don't get from mass-produced bags.",
        rating: 5,
        authorName: "Amel K.",
        country: "Belgium",
        avatarUrl: "/images/avatars/a-k.webp",
        position: 2,
      },
      {
        quote: "Fits my laptop and still looks elegant for dinner afterwards. My most-used bag by far.",
        rating: 4,
        authorName: "Nora H.",
        country: "Netherlands",
        avatarUrl: "/images/avatars/n-h.webp",
        position: 3,
      },
      {
        quote: "Ordered a made-to-order piece and the wait was completely worth it. Beautifully packaged too.",
        rating: 5,
        authorName: "Elise R.",
        country: "France",
        avatarUrl: "/images/avatars/e-r.webp",
        position: 4,
      },
    ],
  });

  console.log(`Seeded ${PRODUCTS.length} products across ${COLLECTIONS.length} collections.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

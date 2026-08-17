-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "CustomOrderRequest" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "requestedProductName" TEXT;

-- DataMigration: map old status vocabulary (new/contacted/in_progress/closed) to the
-- new one (new/contacted/quoted/accepted/in_production/completed/rejected).
UPDATE "CustomOrderRequest" SET "status" = 'in_production' WHERE "status" = 'in_progress';
UPDATE "CustomOrderRequest" SET "status" = 'completed' WHERE "status" = 'closed';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "StoreSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "storeName" TEXT NOT NULL DEFAULT 'Dar Asala',
    "contactEmail" TEXT NOT NULL DEFAULT 'hello@darasala.example',
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "businessAddress" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "freeShippingThreshold" DECIMAL(10,2) NOT NULL DEFAULT 250,
    "defaultProductionTime" TEXT NOT NULL DEFAULT 'Made to order — handcrafted in 7-14 business days',
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "tiktokUrl" TEXT,
    "brandOriginCountry" TEXT NOT NULL DEFAULT 'Morocco',
    "brandWorkshopLocations" TEXT NOT NULL DEFAULT 'Marrakech and Fez',
    "leatherClaim" TEXT NOT NULL DEFAULT 'full-grain, vegetable-tanned leather',
    "artisanProcessClaim" TEXT NOT NULL DEFAULT 'hand-cut, hand-stitched and finished by a single artisan from start to finish',
    "productionModelClaim" TEXT NOT NULL DEFAULT 'small-batch, made to order',
    "heroHeadline" TEXT NOT NULL DEFAULT 'Handcrafted in Morocco. Made to last.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Timeless leather bags shaped by our artisans, carried by you.',
    "heroImageUrl" TEXT NOT NULL DEFAULT '/images/hero/hero-main.webp',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'Shop the Collection',
    "heroCtaHref" TEXT NOT NULL DEFAULT '/collections/all',
    "brandStoryHeading" TEXT NOT NULL DEFAULT 'Slow by design.',
    "brandStoryBody" TEXT NOT NULL DEFAULT 'Each Dar Asala piece is shaped by artisans using techniques rooted in Moroccan leather craftsmanship.',
    "brandStoryImageUrl" TEXT NOT NULL DEFAULT '/images/brand/story.webp',
    "customOrderHeading" TEXT NOT NULL DEFAULT 'Made for You',
    "customOrderBody" TEXT NOT NULL DEFAULT 'Choose your leather, color, strap and selected finishing details, and our artisans will hand-build a piece around your choices.',
    "customOrderImageUrl" TEXT NOT NULL DEFAULT '/images/brand/custom-orders.webp',
    "newsletterHeading" TEXT NOT NULL DEFAULT 'Letters from the Atelier',
    "newsletterBody" TEXT NOT NULL DEFAULT 'New pieces, artisan stories and private releases — straight to your inbox, roughly once a month.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingZone" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "countries" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "freeThreshold" DECIMAL(10,2),
    "estimate" TEXT NOT NULL,
    "carrier" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatarUrl" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

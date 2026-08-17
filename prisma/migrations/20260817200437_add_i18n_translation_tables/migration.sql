-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('DE', 'FR');

-- AlterTable
ALTER TABLE "CustomOrderRequest" ADD COLUMN     "locale" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "locale" TEXT;

-- CreateTable
CREATE TABLE "ProductTranslation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "story" TEXT,
    "materials" TEXT NOT NULL,
    "careInstructions" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionTranslation" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreSettingsTranslation" (
    "id" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "heroHeadline" TEXT,
    "heroSubtitle" TEXT,
    "heroCtaLabel" TEXT,
    "brandStoryHeading" TEXT,
    "brandStoryBody" TEXT,
    "customOrderHeading" TEXT,
    "customOrderBody" TEXT,
    "newsletterHeading" TEXT,
    "newsletterBody" TEXT,
    "brandOriginCountry" TEXT,
    "brandWorkshopLocations" TEXT,
    "leatherClaim" TEXT,
    "artisanProcessClaim" TEXT,
    "productionModelClaim" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSettingsTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingZoneTranslation" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "region" TEXT,
    "estimate" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingZoneTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialTranslation" (
    "id" TEXT NOT NULL,
    "testimonialId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "quote" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestimonialTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductTranslation_productId_idx" ON "ProductTranslation"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_locale_key" ON "ProductTranslation"("productId", "locale");

-- CreateIndex
CREATE INDEX "CollectionTranslation_collectionId_idx" ON "CollectionTranslation"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionTranslation_collectionId_locale_key" ON "CollectionTranslation"("collectionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "StoreSettingsTranslation_settingsId_locale_key" ON "StoreSettingsTranslation"("settingsId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingZoneTranslation_zoneId_locale_key" ON "ShippingZoneTranslation"("zoneId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialTranslation_testimonialId_locale_key" ON "TestimonialTranslation"("testimonialId", "locale");

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTranslation" ADD CONSTRAINT "CollectionTranslation_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreSettingsTranslation" ADD CONSTRAINT "StoreSettingsTranslation_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "StoreSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingZoneTranslation" ADD CONSTRAINT "ShippingZoneTranslation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ShippingZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialTranslation" ADD CONSTRAINT "TestimonialTranslation_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "Testimonial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

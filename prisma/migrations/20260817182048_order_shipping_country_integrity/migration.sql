-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCountry" TEXT,
ADD COLUMN     "shippingCountryMismatch" BOOLEAN NOT NULL DEFAULT false;

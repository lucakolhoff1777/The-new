/*
  Warnings:

  - You are about to drop the column `punktwertCent` on the `ServiceCatalogItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "bemaPunktwertCent" DOUBLE PRECISION,
ADD COLUMN     "gozPunktwertCent" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServiceCatalogItem" DROP COLUMN "punktwertCent";

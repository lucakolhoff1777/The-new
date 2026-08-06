-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "insuranceType" TEXT;

-- AlterTable
ALTER TABLE "ReportServiceEntry" ADD COLUMN "begruendung" TEXT;
ALTER TABLE "ReportServiceEntry" ADD COLUMN "faktor" REAL;

-- AlterTable
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "ausschlussMit" TEXT;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "begruendungspflichtAbFaktor" REAL;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "faktorMax" REAL;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "faktorMin" REAL;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "festbetragCent" INTEGER;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "frequenzlimitAnzahl" INTEGER;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "frequenzlimitZeitraumTage" INTEGER;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "gueltigAb" DATETIME;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "gueltigBis" DATETIME;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "punktwertCent" INTEGER;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "punktzahl" REAL;
ALTER TABLE "ServiceCatalogItem" ADD COLUMN "regelhoechstfaktor" REAL;

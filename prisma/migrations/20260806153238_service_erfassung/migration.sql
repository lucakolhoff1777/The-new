/*
  Warnings:

  - You are about to drop the column `bulletPoints` on the `Report` table. All the data in the column will be lost.
  - Added the required column `serviceSummary` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ServiceCatalogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT,
    "system" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceCatalogItem_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceTemplate_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceTemplateItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ServiceTemplateItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ServiceTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServiceTemplateItem_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "ServiceCatalogItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportServiceEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "performed" BOOLEAN NOT NULL DEFAULT true,
    "toothNumbers" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "note" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ReportServiceEntry_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReportServiceEntry_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "ServiceCatalogItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENTWURF',
    "treatmentDate" DATETIME,
    "serviceTemplateId" TEXT,
    "serviceSummary" TEXT NOT NULL,
    "reviewConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "additionalContext" TEXT,
    "generatedText" TEXT,
    "editedText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_serviceTemplateId_fkey" FOREIGN KEY ("serviceTemplateId") REFERENCES "ServiceTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("additionalContext", "authorId", "createdAt", "editedText", "generatedText", "id", "patientId", "practiceId", "status", "treatmentDate", "type", "updatedAt") SELECT "additionalContext", "authorId", "createdAt", "editedText", "generatedText", "id", "patientId", "practiceId", "status", "treatmentDate", "type", "updatedAt" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_practiceId_idx" ON "Report"("practiceId");
CREATE INDEX "Report_patientId_idx" ON "Report"("patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ServiceCatalogItem_practiceId_idx" ON "ServiceCatalogItem"("practiceId");

-- CreateIndex
CREATE INDEX "ServiceTemplate_practiceId_idx" ON "ServiceTemplate"("practiceId");

-- CreateIndex
CREATE INDEX "ServiceTemplateItem_templateId_idx" ON "ServiceTemplateItem"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTemplateItem_templateId_catalogItemId_key" ON "ServiceTemplateItem"("templateId", "catalogItemId");

-- CreateIndex
CREATE INDEX "ReportServiceEntry_reportId_idx" ON "ReportServiceEntry"("reportId");

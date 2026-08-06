-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceCatalogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT,
    "system" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "toothRelevant" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceCatalogItem_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ServiceCatalogItem" ("category", "code", "createdAt", "description", "id", "practiceId", "system", "title") SELECT "category", "code", "createdAt", "description", "id", "practiceId", "system", "title" FROM "ServiceCatalogItem";
DROP TABLE "ServiceCatalogItem";
ALTER TABLE "new_ServiceCatalogItem" RENAME TO "ServiceCatalogItem";
CREATE INDEX "ServiceCatalogItem_practiceId_idx" ON "ServiceCatalogItem"("practiceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

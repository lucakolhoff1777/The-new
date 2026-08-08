-- CreateTable
CREATE TABLE "ApiClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "apiKeyHash" TEXT NOT NULL,
    "apiKeyPrefix" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiClient_apiKeyHash_key" ON "ApiClient"("apiKeyHash");

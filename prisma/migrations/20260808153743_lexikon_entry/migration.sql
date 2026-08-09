-- CreateTable
CREATE TABLE "LexikonEntry" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gkvEinordnung" TEXT NOT NULL,
    "selbstzahlerOption" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LexikonEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LexikonEntry_category_idx" ON "LexikonEntry"("category");

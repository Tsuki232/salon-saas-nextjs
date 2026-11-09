-- CreateTable
CREATE TABLE "BillingPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'NEQUI',
    "reference" TEXT,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BillingPayment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "openHour" TEXT NOT NULL DEFAULT '08:00',
    "closeHour" TEXT NOT NULL DEFAULT '19:00',
    "currency" TEXT NOT NULL DEFAULT 'COP',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "themeName" TEXT NOT NULL DEFAULT 'violeta',
    "customPrimary" TEXT,
    "customSecondary" TEXT,
    "logoUrl" TEXT,
    "planId" TEXT NOT NULL DEFAULT 'BASICO',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'PRUEBA',
    "paidUntil" DATETIME,
    "monthlyPrice" REAL
);
INSERT INTO "new_Business" ("address", "closeHour", "createdAt", "currency", "customPrimary", "customSecondary", "id", "logoUrl", "name", "openHour", "phone", "slug", "themeName") SELECT "address", "closeHour", "createdAt", "currency", "customPrimary", "customSecondary", "id", "logoUrl", "name", "openHour", "phone", "slug", "themeName" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "BillingPayment_businessId_idx" ON "BillingPayment"("businessId");

-- CreateIndex
CREATE INDEX "BillingPayment_createdAt_idx" ON "BillingPayment"("createdAt");

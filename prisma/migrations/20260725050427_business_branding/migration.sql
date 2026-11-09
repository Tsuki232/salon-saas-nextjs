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
    "logoUrl" TEXT
);
INSERT INTO "new_Business" ("address", "closeHour", "createdAt", "currency", "id", "name", "openHour", "phone", "slug") SELECT "address", "closeHour", "createdAt", "currency", "id", "name", "openHour", "phone", "slug" FROM "Business";
DROP TABLE "Business";
ALTER TABLE "new_Business" RENAME TO "Business";
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

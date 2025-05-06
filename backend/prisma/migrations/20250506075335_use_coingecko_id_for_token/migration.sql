/*
  Warnings:

  - You are about to drop the column `frequency` on the `DataPoint` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DataPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "priceUSD" REAL NOT NULL,
    CONSTRAINT "DataPoint_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DataPoint" ("date", "id", "priceUSD", "tokenId") SELECT "date", "id", "priceUSD", "tokenId" FROM "DataPoint";
DROP TABLE "DataPoint";
ALTER TABLE "new_DataPoint" RENAME TO "DataPoint";
CREATE INDEX "DataPoint_tokenId_date_idx" ON "DataPoint"("tokenId", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

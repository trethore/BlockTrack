-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false
);

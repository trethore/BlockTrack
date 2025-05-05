-- CreateTable
CREATE TABLE "Token" (
    "tokenId" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "priceUSD" REAL NOT NULL,
    "marketCapUsd" REAL,
    "volume24hUsd" REAL,
    "circulatingSupply" BIGINT,
    "totalSupply" BIGINT,
    "maxSupply" BIGINT,
    "percentChange1h" REAL,
    "percentChange24h" REAL,
    "percentChange7d" REAL,
    "percentChange30d" REAL,
    "percentChange1y" REAL,
    "marketCapChange24h" REAL,
    "lastUpdated" DATETIME
);

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "tokenId"),
    CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "priceUSD" REAL NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'DAILY',
    CONSTRAINT "DataPoint_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("tokenId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TokenUpdateLog" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'SINGLETON',
    "lastRefreshedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_symbol_key" ON "Token"("symbol");

-- CreateIndex
CREATE INDEX "Token_rank_idx" ON "Token"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_tokenId_idx" ON "Favorite"("tokenId");

-- CreateIndex
CREATE INDEX "DataPoint_tokenId_date_idx" ON "DataPoint"("tokenId", "date");

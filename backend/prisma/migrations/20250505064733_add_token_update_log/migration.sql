-- CreateTable
CREATE TABLE "TokenUpdateLog" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'SINGLETON',
    "lastRefreshedAt" DATETIME
);

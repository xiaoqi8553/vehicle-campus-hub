-- AlterTable
ALTER TABLE "Company" ADD COLUMN "recruitmentWebsite" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetYear" INTEGER,
    "sourceYear" INTEGER,
    "url" TEXT,
    "sourceUrl" TEXT,
    "source" TEXT NOT NULL,
    "sourceType" TEXT,
    "verifiedAt" DATETIME,
    "dateConfidence" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "changeSummary" TEXT,
    "summary" TEXT NOT NULL,
    "credibility" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "lastVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("changeSummary", "companyId", "createdAt", "credibility", "dateConfidence", "id", "lastVerifiedAt", "source", "sourceType", "sourceUrl", "sourceYear", "summary", "tags", "targetYear", "title", "type", "updatedAt", "url", "verifiedAt") SELECT "changeSummary", "companyId", "createdAt", "credibility", "dateConfidence", "id", "lastVerifiedAt", "source", "sourceType", "sourceUrl", "sourceYear", "summary", "tags", "targetYear", "title", "type", "updatedAt", "url", "verifiedAt" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
CREATE INDEX "Resource_companyId_idx" ON "Resource"("companyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

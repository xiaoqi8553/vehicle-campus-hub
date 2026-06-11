-- CreateTable
CREATE TABLE "CompanyLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "finalUrl" TEXT,
    "sourceType" TEXT NOT NULL,
    "targetCohort" TEXT NOT NULL,
    "verifiedAt" DATETIME,
    "healthStatus" TEXT NOT NULL,
    "evidenceSummary" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "httpStatus" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CompanyLink_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recruitment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "targetYear" INTEGER,
    "season" TEXT NOT NULL,
    "batch" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "applyUrl" TEXT,
    "process" TEXT NOT NULL,
    "note" TEXT,
    "notes" TEXT,
    "sourceUrl" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "verifiedAt" DATETIME,
    "dateConfidence" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "changeSummary" TEXT,
    "credibility" TEXT NOT NULL,
    "sourceLinkId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recruitment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Recruitment_sourceLinkId_fkey" FOREIGN KEY ("sourceLinkId") REFERENCES "CompanyLink" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Recruitment" ("applyUrl", "batch", "changeSummary", "companyId", "createdAt", "credibility", "dateConfidence", "endDate", "id", "note", "notes", "process", "season", "sourceType", "sourceUrl", "startDate", "status", "targetYear", "title", "updatedAt", "verifiedAt", "year") SELECT "applyUrl", "batch", "changeSummary", "companyId", "createdAt", "credibility", "dateConfidence", "endDate", "id", "note", "notes", "process", "season", "sourceType", "sourceUrl", "startDate", "status", "targetYear", "title", "updatedAt", "verifiedAt", "year" FROM "Recruitment";
DROP TABLE "Recruitment";
ALTER TABLE "new_Recruitment" RENAME TO "Recruitment";
CREATE INDEX "Recruitment_companyId_idx" ON "Recruitment"("companyId");
CREATE INDEX "Recruitment_sourceLinkId_idx" ON "Recruitment"("sourceLinkId");
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
    "content" TEXT NOT NULL DEFAULT '[]',
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

-- CreateIndex
CREATE INDEX "CompanyLink_companyId_idx" ON "CompanyLink"("companyId");

-- CreateIndex
CREATE INDEX "CompanyLink_healthStatus_idx" ON "CompanyLink"("healthStatus");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyLink_companyId_url_key" ON "CompanyLink"("companyId", "url");

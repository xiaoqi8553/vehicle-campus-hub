-- AlterTable
ALTER TABLE "Recruitment" ADD COLUMN "batch" TEXT;
ALTER TABLE "Recruitment" ADD COLUMN "notes" TEXT;
ALTER TABLE "Recruitment" ADD COLUMN "sourceType" TEXT;
ALTER TABLE "Recruitment" ADD COLUMN "targetYear" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CalendarEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "recruitmentId" TEXT,
    "programId" TEXT,
    "title" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "credibility" TEXT NOT NULL DEFAULT '待核实',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CalendarEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CalendarEvent_recruitmentId_fkey" FOREIGN KEY ("recruitmentId") REFERENCES "Recruitment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CalendarEvent" ("companyId", "createdAt", "eventDate", "eventType", "id", "recruitmentId", "status", "title", "updatedAt") SELECT "companyId", "createdAt", "eventDate", "eventType", "id", "recruitmentId", "status", "title", "updatedAt" FROM "CalendarEvent";
DROP TABLE "CalendarEvent";
ALTER TABLE "new_CalendarEvent" RENAME TO "CalendarEvent";
CREATE INDEX "CalendarEvent_companyId_idx" ON "CalendarEvent"("companyId");
CREATE INDEX "CalendarEvent_recruitmentId_idx" ON "CalendarEvent"("recruitmentId");
CREATE INDEX "CalendarEvent_eventDate_idx" ON "CalendarEvent"("eventDate");
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "type" TEXT,
    "logo" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "officialWebsite" TEXT,
    "campusRecruitmentWebsite" TEXT,
    "campusUrl" TEXT,
    "cities" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "vehicleDirections" TEXT NOT NULL DEFAULT '[]',
    "fitDirections" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT '待确认',
    "dataStatus" TEXT NOT NULL DEFAULT '待核实',
    "lastVerifiedAt" DATETIME,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Company" ("campusUrl", "category", "cities", "createdAt", "description", "fitDirections", "id", "lastUpdatedAt", "logo", "name", "officialWebsite", "status", "tags", "updatedAt") SELECT "campusUrl", "category", "cities", "createdAt", "description", "fitDirections", "id", "lastUpdatedAt", "logo", "name", "officialWebsite", "status", "tags", "updatedAt" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "recruitmentId" TEXT,
    "programId" TEXT,
    "title" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "majorRequirement" TEXT NOT NULL,
    "majors" TEXT NOT NULL DEFAULT '[]',
    "skills" TEXT NOT NULL DEFAULT '[]',
    "applyUrl" TEXT,
    "vehicleFitScore" INTEGER NOT NULL,
    "matchScore" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Job_recruitmentId_fkey" FOREIGN KEY ("recruitmentId") REFERENCES "Recruitment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("applyUrl", "city", "companyId", "createdAt", "direction", "education", "id", "majorRequirement", "recruitmentId", "title", "updatedAt", "vehicleFitScore") SELECT "applyUrl", "city", "companyId", "createdAt", "direction", "education", "id", "majorRequirement", "recruitmentId", "title", "updatedAt", "vehicleFitScore" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE INDEX "Job_companyId_idx" ON "Job"("companyId");
CREATE INDEX "Job_recruitmentId_idx" ON "Job"("recruitmentId");
CREATE TABLE "new_Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetYear" INTEGER,
    "sourceYear" INTEGER,
    "url" TEXT,
    "sourceUrl" TEXT,
    "source" TEXT NOT NULL,
    "sourceType" TEXT,
    "summary" TEXT NOT NULL,
    "credibility" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "lastVerifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resource_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Resource" ("companyId", "createdAt", "credibility", "id", "source", "summary", "title", "type", "updatedAt", "url") SELECT "companyId", "createdAt", "credibility", "id", "source", "summary", "title", "type", "updatedAt", "url" FROM "Resource";
DROP TABLE "Resource";
ALTER TABLE "new_Resource" RENAME TO "Resource";
CREATE INDEX "Resource_companyId_idx" ON "Resource"("companyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

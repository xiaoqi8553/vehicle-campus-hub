import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

type Row = Record<string, unknown>;

const sourcePath = resolve(process.env.SQLITE_SOURCE ?? "prisma/dev.db");
const snapshotPath = resolve(
  process.env.MIGRATION_SNAPSHOT_PATH ?? "tmp/sqlite-migration-snapshot.json",
);
const targetUrl = process.env.DATABASE_URL ?? "";

if (!existsSync(sourcePath)) throw new Error(`SQLite source not found: ${sourcePath}`);
if (!targetUrl.startsWith("postgresql://") && !targetUrl.startsWith("postgres://")) {
  throw new Error("DATABASE_URL must point to PostgreSQL before running the migration.");
}

const source = new DatabaseSync(sourcePath, { readOnly: true });
const target = new PrismaClient();
const tableNames = [
  "Company",
  "CompanyLink",
  "Recruitment",
  "Job",
  "Resource",
  "User",
  "Favorite",
  "CalendarEvent",
] as const;

const dateFields = new Set([
  "verifiedAt",
  "lastVerifiedAt",
  "lastUpdatedAt",
  "startDate",
  "endDate",
  "eventDate",
  "createdAt",
  "updatedAt",
]);

function readTable(table: (typeof tableNames)[number]) {
  return source.prepare(`SELECT * FROM "${table}"`).all() as Row[];
}

function normalizeRows(rows: Row[]) {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => {
        if (dateFields.has(key) && value !== null) return [key, new Date(value as string | number)];
        if (key === "isPrimary") return [key, Boolean(value)];
        return [key, value];
      }),
    ),
  );
}

async function targetCounts() {
  return {
    Company: await target.company.count(),
    CompanyLink: await target.companyLink.count(),
    Recruitment: await target.recruitment.count(),
    Job: await target.job.count(),
    Resource: await target.resource.count(),
    User: await target.user.count(),
    Favorite: await target.favorite.count(),
    CalendarEvent: await target.calendarEvent.count(),
  };
}

async function main() {
  const raw = Object.fromEntries(tableNames.map((table) => [table, readTable(table)]));
  const sourceCounts = Object.fromEntries(
    tableNames.map((table) => [table, (raw[table] as Row[]).length]),
  );
  const snapshot = JSON.stringify(
    {
      createdAt: new Date().toISOString(),
      sourcePath,
      sourceCounts,
      data: raw,
    },
    null,
    2,
  );
  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, snapshot, "utf8");
  const snapshotSha256 = createHash("sha256").update(snapshot).digest("hex");

  const before = await targetCounts();
  const occupied = Object.entries(before).filter(([, count]) => count > 0);
  const replaceTarget = process.env.MIGRATION_REPLACE_TARGET === "true";
  if (occupied.length > 0 && !replaceTarget) {
    throw new Error(
      `PostgreSQL target is not empty (${occupied.map(([name, count]) => `${name}=${count}`).join(", ")}). ` +
        "Use a new database or explicitly set MIGRATION_REPLACE_TARGET=true.",
    );
  }

  await target.$transaction(
    async (tx) => {
      if (replaceTarget) {
        await tx.favorite.deleteMany();
        await tx.calendarEvent.deleteMany();
        await tx.job.deleteMany();
        await tx.resource.deleteMany();
        await tx.recruitment.deleteMany();
        await tx.companyLink.deleteMany();
        await tx.user.deleteMany();
        await tx.company.deleteMany();
      }

      await tx.company.createMany({ data: normalizeRows(raw.Company as Row[]) as never });
      await tx.companyLink.createMany({ data: normalizeRows(raw.CompanyLink as Row[]) as never });
      await tx.recruitment.createMany({ data: normalizeRows(raw.Recruitment as Row[]) as never });
      await tx.job.createMany({ data: normalizeRows(raw.Job as Row[]) as never });
      await tx.resource.createMany({ data: normalizeRows(raw.Resource as Row[]) as never });
      await tx.user.createMany({ data: normalizeRows(raw.User as Row[]) as never });
      await tx.favorite.createMany({ data: normalizeRows(raw.Favorite as Row[]) as never });
      await tx.calendarEvent.createMany({
        data: normalizeRows(raw.CalendarEvent as Row[]) as never,
      });
    },
    { maxWait: 10_000, timeout: 60_000 },
  );

  const after = await targetCounts();
  const mismatches = tableNames.filter((table) => after[table] !== sourceCounts[table]);
  if (mismatches.length > 0) {
    throw new Error(
      `Migration count mismatch: ${mismatches
        .map((table) => `${table} source=${sourceCounts[table]} target=${after[table]}`)
        .join(", ")}`,
    );
  }

  console.log(
    JSON.stringify({ sourceCounts, targetCounts: after, snapshotPath, snapshotSha256 }, null, 2),
  );
}

main()
  .finally(async () => {
    source.close();
    await target.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

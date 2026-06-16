import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { chromium } from "@playwright/test";

type Company = { id: string; slug?: string | null; name: string };
type AuditResult = {
  company: string;
  sourcePage: string;
  title: string;
  url: string;
  finalUrl?: string;
  status?: number;
  outcome: "reachable" | "redirected" | "blocked" | "failed";
  error?: string;
};

const baseUrl = (process.env.AUDIT_BASE_URL ?? "https://vehicle-campus-hub.vercel.app").replace(
  /\/$/,
  "",
);
const outputPath = resolve(process.env.AUDIT_OUTPUT ?? "tmp/production-link-health.json");

async function main() {
  const browser = await chromium.launch({ channel: "chromium" });

  try {
    const companiesResponse = await fetch(`${baseUrl}/api/companies`, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!companiesResponse.ok) {
      throw new Error(`Unable to load companies: HTTP ${companiesResponse.status}`);
    }
    const companies = ((await companiesResponse.json()) as { data: Company[] }).data;
    const entries: Array<Omit<AuditResult, "outcome">> = [];
    const discoveryPage = await browser.newPage();

    try {
      for (const company of companies) {
        const sourcePage = `${baseUrl}/companies/${company.slug ?? company.id}`;
        const response = await discoveryPage.goto(sourcePage, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
        if (!response?.ok()) {
          throw new Error(`Unable to inspect ${sourcePage}: HTTP ${response?.status()}`);
        }

        const links = await discoveryPage.locator('a[href^="http"]').evaluateAll((anchors) =>
          anchors.map((anchor) => ({
            title: (anchor.textContent ?? "").trim(),
            url: (anchor as HTMLAnchorElement).href,
          })),
        );
        for (const link of links) {
          if (new URL(link.url).origin === new URL(baseUrl).origin) continue;
          entries.push({ company: company.name, sourcePage, ...link });
        }
      }
    } finally {
      await discoveryPage.close();
    }

    const uniqueEntries = [
      ...new Map(entries.map((entry) => [`${entry.company}:${entry.url}`, entry])).values(),
    ];
    const queue = [...uniqueEntries];
    const results: AuditResult[] = [];

    async function worker() {
      const page = await browser.newPage();
      try {
        while (queue.length > 0) {
          const entry = queue.shift();
          if (!entry) break;
          try {
            const response = await page.goto(entry.url, {
              waitUntil: "domcontentloaded",
              timeout: 25_000,
            });
            const status = response?.status();
            const finalUrl = page.url();
            results.push({
              ...entry,
              finalUrl,
              status,
              outcome:
                status === 401 || status === 403 || status === 429
                  ? "blocked"
                  : finalUrl !== entry.url
                    ? "redirected"
                    : status && status < 400
                      ? "reachable"
                      : "failed",
            });
          } catch (error) {
            results.push({
              ...entry,
              outcome: "failed",
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      } finally {
        await page.close();
      }
    }

    await Promise.all(Array.from({ length: Math.min(6, queue.length) }, () => worker()));

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      companyCount: companies.length,
      linkCount: results.length,
      summary: Object.fromEntries(
        ["reachable", "redirected", "blocked", "failed"].map((outcome) => [
          outcome,
          results.filter((result) => result.outcome === outcome).length,
        ]),
      ),
      results: results.sort((a, b) => a.company.localeCompare(b.company, "zh-CN")),
    };
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf8");
    console.log(JSON.stringify({ outputPath, ...report, results: undefined }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

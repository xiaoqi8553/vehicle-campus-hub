import { chromium, type ConsoleMessage } from "@playwright/test";

const baseUrl = (process.env.SMOKE_BASE_URL ?? process.argv[2] ?? "").replace(/\/$/, "");
const expectedCommit = process.env.EXPECTED_COMMIT;
if (!baseUrl)
  throw new Error("Provide SMOKE_BASE_URL or pass the production URL as the first argument.");

const routes = ["/", "/companies", "/companies/xiaomi-auto", "/calendar", "/resources", "/about"];
const browser = await chromium.launch({ channel: "chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors: string[] = [];
const failures: string[] = [];

page.on("console", (message: ConsoleMessage) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("requestfailed", (request) => {
  const failure = request.failure()?.errorText ?? "";
  if (!failure.includes("ERR_ABORTED"))
    failures.push(`${request.method()} ${request.url()}: ${failure}`);
});

const results = [];
for (const route of routes) {
  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  const status = response?.status() ?? 0;
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  const invalidLinks = await page
    .locator('a[href=""], a[href="#"], a[href*="example.com"]')
    .count();
  if (status >= 400 || overflow || invalidLinks > 0) {
    throw new Error(
      `${route} failed: status=${status}, overflow=${overflow}, invalidLinks=${invalidLinks}`,
    );
  }
  results.push({ route, status, overflow, invalidLinks });
}

const healthResponse = await page.request.get(`${baseUrl}/api/health`);
if (!healthResponse.ok()) throw new Error(`/api/health returned ${healthResponse.status()}`);
const health = (await healthResponse.json()) as { commit?: string };
if (
  expectedCommit &&
  health.commit &&
  health.commit !== "local" &&
  !health.commit.startsWith(expectedCommit) &&
  !expectedCommit.startsWith(health.commit)
) {
  throw new Error(`Production commit ${health.commit} does not match expected ${expectedCommit}`);
}

const adminStatus = await page.evaluate(
  async () => (await fetch("/admin", { redirect: "manual" })).status,
);
if (adminStatus !== 404) throw new Error(`/admin expected 404, received ${adminStatus}`);
if (errors.length > 0 || failures.length > 0) {
  throw new Error(`Browser errors detected:\n${[...errors, ...failures].join("\n")}`);
}

console.log(JSON.stringify({ baseUrl, health, adminStatus, results }, null, 2));
await browser.close();

import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", name: "home" },
  { path: "/companies", name: "companies" },
  { path: "/companies/xiaomi-auto", name: "company-detail" },
  { path: "/calendar", name: "calendar" },
  { path: "/resources", name: "resources" },
  { path: "/admin", name: "admin" },
];

for (const target of pages) {
  test(`${target.name} has no horizontal overflow and captures visual evidence`, async ({
    page,
  }, testInfo) => {
    await page.goto(target.path);
    await page.waitForLoadState("networkidle");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    await page.screenshot({
      path: testInfo.outputPath(`${target.name}-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });
}

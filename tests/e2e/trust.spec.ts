import { expect, test } from "@playwright/test";
import { groupCalendarEvents } from "../../lib/domain";

test("homepage limits repeated company lists and preserves filters in the full-list link", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByTestId("featured-companies").getByTestId("company-card")).toHaveCount(6);
  const explorer = page.getByTestId("company-explorer");
  expect(await explorer.getByTestId("company-card").count()).toBeLessThanOrEqual(6);

  await page.getByRole("textbox", { name: "搜索公司" }).fill("上海");
  const fullListLink = explorer.getByRole("link", { name: /查看全部 \d+ 家企业/ });
  await expect(fullListLink).toHaveAttribute("href", /\/companies\?q=%E4%B8%8A%E6%B5%B7/);
  await fullListLink.click();
  await expect(page).toHaveURL(/\/companies\?q=%E4%B8%8A%E6%B5%B7/);
  await expect(page.getByRole("textbox", { name: "搜索公司" })).toHaveValue("上海");
});

test("latest updates explain what changed", async ({ page }) => {
  await page.goto("/");
  const updates = page.getByTestId("latest-update");
  await expect(updates).toHaveCount(5);
  for (const update of await updates.all()) {
    await expect(update.getByTestId("change-summary")).not.toHaveText("");
  }
});

test("calendar renders each event once and hides unverified exact dates", async ({
  page,
}) => {
  await page.goto("/calendar");
  const events = page.getByTestId("calendar-event");
  const ids = await events.evaluateAll((items) =>
    items.map((item) => item.getAttribute("data-calendar-event-id")),
  );
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);

  const pending = page.getByTestId("calendar-pending");
  await expect(pending).toContainText("日期待确认");
  await expect(pending.locator("time")).toHaveCount(0);
  const withoutSource = pending.locator('[data-has-source="false"]').first();
  await expect(withoutSource).toBeVisible();
  await expect(withoutSource.getByRole("link", { name: "来源链接" })).toHaveCount(0);
});

test("verified calendar grouping logic is covered without publishing fabricated production dates", () => {
  const groups = groupCalendarEvents([
    {
      id: "playwright-verified",
      company: { id: "fixture-company", name: "测试企业" },
      eventType: "网申截止",
      eventDate: "2026-06-20T00:00:00.000Z",
      sourceUrl: "https://careers.example.org/campus",
      sourceType: "OFFICIAL",
      verifiedAt: "2026-06-10T00:00:00.000Z",
      dateConfidence: "VERIFIED",
    },
  ], new Date("2026-06-10T00:00:00.000Z"));

  expect(groups.sevenDays).toHaveLength(0);
  expect(groups.thirtyDays.map((item) => item.id)).toEqual(["playwright-verified"]);
});

test("job relevance is explained without exact probability-like scores", async ({ page }) => {
  await page.goto("/companies/xiaomi-auto");
  await expect(page.getByText("车辆方向相关度参考", { exact: true })).toBeVisible();
  await expect(page.getByText("仅为平台规则参考，不代表录用概率")).toBeVisible();
  const relevanceLabels = await page.locator(".job-score strong").allTextContents();
  expect(relevanceLabels.every((label) => !/^\d+$/.test(label))).toBe(true);
});

test("company filters have accessible names", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("textbox", { name: "搜索公司" })).toBeVisible();
  for (const name of [
    "公司类型",
    "校招状态",
    "岗位方向",
    "城市",
    "可信度",
    "是否有官方投递链接",
    "排序方式",
  ]) {
    await expect(page.getByRole("combobox", { name })).toBeVisible();
  }
});

test("required viewports have no horizontal overflow and mobile actions meet touch targets", async ({
  browser,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "The test creates all required viewports itself.");
  test.setTimeout(120_000);
  const viewports = [
    { name: "iPhone SE", width: 375, height: 667 },
    { name: "iPhone 14", width: 390, height: 844 },
    { name: "iPad", width: 820, height: 1180 },
    { name: "Desktop 1440", width: 1440, height: 1000 },
  ];
  const routes = ["/", "/companies", "/companies/xiaomi-auto", "/calendar", "/resources"];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.content,
        `${viewport.name} ${route} should not overflow horizontally`,
      ).toBeLessThanOrEqual(dimensions.viewport + 1);
    }

    if (viewport.width <= 390) {
      await page.goto("/");
      const actions = page.locator(".focus-card a, .button, .result-bar button");
      const heights = await actions.evaluateAll((items) =>
        items
          .map((item) => item.getBoundingClientRect())
          .filter((rect) => rect.width > 0 && rect.height > 0)
          .map((rect) => rect.height),
      );
      for (const height of heights) {
        expect(height).toBeGreaterThanOrEqual(44);
      }
    }
    await context.close();
  }
});

test("main pages have no hydration, page, console or failed-request errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    if (request.failure()?.errorText !== "net::ERR_ABORTED") {
      errors.push(`request: ${request.url()} ${request.failure()?.errorText}`);
    }
  });

  for (const route of ["/", "/companies", "/companies/xiaomi-auto", "/calendar", "/resources"]) {
    await page.goto(route, { waitUntil: "networkidle" });
  }
  expect(errors).toEqual([]);
});

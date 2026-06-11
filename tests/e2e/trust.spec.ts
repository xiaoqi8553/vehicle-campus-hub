import { expect, test } from "@playwright/test";

test("home search is capped and preserves filters", async ({ page }) => {
  await page.goto("/");
  const explorer = page.getByTestId("company-explorer");
  expect(await explorer.getByTestId("company-row").count()).toBeLessThanOrEqual(8);
  await page.getByRole("textbox", { name: "搜索公司" }).fill("上海");
  const allLink = explorer.getByRole("link", { name: /查看全部 \d+ 家企业/ });
  await expect(allLink).toHaveAttribute("href", /\/companies\?q=%E4%B8%8A%E6%B5%B7/);
});

test("calendar publishes no precise dates without verified evidence", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: "2027届车辆行业校招日历" })).toBeVisible();
  await expect(page.getByText("暂无已核验招聘日程")).toBeVisible();
  await expect(page.getByTestId("calendar-event")).toHaveCount(0);
  await expect(page.getByTestId("watchlist-row")).toHaveCount(25);
  await expect(page.getByTestId("watchlist-row").first()).toContainText("日期待官方发布");
  await expect(page.getByTestId("watchlist-row").locator("time")).toHaveCount(0);
});

test("company detail separates official jobs from direction reference", async ({ page }) => {
  await page.goto("/companies/xiaomi-auto");
  await expect(page.getByText("官方招聘信息")).toBeVisible();
  await expect(page.getByText("岗位方向参考")).toBeVisible();
  await expect(page.getByText("当前没有已核验的具体岗位")).toBeVisible();
  await expect(page.getByRole("link", { name: "岗位投递" })).toHaveCount(0);
  await expect(page.getByText(/仅用于确定准备方向，不代表企业当前正在招聘/)).toBeVisible();
});

test("main pages have one h1, no fake links, errors or horizontal overflow", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "viewport matrix runs once");
  test.setTimeout(120_000);
  const viewports = [
    { name: "iPhone SE", width: 375, height: 667 },
    { name: "iPhone 14", width: 390, height: 844 },
    { name: "iPad", width: 820, height: 1180 },
    { name: "Desktop", width: 1440, height: 1000 },
  ];
  const routes = ["/", "/companies", "/companies/xiaomi-auto", "/calendar", "/resources", "/about"];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content, `${viewport.name} ${route}`).toBeLessThanOrEqual(dimensions.viewport + 1);
      await expect(page.locator('a[href*="example.com"], a[href="#"], a[href=""]')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
    await context.close();
  }
});

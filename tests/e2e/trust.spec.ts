import { expect, test } from "@playwright/test";

test("home search is capped and preserves filters", async ({ page }, testInfo) => {
  await page.goto("/");
  const explorer = page.getByTestId("company-explorer");
  await expect(explorer.getByTestId("company-row")).toHaveCount(
    testInfo.project.name === "mobile" ? 3 : 6,
  );
  await page.getByRole("searchbox", { name: "搜索公司、城市或车辆方向" }).fill("上海");
  const allLink = explorer.getByRole("link", { name: /查看全部 \d+ 家企业/ });
  await expect(allLink).toHaveAttribute("href", /\/companies\?q=%E4%B8%8A%E6%B5%B7/);
});

test("calendar publishes no precise dates without verified evidence", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: "2027届车辆行业校招日历" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "已开放但未公布截止日期" })).toBeVisible();
  await expect(page.getByTestId("calendar-event")).toHaveCount(0);
  await expect(page.getByTestId("open-undated-row")).toHaveCount(3);
  await expect(page.getByTestId("watchlist-row")).toHaveCount(22);
  await expect(page.locator("time")).toHaveCount(0);
  await expect(page.locator('a[href*="/campus/0"]')).toHaveCount(0);
});

test("company detail separates official jobs from direction reference", async ({ page }) => {
  await page.goto("/companies/xiaomi-auto");
  await expect(page.getByText("2027 届项目判断")).toBeVisible();
  await expect(page.getByText("岗位方向参考")).toBeVisible();
  await expect(page.getByText(/平台不展示无法解释的精确匹配分数/)).toBeVisible();
  await expect(page.locator('a[href*="/campus/0"]')).toHaveCount(0);
});

test("main pages have one h1, no fake links, errors or horizontal overflow", async ({
  browser,
}, testInfo) => {
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
    const failedRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      if (
        request.resourceType() === "document" ||
        request.resourceType() === "script" ||
        request.resourceType() === "stylesheet"
      ) {
        failedRequests.push(`${request.method()} ${request.url()}`);
      }
    });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content, `${viewport.name} ${route}`).toBeLessThanOrEqual(
        dimensions.viewport + 1,
      );
      await expect(page.locator('a[href*="example.com"], a[href="#"], a[href=""]')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
    expect(failedRequests).toEqual([]);
    await context.close();
  }
});

test("mobile primary controls provide a 44px interaction target", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "viewport check runs once");
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  await page.goto("/");
  const controls = page.locator(
    "a.button:visible, button:visible, input:visible, select:visible, summary:visible",
  );
  const boxes = await controls.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        label: element.getAttribute("aria-label") || element.textContent?.trim(),
        height: rect.height,
      };
    }),
  );
  expect(boxes.filter((box) => box.height < 43).map((box) => box.label)).toEqual([]);
  await context.close();
});

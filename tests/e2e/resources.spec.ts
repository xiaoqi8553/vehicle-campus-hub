import { expect, test } from "@playwright/test";

test.describe("resources page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resources");
    await expect(page.getByRole("heading", { name: "2027届车辆行业笔试面经资料库" })).toBeVisible();
  });

  test("opens with resource cards, statistics and no residual loading state", async ({
    page,
  }) => {
    expect(await page.getByTestId("resource-card").count()).toBeGreaterThan(0);
    await expect(page.getByTestId("resource-stats")).toBeVisible();
    await expect(page.getByText("2027届资料库仍在补链接，具体以企业官方信息为准")).toBeVisible();
    await expect(page.getByText("正在加载校招数据...")).toHaveCount(0);
  });

  test("company, type and credibility filters change the results", async ({
    page,
  }) => {
    const cards = page.getByTestId("resource-card");
    const initialCount = await cards.count();

    await page.getByLabel("公司").selectOption("xiaomi-auto");
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toContainText("小米汽车");

    await page.getByLabel("资料类型").selectOption("面经");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("面经");

    await page.getByLabel("可信度").selectOption("经验参考");
    await expect(cards).toHaveCount(1);
    expect(await cards.count()).toBeLessThan(initialCount);
  });

  test("searching Xiaomi shows Xiaomi Auto resources", async ({ page }) => {
    await page.getByPlaceholder("搜索资料关键词").fill("小米");
    const cards = page.getByTestId("resource-card");
    await expect(cards).toHaveCount(2);
    await expect(cards.first()).toContainText("小米汽车");
  });

  test("official shortcut and recent sorting are available", async ({ page }) => {
    await page.getByRole("button", { name: "只看官方资料" }).click();
    const cards = page.getByTestId("resource-card");
    expect(await cards.count()).toBeGreaterThan(0);
    await expect(cards.first()).toContainText("官方");
    await expect(page.getByLabel("排序方式")).toHaveValue("recent");
  });

  test("combined filters show a clear empty state", async ({ page }) => {
    await page.getByLabel("公司").selectOption("xiaomi-auto");
    await page.getByLabel("资料类型").selectOption("面经");
    await page.getByLabel("可信度").selectOption("官方");
    await expect(page.getByTestId("resource-card")).toHaveCount(0);
    await expect(page.getByText("暂无匹配资料")).toBeVisible();
    await expect(page.getByRole("button", { name: "清除筛选" }).first()).toBeVisible();
  });

  test("placeholder and empty links never render as clickable resource buttons", async ({
    page,
  }) => {
    await expect(page.locator('a[href*="example.com"]')).toHaveCount(0);
    await expect(page.getByText("暂无链接，待补充").first()).toBeVisible();
  });

  test("a verified official resource opens its external destination", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "只看官方资料" }).click();
    const link = page.getByRole("link", { name: "查看资料" }).first();
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("target", "_blank");
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const popup = await popupPromise;
    await expect.poll(() => popup.url()).toMatch(/^https:\/\//);
    await popup.close();
  });

  test("has no severe console, page or failed-request errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("requestfailed", (request) => {
      const failure = request.failure()?.errorText ?? "failed";
      if (failure !== "net::ERR_ABORTED") {
        errors.push(`${request.url()}: ${failure}`);
      }
    });
    await page.reload({ waitUntil: "networkidle" });
    expect(errors).toEqual([]);
  });
});

test("resource page has no horizontal overflow at required viewports", async ({
  browser,
}) => {
  const viewports = [
    { name: "iPhone SE", width: 375, height: 667 },
    { name: "iPhone 14", width: 390, height: 844 },
    { name: "iPad", width: 820, height: 1180 },
    { name: "Desktop 1440", width: 1440, height: 1000 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    await page.goto("/resources");
    await expect(page.getByRole("heading", { name: "2027届车辆行业笔试面经资料库" })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.content,
      `${viewport.name} should not overflow horizontally`,
    ).toBeLessThanOrEqual(dimensions.viewport + 1);
    await context.close();
  }
});

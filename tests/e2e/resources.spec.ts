import { expect, test } from "@playwright/test";

test.describe("public preparation resources", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resources");
    await expect(page.getByRole("heading", { name: "2027届车辆行业求职资料库" })).toBeVisible();
  });

  test("renders six unique platform resources once", async ({ page }) => {
    const resources = page.getByTestId("resource-row");
    await expect(resources).toHaveCount(6);
    const titles = await resources.locator("h2").allTextContents();
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles.every((title) => !title.includes("平台通用："))).toBe(true);
    await expect(page.getByText("公共方法资料，不代表任何企业题库")).toBeVisible();
  });

  test("direction and type filters work without fake company resources", async ({ page }) => {
    await page.getByRole("button", { name: "自动驾驶" }).click();
    expect(await page.getByTestId("resource-row").count()).toBeGreaterThan(0);
    await page.getByLabel("资料类型").selectOption("面经");
    expect(await page.getByTestId("resource-row").count()).toBeGreaterThan(0);
    await expect(page.getByLabel("公司")).toHaveCount(0);
  });

  test("invalid links never become clickable", async ({ page }) => {
    await expect(page.locator('a[href*="example.com"], a[href="#"], a[href=""]')).toHaveCount(0);
    await expect(page.getByText("暂无外部来源").first()).toBeVisible();
  });
});

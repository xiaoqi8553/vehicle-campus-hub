import { expect, test } from "@playwright/test";

test("homepage is a compact evidence-first recruitment dashboard", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "车辆行业校招情报" })).toBeVisible();
  await expect(page.getByText("2027届", { exact: true }).first()).toBeVisible();
  await expect(page.getByTestId("featured-companies")).toHaveCount(0);
  await expect(page.getByTestId("company-row")).toHaveCount(testInfo.project.name === "mobile" ? 3 : 6);
  await expect(page.getByRole("link", { name: /查看全部 25 家企业/ })).toBeVisible();
  await expect(page.getByText("链接先解释，按钮后出现")).toBeVisible();
});

test("company database supports search and detail navigation", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "2027届车辆行业公司情报库" })).toBeVisible();
  await expect(page.getByTestId("company-row")).toHaveCount(25);

  await page.getByRole("searchbox", { name: "搜索公司、城市或车辆方向" }).fill("小米");
  await expect(page.getByTestId("company-row")).toHaveCount(1);
  const detailLink = page.getByRole("link", { name: "查看小米汽车证据档案" });
  await expect(detailLink).toHaveAttribute("href", "/companies/xiaomi-auto");
  await Promise.all([
    page.waitForURL(/\/companies\/xiaomi-auto/),
    detailLink.click(),
  ]);
  await expect(page.getByRole("heading", { name: /小米汽车/ })).toBeVisible();
  await expect(page.getByText("2027 届项目判断")).toBeVisible();
  await expect(page.getByText("岗位方向参考")).toBeVisible();
});

test("about page works and admin remains private", async ({ page, request }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "关于 Vehicle Campus Hub" })).toBeVisible();
  expect((await request.get("/admin")).status()).toBe(404);
});

test("API validation returns structured errors", async ({ request }) => {
  const response = await request.post("/api/companies", { data: {} });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
});

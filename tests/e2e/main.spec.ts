import { expect, test } from "@playwright/test";

test("homepage is a compact 2027 recruitment intelligence dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "2027届车辆行业校招雷达" })).toBeVisible();
  await expect(page.getByTestId("featured-companies")).toHaveCount(0);
  await expect(page.getByTestId("company-row")).toHaveCount(8);
  await expect(page.getByRole("link", { name: /查看全部 25 家企业/ })).toBeVisible();
  await expect(page.getByText("信息来源与核验规则")).toBeVisible();
});

test("company database supports search and detail navigation", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "2027届车辆行业公司情报库" })).toBeVisible();
  await expect(page.getByTestId("company-row")).toHaveCount(25);

  await page.getByRole("textbox", { name: "搜索公司" }).fill("小米");
  await expect(page.getByTestId("company-row")).toHaveCount(1);
  const detailLink = page.getByRole("link", { name: "查看公司档案" });
  await expect(detailLink).toHaveAttribute("href", "/companies/xiaomi-auto");
  await Promise.all([
    page.waitForURL(/\/companies\/xiaomi-auto/),
    detailLink.click(),
  ]);
  await expect(page.getByRole("heading", { name: /小米汽车/ })).toBeVisible();
  await expect(page.getByText("官方招聘信息")).toBeVisible();
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

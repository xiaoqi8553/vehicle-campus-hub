import { expect, test } from "@playwright/test";

test("homepage is a compact public opportunity dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "更快找到适合你的车企机会" })).toBeVisible();
  await expect(page.getByText("2027 届车辆行业校招", { exact: true })).toBeVisible();
  await expect(page.getByTestId("home-opportunity")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "查看全部企业" })).toBeVisible();
  await expect(page.getByText("每条机会，都说明信息从哪里来")).toBeVisible();
});

test("company database supports search and detail navigation", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "寻找适合你的车辆企业" })).toBeVisible();
  await expect(page.getByTestId("company-row")).toHaveCount(25);

  await page.getByRole("searchbox", { name: "搜索公司、技术方向或城市" }).fill("小米");
  await expect(page.getByTestId("company-row")).toHaveCount(1);
  const detailLink = page.getByRole("link", { name: "了解小米汽车机会" });
  await expect(detailLink).toHaveAttribute("href", "/companies/xiaomi-auto");
  await detailLink.click();
  await expect(page).toHaveURL(/\/companies\/xiaomi-auto/);
  await expect(page.getByRole("heading", { name: /小米汽车/ })).toBeVisible();
  await expect(page.getByText("当前校招机会")).toBeVisible();
  await expect(page.getByText("适合关注的技术方向")).toBeVisible();
});

test("about page works and admin remains private", async ({ page, request }) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", {
      name: "让车辆行业校招信息，更容易找到，也更容易相信",
    }),
  ).toBeVisible();
  expect((await request.get("/admin")).status()).toBe(404);
});

test("API validation returns structured errors", async ({ request }) => {
  const response = await request.post("/api/companies", { data: {} });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
});

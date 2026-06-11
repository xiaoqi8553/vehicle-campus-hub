import { expect, test } from "@playwright/test";

test("homepage search, status filter and detail navigation work", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "2027届车辆行业校招雷达" })).toBeVisible();
  await expect(page.getByTestId("company-card").first()).toBeVisible();
  const explorer = page.getByTestId("company-explorer");
  const explorerCards = explorer.getByTestId("company-card");

  await page.getByPlaceholder(/搜索公司/).fill("小米");
  await expect(explorerCards).toHaveCount(1);
  await expect(explorerCards).toContainText("小米");

  await page.getByPlaceholder(/搜索公司/).fill("");
  const initialCount = await explorerCards.count();
  await page.getByLabel("校招状态").selectOption("已开启");
  const filteredCount = await explorerCards.count();
  expect(filteredCount).toBeLessThan(initialCount);
  await expect(page.getByText("没有匹配结果")).toBeVisible();
  await page.getByLabel("校招状态").selectOption("");

  const detailLink = explorer.getByRole("link", { name: "查看详情" }).first();
  await expect(detailLink).toHaveAttribute("href", /\/companies\/.+/);
  await Promise.all([
    page.waitForURL(/\/companies\/.+/),
    detailLink.click(),
  ]);
  await expect(page.getByText("公司基础信息")).toBeVisible();
  await expect(page.getByText("校招项目")).toBeVisible();
  await expect(page.getByText("岗位方向分组")).toBeVisible();
  await expect(page.getByText("笔试面经资料")).toBeVisible();
  await expect(page.getByText("求职准备建议")).toBeVisible();
});

test("companies, calendar, resources, about and admin guard render core behavior", async ({
  page,
  request,
}) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "2027届车辆行业公司库" })).toBeVisible();
  await expect(page.getByTestId("company-card").first()).toBeVisible();

  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: "2027届车辆行业校招日历" })).toBeVisible();
  await expect(page.getByTestId("calendar-event").first()).toBeVisible();

  await page.goto("/resources");
  await expect(page.getByRole("heading", { name: "2027届车辆行业笔试面经资料库" })).toBeVisible();
  await expect(page.getByTestId("resource-card").first()).toBeVisible();

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "关于 2027届车辆行业校招雷达" })).toBeVisible();

  const adminResponse = await request.get("/admin");
  expect(adminResponse.status()).toBe(404);
});

test("empty external links are disabled without page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/companies");
  await expect(page.getByText("待补官方链接").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("API failures return structured messages instead of HTML crashes", async ({
  request,
}) => {
  const response = await request.post("/api/companies", { data: {} });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
});

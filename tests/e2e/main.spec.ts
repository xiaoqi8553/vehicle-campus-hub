import { expect, test } from "@playwright/test";

test("homepage search, status filter and detail navigation work", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Vehicle Campus Hub/i })).toBeVisible();
  await expect(page.getByTestId("company-card").first()).toBeVisible();

  await page.getByPlaceholder(/搜索公司/).fill("小米");
  await expect(page.getByTestId("company-card")).toHaveCount(1);
  await expect(page.getByTestId("company-card")).toContainText("小米");

  await page.getByPlaceholder(/搜索公司/).fill("");
  const initialCount = await page.getByTestId("company-card").count();
  await page.getByLabel("校招状态").selectOption("已开启");
  const filteredCount = await page.getByTestId("company-card").count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThan(initialCount);

  await page.getByTestId("company-card").first().getByRole("link", { name: "查看详情" }).click();
  await expect(page).toHaveURL(/\/companies\/.+/);
  await expect(page.getByText("公司基础信息")).toBeVisible();
  await expect(page.getByText("校招项目")).toBeVisible();
  await expect(page.getByText("车辆相关岗位")).toBeVisible();
  await expect(page.getByText("笔试面试资料")).toBeVisible();
  await expect(page.getByText("求职准备建议")).toBeVisible();
});

test("companies, calendar, resources and admin pages render core content", async ({
  page,
}) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "公司库" })).toBeVisible();
  await expect(page.getByTestId("company-card").first()).toBeVisible();

  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: "校招日历" })).toBeVisible();
  await expect(page.getByTestId("calendar-event").first()).toBeVisible();

  await page.goto("/resources");
  await expect(page.getByRole("heading", { name: "笔试面经" })).toBeVisible();
  await expect(page.getByTestId("resource-card").first()).toBeVisible();

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "后台管理" })).toBeVisible();
  for (const name of ["公司管理", "校招项目管理", "岗位管理", "资料管理"]) {
    await expect(page.getByRole("button", { name })).toBeVisible();
  }
});

test("empty external links are disabled without page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/companies");
  await expect(page.getByText("暂无投递链接").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("API failures return structured messages instead of HTML crashes", async ({
  request,
}) => {
  const response = await request.post("/api/companies", { data: {} });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({ error: expect.any(String) });
});

test("admin company form validates, saves and can be cleaned up through the API", async ({
  page,
  request,
}, testInfo) => {
  const companyName = `Playwright 测试车企 ${testInfo.project.name}`;
  await page.goto("/admin");
  await page.getByPlaceholder("公司名称 *").fill(companyName);
  await page.locator('select[name="category"]').selectOption("智能化供应商");
  await page.getByPlaceholder("城市，逗号分隔 *").fill("上海");
  await page.getByPlaceholder("标签，逗号分隔 *").fill("自动驾驶,嵌入式");
  await page.getByPlaceholder("适配方向，逗号分隔 *").fill("自动驾驶,车载软件");
  await page.getByPlaceholder("公司简介 *").fill("用于验证后台表单写入和清理流程。");
  await page.getByRole("button", { name: "保存记录" }).click();
  await expect(page.getByText("保存成功，数据已写入数据库。")).toBeVisible();

  const lookup = await request.get("/api/companies?q=Playwright");
  const payload = (await lookup.json()) as { data: Array<{ id: string; name: string }> };
  const created = payload.data.find((item) => item.name === companyName);
  expect(created).toBeTruthy();
  if (created) {
    const update = await request.put(`/api/companies/${created.id}`, {
      data: { status: "已开启" },
    });
    expect(update.ok()).toBeTruthy();
    const detail = await request.get(`/api/companies/${created.id}`);
    await expect(detail.json()).resolves.toMatchObject({
      data: { status: "已开启" },
    });
    const cleanup = await request.delete(`/api/companies/${created.id}`);
    expect(cleanup.ok()).toBeTruthy();
  }
});

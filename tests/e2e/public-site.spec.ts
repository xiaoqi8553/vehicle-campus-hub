import { expect, test } from "@playwright/test";

test("public site uses the CheZhao Radar brand and student-facing navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "车招雷达首页" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "车辆行业 2027 届校招信息汇总" }),
  ).toBeVisible();
  if (testInfo.project.name === "mobile") {
    await page.locator('summary[aria-label="打开导航"]').click();
  }
  const navigation = page.getByRole("navigation", {
    name: testInfo.project.name === "mobile" ? "移动导航" : "主导航",
  });
  for (const item of ["公司机会", "招聘日历", "求职指南", "关于我们"]) {
    await expect(navigation).toContainText(item);
  }
  await expect(page.getByText(/EVIDENCE DOSSIER|SEARCH FIRST|DECISION SUMMARY/)).toHaveCount(0);
});

test("homepage prioritizes search, verified opportunities and compact direction shortcuts", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("searchbox", { name: "搜索公司、技术方向或城市" })).toBeVisible();
  await expect(page.getByTestId("home-opportunity")).toHaveCount(6);
  await expect(page.getByRole("link", { name: "自动驾驶" })).toHaveAttribute(
    "href",
    "/companies?direction=%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6",
  );
  await expect(page.getByRole("heading", { name: "按车辆技术方向找机会" })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "每条招聘入口都保留来源和核验时间" }),
  ).toBeVisible();
});

test("company list communicates opportunity status without internal evidence jargon", async ({
  page,
}) => {
  await page.goto("/companies");
  await expect(page.getByTestId("company-row")).toHaveCount(25);
  await expect(page.getByText("找到 25 家企业")).toBeVisible();
  await expect(page.getByRole("link", { name: "了解小米汽车机会" })).toBeVisible();
  await expect(page.getByText(/证据档案|COMPANY INTELLIGENCE/)).toHaveCount(0);
});

test("company detail answers what the student can do next", async ({ page }) => {
  await page.goto("/companies/xiaomi-auto");
  await expect(page.getByRole("heading", { name: "当前校招机会" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "适合关注的技术方向" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "现在可以做什么？" })).toBeVisible();
  await expect(page.getByText(/EVIDENCE DOSSIER|DECISION SUMMARY|下一步判断/)).toHaveCount(0);
});

test("calendar keeps unpublished companies behind one compact watchlist entry", async ({
  page,
}) => {
  await page.goto("/calendar");
  await expect(page.getByTestId("open-undated-row")).toHaveCount(3);
  await expect(page.getByTestId("watchlist-row")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "查看企业观察名单" })).toBeVisible();
  await expect(page.locator("time")).toHaveCount(0);
});

test("career guides present complete reading paths instead of resource inventory", async ({
  page,
}) => {
  await page.goto("/resources");
  await expect(page.getByRole("heading", { name: "车辆行业求职指南" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "车辆行业校招准备路线图" })).toBeVisible();
  await expect(page.getByRole("link", { name: /阅读完整指南/ }).first()).toBeVisible();
  await expect(page.getByTestId("resource-row")).toHaveCount(6);
});

test("about page explains the public mission and offers a real feedback action", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", {
      name: "让车辆行业校招信息，更容易找到，也更容易相信",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "我们不会做什么" })).toBeVisible();
  await expect(page.getByRole("link", { name: "提交信息反馈" })).toHaveAttribute(
    "href",
    /github\.com\/xiaoqi8553\/vehicle-campus-hub\/issues\/new/,
  );
});

test("each public page has a distinct student-facing purpose", async ({ page }) => {
  const routes = [
    ["/companies", "车辆行业 2027 届公司机会库"],
    ["/calendar", "车辆行业校招日历"],
    ["/resources", "车辆行业求职指南"],
    ["/about", "让车辆行业校招信息，更容易找到，也更容易相信"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

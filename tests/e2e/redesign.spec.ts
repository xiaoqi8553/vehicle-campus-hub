import { expect, test } from "@playwright/test";

test("homepage prioritizes search and keeps the mobile company list short", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByText("2027 届车辆行业校招", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "更快找到适合你的车企机会" })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "搜索公司、技术方向或城市" })).toBeVisible();

  await expect(page.getByTestId("home-opportunity")).toHaveCount(3);

  const hero = await page.locator(".home-hero").evaluate((element) => {
    const heading = element.querySelector("h1");
    const headingStyle = heading ? getComputedStyle(heading) : null;
    return {
      height: element.getBoundingClientRect().height,
      fontSize: headingStyle ? Number.parseFloat(headingStyle.fontSize) : 0,
      headingHeight: heading?.getBoundingClientRect().height ?? 0,
    };
  });
  if (testInfo.project.name === "mobile") {
    expect(hero.fontSize).toBeGreaterThanOrEqual(28);
    expect(hero.fontSize).toBeLessThanOrEqual(34);
  } else {
    expect(hero.height).toBeLessThanOrEqual(560);
    expect(hero.fontSize).toBeGreaterThanOrEqual(42);
    expect(hero.fontSize).toBeLessThanOrEqual(60);
  }
  expect(hero.headingHeight).toBeLessThanOrEqual(
    hero.fontSize * (testInfo.project.name === "mobile" ? 2.5 : 1.3),
  );
});

test("Xiaomi dead deep link is not counted or rendered as an active action", async ({ page }) => {
  await page.goto("/companies/xiaomi-auto");
  await expect(page.locator('a[href*="/campus/0"]')).toHaveCount(0);
  await expect(page.getByText("小米历史项目深链（已失效）")).toBeVisible();
  await expect(page.getByText("已失效", { exact: true })).toBeVisible();
});

test("external links have specific names and duplicate URLs are collapsed", async ({ page }) => {
  await page.goto("/companies/xpeng");

  const externalLinks = page.locator('a[target="_blank"]');
  expect(await externalLinks.count()).toBeGreaterThan(0);
  const labels = await externalLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("aria-label") || link.textContent?.trim() || ""),
  );
  expect(labels.every((label) => label.length >= 8)).toBe(true);
  expect(labels.some((label) => /招聘官网|查看来源|核对来源/.test(label))).toBe(false);

  const urls = await externalLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  expect(new Set(urls).size).toBe(urls.length);
});

test("company list puts explicitly open 2027 opportunities first", async ({ page }) => {
  await page.goto("/companies");
  const firstRows = page.getByTestId("company-row");
  expect(await firstRows.count()).toBeGreaterThanOrEqual(3);
  for (let index = 0; index < 3; index += 1) {
    await expect(firstRows.nth(index)).toContainText("2027");
  }
});

test("calendar separates open undated projects from unpublished companies", async ({ page }) => {
  await page.goto("/calendar");
  await expect(page.getByRole("heading", { name: "已开放但未公布截止日期" })).toBeVisible();
  await expect(page.getByRole("link", { name: "查看企业观察名单" })).toBeVisible();
  await expect(page.locator('a[href*="/campus/0"]')).toHaveCount(0);
});

test("platform resources have real internal reading pages", async ({ page }) => {
  await page.goto("/resources");
  const firstResource = page.getByTestId("resource-row").first();
  const readLink = firstResource.getByRole("link", { name: /阅读完整指南/ });
  await expect(readLink).toBeVisible();
  await readLink.click();
  await expect(page).toHaveURL(/\/resources\/[^/]+$/);
  await expect(page.getByRole("navigation", { name: "文章目录" })).toBeVisible();
  expect(await page.locator("article section").count()).toBeGreaterThanOrEqual(3);
});

test("feedback entry opens a real GitHub issue form", async ({ page }) => {
  await page.goto("/about");
  const feedback = page.getByRole("link", { name: "提交信息反馈" });
  await expect(feedback).toHaveAttribute(
    "href",
    /github\.com\/xiaoqi8553\/vehicle-campus-hub\/issues\/new/,
  );
});

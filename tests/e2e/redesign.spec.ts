import { expect, test } from "@playwright/test";

test("homepage prioritizes search and keeps the mobile company list short", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByText("2027届", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "车辆行业校招情报" })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: "搜索公司、城市或车辆方向" })).toBeVisible();

  const rows = page.getByTestId("company-row");
  if (testInfo.project.name === "mobile") {
    await expect(rows).toHaveCount(3);
  } else {
    expect(await rows.count()).toBeLessThanOrEqual(6);
  }

  const hero = await page.locator(".terminal-hero").evaluate((element) => {
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
    expect(hero.height).toBeLessThanOrEqual(380);
    expect(hero.fontSize).toBeGreaterThanOrEqual(40);
    expect(hero.fontSize).toBeLessThanOrEqual(48);
  }
  expect(hero.headingHeight).toBeLessThanOrEqual(hero.fontSize * 1.3);
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

  const urls = await externalLinks.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
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
  await expect(page.getByRole("heading", { name: "尚未发布 2027 项目" })).toBeVisible();
  await expect(page.locator('a[href*="/campus/0"]')).toHaveCount(0);
});

test("platform resources have real internal reading pages", async ({ page }) => {
  await page.goto("/resources");
  const firstResource = page.getByTestId("resource-row").first();
  const readLink = firstResource.getByRole("link", { name: /阅读全文/ });
  await expect(readLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/resources\/[^/]+$/),
    readLink.click(),
  ]);
  await expect(page.getByRole("navigation", { name: "文章目录" })).toBeVisible();
  expect(await page.locator("article section").count()).toBeGreaterThanOrEqual(3);
});

test("feedback entry opens a real GitHub issue form", async ({ page }) => {
  await page.goto("/about");
  const feedback = page.getByRole("link", { name: /提交数据纠错反馈/ });
  await expect(feedback).toHaveAttribute(
    "href",
    /github\.com\/xiaoqi8553\/vehicle-campus-hub\/issues\/new/,
  );
});

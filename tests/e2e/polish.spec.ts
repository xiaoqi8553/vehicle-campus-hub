import { expect, test } from "@playwright/test";

test("desktop layout uses a wider public content shell", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const width = await page
    .locator(".shell")
    .first()
    .evaluate((element) => {
      return Math.round(element.getBoundingClientRect().width);
    });
  expect(width).toBeGreaterThanOrEqual(1280);
});

test("home focuses on opportunity cards and removes the old direction block", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("home-opportunity")).toHaveCount(6);
  await expect(page.getByRole("heading", { name: "按车辆技术方向找机会" })).toHaveCount(0);
  await expect(page.getByText("少翻群聊")).toHaveCount(0);
  await expect(page.getByText("不让你错过变化")).toHaveCount(0);
});

test("company cards use logo images or accessible neutral logo fallback", async ({ page }) => {
  await page.goto("/companies");
  const rows = page.getByTestId("company-row");
  await expect(rows.first()).toBeVisible();
  const firstSix = await rows.evaluateAll((elements) =>
    elements.slice(0, 6).map((element) => {
      const logoImage = element.querySelector("img.company-logo");
      const fallback = element.querySelector("[data-testid='company-logo-fallback']");
      return {
        hasImage: Boolean(logoImage),
        imageAlt: logoImage?.getAttribute("alt") ?? "",
        fallbackLabel: fallback?.getAttribute("aria-label") ?? "",
        avatarText: element.querySelector(".company-avatar")?.textContent?.trim() ?? "",
      };
    }),
  );
  expect(firstSix.length).toBeGreaterThanOrEqual(6);
  for (const item of firstSix) {
    expect(item.avatarText.length).toBeLessThanOrEqual(0);
    expect(item.hasImage || item.fallbackLabel.includes("logo")).toBe(true);
    if (item.hasImage) expect(item.imageAlt).toMatch(/logo$/);
  }
});

test("company direction quick filters are prominent and functional", async ({ page }) => {
  await page.goto("/companies");
  const quickFilter = page.getByRole("button", { name: "自动驾驶" }).first();
  await expect(quickFilter).toBeVisible();
  await quickFilter.click();
  await expect(page.getByLabel("车辆方向", { exact: true })).toHaveValue("自动驾驶");
  await expect(page.getByTestId("company-row").first()).toContainText("自动驾驶");
});

test("public pages avoid draft-like copy and keep mobile free of horizontal overflow", async ({
  page,
}) => {
  const routes = ["/", "/companies", "/calendar", "/resources", "/about"];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText(
      /少翻群聊|不让你错过变化|给正在寻找车辆行业方向的你|反馈信息/,
    );
  }

  for (const width of [320, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 1200 });
    await page.goto("/");
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  }
});

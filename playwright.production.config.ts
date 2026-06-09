import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "resources.spec.ts",
  fullyParallel: false,
  retries: 1,
  reporter: [["line"], ["html", { open: "never", outputFolder: "playwright-report-production" }]],
  use: {
    baseURL: "https://vehicle-campus-hub.vercel.app",
    channel: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "production-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "production-mobile", use: { ...devices["Pixel 7"] } },
  ],
});

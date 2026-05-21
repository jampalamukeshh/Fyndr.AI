import { expect, test } from "@playwright/test";

const featuredCapabilities = [
  "AI-Powered Screening",
  "Smart Video Interviews",
  "Analytics Dashboard",
  "Bias-Free Hiring",
  "Instant Matching",
  "Team Collaboration",
];

const STABILITY_RUNS = 10;

test.describe("Homepage Featured Capabilities", () => {
  test("renders featured content blocks with visible rounded cards", async ({ page }) => {
    for (let run = 1; run <= STABILITY_RUNS; run += 1) {
      await page.goto("/homepage");

      await expect(page.getByRole("heading", { name: "Choose Your Path" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Featured Platform Capabilities" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Success Stories" })).toBeVisible();

      for (const capability of featuredCapabilities) {
        await expect(page.getByRole("heading", { name: capability })).toBeVisible();
      }

      const cards = page.locator("section").filter({ hasText: "Featured Platform Capabilities" }).locator("article, div");
      await expect(cards.first()).toBeVisible();
    }
  });

  test("navigates from featured card interactions to active routes", async ({ page }) => {
    for (let run = 1; run <= STABILITY_RUNS; run += 1) {
      await page.goto("/homepage");

      await page.getByRole("heading", { name: "Instant Matching" }).click();
      await expect(page).toHaveURL(/ai-powered-job-feed-dashboard|workspace/);

      await page.goto("/homepage");
      await page.getByRole("button", { name: "Get Started Free" }).click();
      await expect(page).toHaveURL(/authentication-login-register/);
    }
  });

  test("has border and rounded style classes on core card shells", async ({ page }) => {
    for (let run = 1; run <= STABILITY_RUNS; run += 1) {
      await page.goto("/homepage");

      const cardShell = page.locator(".glassmorphic.border.rounded-\\[1\\.25rem\\]").first();
      await expect(cardShell).toBeVisible();

      const className = await cardShell.getAttribute("class");
      expect(className).toContain("border");
      expect(className).toContain("rounded-[1.25rem]");
    }
  });
});

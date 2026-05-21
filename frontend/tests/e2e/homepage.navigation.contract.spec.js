import { expect, test } from "@playwright/test";
import { homepageContent } from "../../src/pages/homepage/content/homepageContent.js";

const collectInternalPaths = () => {
  const paths = new Set();

  const walk = (node) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === "object") {
      Object.entries(node).forEach(([key, value]) => {
        if (key === "path" && typeof value === "string" && value.startsWith("/")) {
          paths.add(value);
        } else {
          walk(value);
        }
      });
    }
  };

  walk(homepageContent);
  return Array.from(paths);
};

const contractPaths = collectInternalPaths();

test.describe("Homepage navigation contract", () => {
  test("all homepage content paths resolve to a non-404 route", async ({ page }) => {
    for (const path of contractPaths) {
      await page.goto(path);
      await expect(page.locator("text=Page Not Found")).toHaveCount(0);
    }
  });

  test("core CTA buttons navigate correctly from homepage", async ({ page }) => {
    await page.goto("/homepage");

    await page.getByRole("button", { name: homepageContent.hero.ctas.primary.label }).click();
    await expect(page).toHaveURL(/authentication-login-register|job-seeker-onboarding-wizard|recruiter-onboarding-wizard|company-onboarding-wizard/);

    await page.goto("/homepage");
    await page.getByRole("button", { name: homepageContent.hero.ctas.secondary.label }).click();
    await expect(page).toHaveURL(/about-contact-page/);

    await page.goto("/homepage");
    await page.getByRole("button", { name: homepageContent.roles.guidanceCta.label }).click();
    await expect(page).toHaveURL(/about-contact-page/);
  });
});

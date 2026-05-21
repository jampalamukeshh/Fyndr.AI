import { describe, expect, it } from "vitest";
import { homepageContent } from "./homepageContent";

describe("homepageContent schema", () => {
  it("contains all major homepage sections", () => {
    expect(homepageContent).toHaveProperty("hero");
    expect(homepageContent).toHaveProperty("roles");
    expect(homepageContent).toHaveProperty("featuredCapabilities");
    expect(homepageContent).toHaveProperty("testimonials");
    expect(homepageContent).toHaveProperty("about");
    expect(homepageContent).toHaveProperty("footer");
  });

  it("keeps featured capabilities data-driven", () => {
    const cards = homepageContent.featuredCapabilities.cards;
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBeGreaterThanOrEqual(6);
    cards.forEach((card) => {
      expect(typeof card.title).toBe("string");
      expect(typeof card.description).toBe("string");
      expect(typeof card.path).toBe("string");
    });
  });

  it("includes all promised homepage lists", () => {
    expect(homepageContent.hero.rotatingTitles.length).toBeGreaterThanOrEqual(3);
    expect(homepageContent.hero.stats.length).toBeGreaterThanOrEqual(3);

    expect(homepageContent.roles.cards.length).toBe(3);
    homepageContent.roles.cards.forEach((role) => {
      expect(role.features.length).toBeGreaterThanOrEqual(4);
      expect(typeof role.cta).toBe("string");
    });

    expect(homepageContent.featuredCapabilities.cards.length).toBeGreaterThanOrEqual(6);
    expect(homepageContent.featuredCapabilities.platformStats.length).toBeGreaterThanOrEqual(4);

    expect(homepageContent.testimonials.entries.length).toBeGreaterThanOrEqual(3);
    expect(homepageContent.testimonials.stats.length).toBeGreaterThanOrEqual(3);

    expect(homepageContent.about.impactStats.length).toBeGreaterThanOrEqual(4);
    expect(homepageContent.about.team.length).toBeGreaterThanOrEqual(4);

    expect(homepageContent.footer.groups.length).toBeGreaterThanOrEqual(4);
    homepageContent.footer.groups.forEach((group) => {
      expect(group.links.length).toBeGreaterThanOrEqual(4);
      group.links.forEach((link) => {
        expect(typeof link.label).toBe("string");
        expect(typeof link.path).toBe("string");
      });
    });
    expect(homepageContent.footer.socialLinks.length).toBeGreaterThanOrEqual(4);
  });
});

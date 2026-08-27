import { describe, expect, it } from "vitest";
import {
  aboutPopulateQuery,
  articleBySlugQuery,
  articlesListQuery,
  authorsPopulateQuery,
  globalPopulateQuery,
  homepagePopulateQuery,
} from "./queries";

describe("Strapi populate queries", () => {
  it("lists articles with cover, author avatar, category, and publishedAt sort", () => {
    expect(articlesListQuery).toContain("populate[cover]");
    expect(articlesListQuery).toContain("populate[author][populate]");
    expect(articlesListQuery).toContain("avatar");
    expect(articlesListQuery).toContain("populate[category]");
    expect(articlesListQuery).toContain("publishedAt:desc");
  });

  it("loads article blocks with nested populate", () => {
    expect(articleBySlugQuery).toContain("populate[blocks][on][shared.hero-banner]");
    expect(articleBySlugQuery).toContain("populate[blocks][on][shared.tour-list]");
    expect(articleBySlugQuery).toContain("populate[blocks][on][shared.media]");
    expect(articleBySlugQuery).toContain("populate[blocks][on][shared.slider]");
  });

  it("populates global favicon and defaultSeo.shareImage", () => {
    expect(globalPopulateQuery).toContain("populate[favicon]");
    expect(globalPopulateQuery).toContain("populate[defaultSeo][populate]");
    expect(globalPopulateQuery).toContain("shareImage");
  });

  it("populates about blocks including travel-guide sections", () => {
    expect(aboutPopulateQuery).toContain("populate[about_hero][populate]=background");
    expect(aboutPopulateQuery).toContain("shared.hero-banner");
    expect(aboutPopulateQuery).toContain("shared.services");
    expect(aboutPopulateQuery).toContain("shared.vision-mission");
    expect(aboutPopulateQuery).toContain("shared.tour-list");
    expect(aboutPopulateQuery).toContain("shared.testimonials");
    expect(aboutPopulateQuery).toContain("shared.media-gallery");
  });

  it("populates homepage hero and travel-guide blocks", () => {
    expect(homepagePopulateQuery).toContain("populate[home_hero][populate]=background");
    expect(homepagePopulateQuery).toContain("shared.hero-banner");
    expect(homepagePopulateQuery).toContain("shared.services");
  });

  it("populates author avatars", () => {
    expect(authorsPopulateQuery).toContain("avatar");
  });
});

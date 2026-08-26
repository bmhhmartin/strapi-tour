import { describe, expect, it } from "vitest";
import {
  aboutPopulateQuery,
  articleBySlugQuery,
  articlesListQuery,
  authorsPopulateQuery,
  globalPopulateQuery,
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
    expect(articleBySlugQuery).toContain("populate[blocks][populate]");
    expect(articleBySlugQuery).toContain("*");
  });

  it("populates global favicon and defaultSeo.shareImage", () => {
    expect(globalPopulateQuery).toContain("populate[favicon]");
    expect(globalPopulateQuery).toContain("populate[defaultSeo][populate]");
    expect(globalPopulateQuery).toContain("shareImage");
  });

  it("populates about blocks", () => {
    expect(aboutPopulateQuery).toContain("populate[blocks][populate]");
  });

  it("populates author avatars", () => {
    expect(authorsPopulateQuery).toContain("avatar");
  });
});

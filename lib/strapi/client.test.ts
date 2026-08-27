import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getFixturePage } from "./client";

describe("getFixturePage", () => {
  it("returns the home fixture", () => {
    const page = getFixturePage("home");
    expect(page).not.toBeNull();
    expect(page?.slug).toBe("home");
    expect(page?.blocks.map((block) => block.__component)).toEqual([
      "shared.hero-banner",
      "shared.services",
      "shared.vision-mission",
      "shared.tour-list",
      "shared.testimonials",
    ]);
  });

  it("returns null for an unknown slug", () => {
    expect(getFixturePage("missing")).toBeNull();
  });
});

describe("getStrapiMediaUrl", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STRAPI_URL", "http://localhost:1337");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefixes a relative upload path with the Strapi origin", async () => {
    const { getStrapiMediaUrl } = await import("./client");
    expect(getStrapiMediaUrl("/uploads/cover.png")).toBe(
      "http://localhost:1337/uploads/cover.png",
    );
  });

  it("returns an absolute URL unchanged", async () => {
    const { getStrapiMediaUrl } = await import("./client");
    expect(getStrapiMediaUrl("https://cdn.example/pic.jpg")).toBe(
      "https://cdn.example/pic.jpg",
    );
  });
});

describe("fetchJSON", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STRAPI_URL", "http://localhost:1337");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON from a successful response", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { siteName: "Strapi Blog" } }),
    });

    const { fetchJSON } = await import("./client");
    const result = await fetchJSON<{ data: { siteName: string } }>("/api/global");

    expect(result.data.siteName).toBe("Strapi Blog");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:1337/api/global",
      expect.objectContaining({ next: { revalidate: 60 } }),
    );
  });

  it("appends a query string when provided", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { fetchJSON } = await import("./client");
    await fetchJSON("/api/articles", "sort=publishedAt:desc");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:1337/api/articles?sort=publishedAt:desc",
      expect.any(Object),
    );
  });

  it("throws with the endpoint path when Strapi returns 403", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
    });

    const { fetchJSON, StrapiError } = await import("./client");

    await expect(fetchJSON("/api/articles")).rejects.toMatchObject({
      status: 403,
      path: "/api/articles",
    });
    expect(StrapiError).toBeDefined();
  });
});

describe("content getters", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_STRAPI_URL", "http://localhost:1337");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("getArticles requests the list populate query and returns data", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 1,
            documentId: "doc1",
            title: "Hello",
            slug: "hello",
            description: "Hi",
            cover: null,
            author: null,
            category: null,
          },
        ],
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
      }),
    });

    const { getArticles } = await import("./client");
    const articles = await getArticles();

    expect(articles).toHaveLength(1);
    expect(articles[0]?.slug).toBe("hello");
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("/api/articles?");
    expect(url).toContain("populate");
    expect(url).toContain("sort");
  });

  it("getArticles can filter by category slug", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], meta: {} }),
    });

    const { getArticles } = await import("./client");
    await getArticles({ categorySlug: "tech" });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("filters");
    expect(url).toContain("tech");
  });

  it("getArticleBySlug returns null when the collection is empty", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const { getArticleBySlug } = await import("./client");
    expect(await getArticleBySlug("missing")).toBeNull();
  });

  it("getAbout maps about_hero entries onto hero-banner blocks", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          documentId: "about-1",
          title: "About the strapi blog test",
          about_hero: [
            {
              id: 2,
              title: "fasdfasd",
              subtitle: "adsfasdfasdf",
              ctaLabel: "asdfasdf",
              ctaHref: "asdfasdf",
              background: {
                id: 8,
                documentId: "media-8",
                url: "/uploads/beautiful_picture.jpeg",
                alternativeText: "beautiful-picture",
                width: 1200,
                height: 799,
                mime: "image/jpeg",
              },
            },
          ],
        },
      }),
    });

    const { getAbout } = await import("./client");
    const about = await getAbout();

    expect(about?.title).toBe("About the strapi blog test");
    expect(about?.blocks).toHaveLength(1);
    expect(about?.blocks[0]).toMatchObject({
      __component: "shared.hero-banner",
      id: 2,
      title: "fasdfasd",
      subtitle: "adsfasdfasdf",
    });
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("/api/about?");
    expect(url).toContain("about_hero");
  });

  it("getHomepage maps home_hero entries onto hero-banner blocks", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          documentId: "home-1",
          title: "Meridian Trails",
          home_hero: [
            {
              id: 3,
              title: "The world, unhurried",
              subtitle: "Small-group journeys",
              ctaLabel: "Browse tours",
              ctaHref: "#tours",
              background: {
                id: 9,
                documentId: "media-9",
                url: "/uploads/hero.jpeg",
                alternativeText: "Valley",
                width: 1600,
                height: 900,
                mime: "image/jpeg",
              },
            },
          ],
        },
      }),
    });

    const { getHomepage } = await import("./client");
    const homepage = await getHomepage();

    expect(homepage?.title).toBe("Meridian Trails");
    expect(homepage?.blocks).toHaveLength(1);
    expect(homepage?.blocks[0]).toMatchObject({
      __component: "shared.hero-banner",
      id: 3,
      title: "The world, unhurried",
    });
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("/api/homepage?");
    expect(url).toContain("home_hero");
  });

  it("getGlobal returns the single-type object", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 1,
          documentId: "g1",
          siteName: "Strapi Blog",
          siteDescription: "A Blog made with Strapi",
          favicon: null,
          defaultSeo: {
            metaTitle: "Page",
            metaDescription: "A blog made with Strapi",
          },
        },
      }),
    });

    const { getGlobal } = await import("./client");
    const global = await getGlobal();
    expect(global.siteName).toBe("Strapi Blog");
  });
});

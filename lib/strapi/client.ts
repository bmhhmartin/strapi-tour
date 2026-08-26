import { fixturePages } from "@/fixtures/pages";
import {
  aboutPopulateQuery,
  articleBySlugQuery,
  articlesListQuery,
  authorsPopulateQuery,
  globalPopulateQuery,
  pagesPopulateQuery,
} from "@/lib/strapi/queries";
import type {
  About,
  Article,
  Author,
  Category,
  Global,
  Page,
  StrapiCollection,
  StrapiSingle,
} from "@/types/strapi";

export class StrapiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(status: number, path: string) {
    super(`Strapi responded ${status} for ${path}`);
    this.name = "StrapiError";
    this.status = status;
    this.path = path;
  }
}

export function getStrapiURL() {
  const origin = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
  if (!origin) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  }
  return origin;
}

export function getStrapiMediaUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";
  const path = url.startsWith("/") ? url : `/${url}`;
  return origin ? `${origin}${path}` : path;
}

export async function fetchJSON<T>(path: string, query?: string): Promise<T> {
  const origin = getStrapiURL();
  const url = `${origin}${path}${query ? `?${query}` : ""}`;
  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new StrapiError(response.status, path);
  }

  return (await response.json()) as T;
}

export function getFixturePage(slug: string): Page | null {
  return fixturePages.find((page) => page.slug === slug) ?? null;
}

function toPage(raw: Page): Page {
  return {
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    slug: raw.slug,
    seo: raw.seo ?? null,
    blocks: raw.blocks ?? [],
  };
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const json = await fetchJSON<StrapiCollection<Page> | StrapiSingle<Page>>(
      "/api/pages",
      `filters[slug][$eq]=${encodeURIComponent(slug)}&${pagesPopulateQuery}`,
    );
    const records = Array.isArray(json.data)
      ? json.data
      : json.data
        ? [json.data]
        : [];
    const record = records[0];
    if (!record) return null;
    return toPage(record);
  } catch (error) {
    if (isDev) return getFixturePage(slug);
    throw error;
  }
}

export async function getArticles(options?: {
  categorySlug?: string;
}): Promise<Article[]> {
  const parts = [articlesListQuery];
  if (options?.categorySlug) {
    parts.push(
      `filters[category][slug][$eq]=${encodeURIComponent(options.categorySlug)}`,
    );
  }
  const json = await fetchJSON<StrapiCollection<Article>>(
    "/api/articles",
    parts.join("&"),
  );
  return json.data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const json = await fetchJSON<StrapiCollection<Article>>(
    "/api/articles",
    `filters[slug][$eq]=${encodeURIComponent(slug)}&${articleBySlugQuery}`,
  );
  return json.data[0] ?? null;
}

export async function getGlobal(): Promise<Global> {
  const json = await fetchJSON<StrapiSingle<Global>>(
    "/api/global",
    globalPopulateQuery,
  );
  if (!json.data) {
    throw new StrapiError(404, "/api/global");
  }
  return json.data;
}

export async function getAbout(): Promise<About | null> {
  const json = await fetchJSON<StrapiSingle<About>>(
    "/api/about",
    aboutPopulateQuery,
  );
  return json.data;
}

export async function getCategories(): Promise<Category[]> {
  const json = await fetchJSON<StrapiCollection<Category>>("/api/categories");
  return json.data ?? [];
}

export async function getAuthors(): Promise<Author[]> {
  const json = await fetchJSON<StrapiCollection<Author>>(
    "/api/authors",
    authorsPopulateQuery,
  );
  return json.data ?? [];
}

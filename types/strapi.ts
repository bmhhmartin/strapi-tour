import type { PageBlock } from "./blocks";

export type StrapiMedia = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  mime: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  shareImage?: StrapiMedia | null;
  canonicalURL?: string | null;
  noIndex?: boolean;
};

export type StrapiBlockNode = {
  type: string;
  children?: StrapiBlockNode[];
  text?: string;
  [key: string]: unknown;
};

export type Page = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  seo?: Seo | null;
  blocks: PageBlock[];
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Author = {
  id: number;
  documentId: string;
  name: string;
  email: string;
  avatar: StrapiMedia | null;
};

export type Article = {
  id: number;
  documentId: string;
  title: string;
  description: string | null;
  slug: string;
  cover: StrapiMedia | null;
  author: Author | null;
  category: Category | null;
  blocks?: PageBlock[];
  publishedAt?: string | null;
};

export type Global = {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  favicon: StrapiMedia | null;
  defaultSeo: Seo | null;
};

export type About = {
  id: number;
  documentId: string;
  title: string;
  blocks: PageBlock[];
};

export type StrapiCollection<T> = {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingle<T> = {
  data: T | null;
};

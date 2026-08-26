import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CategoryFilter } from "@/components/CategoryFilter";
import {
  getAbout,
  getArticleBySlug,
  getArticles,
  getCategories,
  getGlobal,
} from "@/lib/strapi/client";
import { toImageProps } from "@/lib/media";
import type { About, Article } from "@/types/strapi";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ category?: string }>;
};

function routeFromSlug(slug?: string[]) {
  if (!slug || slug.length === 0) return { kind: "home" as const };
  if (slug.length === 1 && slug[0] === "about") {
    return { kind: "about" as const };
  }
  if (slug.length === 1) {
    return { kind: "article" as const, slug: slug[0] };
  }
  return { kind: "unknown" as const };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = routeFromSlug(slug);

  if (route.kind === "home") {
    const global = await getGlobal();
    return {
      title: global.defaultSeo?.metaTitle || global.siteName,
      description: global.defaultSeo?.metaDescription || global.siteDescription,
    };
  }

  if (route.kind === "about") {
    const about = await getAbout();
    return { title: about?.title ?? "About" };
  }

  if (route.kind === "article") {
    const article = await getArticleBySlug(route.slug);
    if (!article) return { title: "Not found" };
    return {
      title: article.title,
      description: article.description ?? undefined,
    };
  }

  return { title: "Not found" };
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const route = routeFromSlug(slug);

  if (route.kind === "home") {
    const { category } = await searchParams;
    return <HomePage categorySlug={category} />;
  }

  if (route.kind === "about") {
    const about = await getAbout();
    if (!about) notFound();
    return <AboutPage about={about} />;
  }

  if (route.kind === "article") {
    const article = await getArticleBySlug(route.slug);
    if (!article) notFound();
    return <ArticlePage article={article} />;
  }

  notFound();
}

async function HomePage({ categorySlug }: { categorySlug?: string }) {
  const [global, articles, categories] = await Promise.all([
    getGlobal(),
    getArticles({ categorySlug }),
    getCategories(),
  ]);

  const activeCategory = categories.find((item) => item.slug === categorySlug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
        {global.siteName}
      </p>
      <h1 className="mt-4 max-w-3xl font-serif text-5xl tracking-tight text-ink md:text-6xl">
        {global.siteDescription}
      </h1>
      <div className="mt-10">
        <CategoryFilter categories={categories} activeSlug={categorySlug} />
      </div>
      {articles.length === 0 ? (
        <p className="mt-16 max-w-xl text-lg leading-relaxed text-ink/70">
          {activeCategory
            ? `No published articles in ${activeCategory.name} yet.`
            : "No published articles yet. Drafts in Strapi are not visible on the public site."}
        </p>
      ) : (
        <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.documentId}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AboutPage({ about }: { about: About }) {
  return (
    <article>
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
          About
        </p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-ink md:text-6xl">
          {about.title}
        </h1>
      </div>
      {about.blocks.length === 0 ? (
        <p className="mx-auto max-w-6xl px-6 py-16 text-lg text-ink/70">
          This page has no published blocks yet.
        </p>
      ) : (
        <BlockRenderer blocks={about.blocks} />
      )}
    </article>
  );
}

function ArticlePage({ article }: { article: Article }) {
  const cover = article.cover ? toImageProps(article.cover) : null;
  const avatar = article.author?.avatar
    ? toImageProps(article.author.avatar)
    : null;

  return (
    <article>
      <header className="mx-auto max-w-3xl px-6 pt-16 md:pt-24">
        {article.category ? (
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
            {article.category.name}
          </p>
        ) : null}
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink md:text-6xl">
          {article.title}
        </h1>
        {article.description ? (
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            {article.description}
          </p>
        ) : null}
        {article.author ? (
          <div className="mt-8 flex items-center gap-3 text-sm text-ink/65">
            {avatar ? (
              <Image
                src={avatar.src}
                alt={avatar.alt || article.author.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            ) : null}
            <span>{article.author.name}</span>
          </div>
        ) : null}
      </header>
      {cover ? (
        <div className="mx-auto mt-12 max-w-5xl px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={cover.src}
              alt={cover.alt || article.title}
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}
      {article.blocks && article.blocks.length > 0 ? (
        <BlockRenderer blocks={article.blocks} />
      ) : (
        <p className="mx-auto max-w-3xl px-6 py-16 text-lg text-ink/70">
          This article has no published blocks yet.
        </p>
      )}
    </article>
  );
}

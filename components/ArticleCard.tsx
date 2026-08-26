import Image from "next/image";
import Link from "next/link";
import { toImageProps } from "@/lib/media";
import type { Article } from "@/types/strapi";

export function ArticleCard({ article }: { article: Article }) {
  const cover = article.cover ? toImageProps(article.cover) : null;
  const avatar = article.author?.avatar
    ? toImageProps(article.author.avatar)
    : null;

  return (
    <article className="group overflow-hidden rounded-3xl bg-white/50 shadow-sm ring-1 ring-ink/5">
      <Link href={`/${article.slug}`} className="block">
        {cover ? (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={cover.src}
              alt={cover.alt || article.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <div className="px-6 py-5">
          {article.category ? (
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
              {article.category.name}
            </p>
          ) : null}
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-ink">
            {article.title}
          </h2>
          {article.description ? (
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              {article.description}
            </p>
          ) : null}
          {article.author ? (
            <div className="mt-4 flex items-center gap-3 text-sm text-ink/65">
              {avatar ? (
                <Image
                  src={avatar.src}
                  alt={avatar.alt || article.author.name}
                  width={32}
                  height={32}
                  className="size-8 rounded-full object-cover"
                />
              ) : null}
              <span>{article.author.name}</span>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

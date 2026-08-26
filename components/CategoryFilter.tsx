import Link from "next/link";
import type { Category } from "@/types/strapi";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          !activeSlug
            ? "bg-ink text-sand"
            : "bg-white/60 text-ink/70 hover:bg-white"
        }`}
      >
        All
      </Link>
      {categories.map((category) => {
        const active = activeSlug === category.slug;
        return (
          <Link
            key={category.documentId}
            href={`/?category=${category.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-ink text-sand"
                : "bg-white/60 text-ink/70 hover:bg-white"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}

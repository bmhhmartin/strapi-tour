import Image from "next/image";
import { toImageProps } from "@/lib/media";
import type { HeroBannerBlock } from "@/types/blocks";

export function HeroBanner({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  background,
}: HeroBannerBlock) {
  const image = toImageProps(background);

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/15" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32 md:pb-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-sand/80">
          Meridian Trails
        </p>
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] text-sand md:text-7xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand/85">
            {subtitle}
          </p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <a
            href={ctaHref}
            className="mt-10 inline-flex items-center rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-sand transition hover:bg-terracotta/90"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

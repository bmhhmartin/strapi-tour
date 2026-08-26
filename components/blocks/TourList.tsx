import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { toImageProps } from "@/lib/media";
import type { TourListBlock } from "@/types/blocks";

export function TourList({ heading, tours }: TourListBlock) {
  return (
    <Section id="tours" className="bg-sand">
      <SectionHeading heading={heading} />
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => {
          const image = toImageProps(tour.image);
          const isInternal = tour.href.startsWith("/");

          const meta = [tour.duration, tour.price].filter(Boolean).join(" · ");
          const body = (
            <>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-ocean">
                  {tour.location}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-ink">
                  {tour.title}
                </h3>
                {tour.excerpt ? (
                  <p className="mt-3 flex-1 leading-relaxed text-ink/70">
                    {tour.excerpt}
                  </p>
                ) : null}
                {meta ? (
                  <p className="mt-4 text-sm font-medium text-terracotta">
                    {meta}
                  </p>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={tour.id}>
              {isInternal ? (
                <Link
                  href={tour.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-36px_rgba(20,34,28,0.55)]"
                >
                  {body}
                </Link>
              ) : (
                <a
                  href={tour.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-36px_rgba(20,34,28,0.55)]"
                >
                  {body}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

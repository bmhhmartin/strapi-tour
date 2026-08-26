import Image from "next/image";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { toImageProps } from "@/lib/media";
import type { SliderBlock } from "@/types/blocks";

export function Slider({ heading, slides, files }: SliderBlock) {
  const items =
    files?.map((file) => ({
      id: file.id,
      image: file,
      caption: file.alternativeText,
    })) ??
    slides ??
    [];

  return (
    <Section className="bg-foam">
      <SectionHeading heading={heading} />
      <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
        {items.map((slide) => {
          const image = toImageProps(slide.image);
          return (
            <figure
              key={slide.id}
              className="w-[min(85vw,36rem)] shrink-0 snap-center"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 36rem, 85vw"
                  className="object-cover"
                />
              </div>
              {slide.caption ? (
                <figcaption className="mt-3 text-sm text-ink/65">
                  {slide.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>
    </Section>
  );
}

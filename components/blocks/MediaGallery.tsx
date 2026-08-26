import Image from "next/image";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { toImageProps } from "@/lib/media";
import type { MediaGalleryBlock } from "@/types/blocks";

export function MediaGallery({ heading, images }: MediaGalleryBlock) {
  return (
    <Section className="bg-sand">
      <SectionHeading heading={heading} />
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((image, index) => {
          const props = toImageProps(image);
          return (
            <li
              key={image.id}
              className={
                index === 0
                  ? "relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl md:row-span-2 md:aspect-auto"
                  : "relative aspect-[4/3] overflow-hidden rounded-2xl"
              }
            >
              <Image
                src={props.src}
                alt={props.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

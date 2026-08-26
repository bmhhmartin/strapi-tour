import Image from "next/image";
import { Section } from "@/components/blocks/Section";
import { toImageProps } from "@/lib/media";
import type { MediaBlock } from "@/types/blocks";

export function Media({ file }: MediaBlock) {
  const image = toImageProps(file);

  return (
    <Section className="bg-sand">
      <figure className="mx-auto max-w-4xl">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 56rem, 100vw"
            className="object-cover"
          />
        </div>
      </figure>
    </Section>
  );
}

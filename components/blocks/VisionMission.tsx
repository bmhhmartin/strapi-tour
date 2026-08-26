import Image from "next/image";
import { Section, SectionHeading } from "@/components/blocks/Section";
import { toImageProps } from "@/lib/media";
import type { VisionMissionBlock } from "@/types/blocks";

export function VisionMission({
  heading,
  visionTitle,
  visionBody,
  missionTitle,
  missionBody,
  image,
}: VisionMissionBlock) {
  const photo = image ? toImageProps(image) : null;

  return (
    <Section className="bg-foam">
      <SectionHeading heading={heading} />
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="grid gap-10">
          <article>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-ocean">
              {visionTitle}
            </p>
            <p className="mt-3 font-serif text-2xl leading-snug text-ink md:text-3xl">
              {visionBody}
            </p>
          </article>
          <article>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
              {missionTitle}
            </p>
            <p className="mt-3 text-lg leading-relaxed text-ink/75">
              {missionBody}
            </p>
          </article>
        </div>
        {photo ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

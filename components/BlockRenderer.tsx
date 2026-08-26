import type { ComponentType } from "react";
import { HeroBanner } from "@/components/blocks/HeroBanner";
import { Media } from "@/components/blocks/Media";
import { MediaGallery } from "@/components/blocks/MediaGallery";
import { Quote } from "@/components/blocks/Quote";
import { RichText } from "@/components/blocks/RichText";
import { Services } from "@/components/blocks/Services";
import { Slider } from "@/components/blocks/Slider";
import { Testimonials } from "@/components/blocks/Testimonials";
import { TourList } from "@/components/blocks/TourList";
import { UnknownBlock } from "@/components/blocks/UnknownBlock";
import { VisionMission } from "@/components/blocks/VisionMission";
import type { PageBlock } from "@/types/blocks";

type BlockMap = {
  [K in PageBlock["__component"]]: ComponentType<
    Extract<PageBlock, { __component: K }>
  >;
};

const blockMap: BlockMap = {
  "shared.hero-banner": HeroBanner,
  "shared.services": Services,
  "shared.vision-mission": VisionMission,
  "shared.tour-list": TourList,
  "shared.testimonials": Testimonials,
  "shared.media-gallery": MediaGallery,
  "shared.slider": Slider,
  "shared.rich-text": RichText,
  "shared.quote": Quote,
  "shared.media": Media,
};

type RuntimeBlock = PageBlock | { __component: string; id: number };

function resolveBlock(
  uid: string,
): ComponentType<RuntimeBlock> {
  if (uid in blockMap) {
    return blockMap[uid as PageBlock["__component"]] as ComponentType<RuntimeBlock>;
  }
  return UnknownBlock;
}

export function BlockRenderer({ blocks }: { blocks: RuntimeBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = resolveBlock(block.__component);
        return (
          <Component
            key={`${block.__component}-${block.id}-${index}`}
            {...block}
          />
        );
      })}
    </>
  );
}

import { getStrapiMediaUrl } from "@/lib/strapi/client";
import type { StrapiMedia } from "@/types/strapi";

export function toImageProps(media: StrapiMedia) {
  return {
    src: getStrapiMediaUrl(media.url),
    alt: media.alternativeText ?? "",
    width: media.width,
    height: media.height,
  };
}

export function toAbsoluteUrl(url: string) {
  return getStrapiMediaUrl(url);
}

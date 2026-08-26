import type { Metadata } from "next";
import { toAbsoluteUrl } from "@/lib/media";
import type { Page } from "@/types/strapi";

export function toMetadata(page: Page): Metadata {
  const seo = page.seo;
  const title = seo?.metaTitle || page.title;
  const description = seo?.metaDescription;
  const shareImage = seo?.shareImage;

  return {
    title: seo?.metaTitle ? { absolute: seo.metaTitle } : page.title,
    description,
    ...(seo?.canonicalURL
      ? { alternates: { canonical: seo.canonicalURL } }
      : {}),
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    ...(shareImage
      ? {
          openGraph: {
            title,
            description,
            images: [
              {
                url: toAbsoluteUrl(shareImage.url),
                width: shareImage.width,
                height: shareImage.height,
                alt: shareImage.alternativeText ?? title,
              },
            ],
          },
        }
      : {}),
  };
}

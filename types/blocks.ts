import type { StrapiBlockNode, StrapiMedia } from "./strapi";

export type HeroBannerBlock = {
  __component: "shared.hero-banner";
  id: number;
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  background: StrapiMedia;
};

export type ServiceItem = {
  id: number;
  title: string;
  body: string;
  icon?: string | null;
};

export type ServicesBlock = {
  __component: "shared.services";
  id: number;
  heading?: string | null;
  intro?: string | null;
  items: ServiceItem[];
};

export type VisionMissionBlock = {
  __component: "shared.vision-mission";
  id: number;
  heading?: string | null;
  visionTitle: string;
  visionBody: string;
  missionTitle: string;
  missionBody: string;
  image?: StrapiMedia | null;
};

export type TourItem = {
  id: number;
  title: string;
  location: string;
  duration?: string | null;
  price?: string | null;
  excerpt?: string | null;
  href: string;
  image: StrapiMedia;
};

export type TourListBlock = {
  __component: "shared.tour-list";
  id: number;
  heading?: string | null;
  tours: TourItem[];
};

export type TestimonialQuote = {
  id: number;
  body: string;
  attribution?: string | null;
  role?: string | null;
};

export type TestimonialsBlock = {
  __component: "shared.testimonials";
  id: number;
  heading?: string | null;
  quotes: TestimonialQuote[];
};

export type MediaGalleryBlock = {
  __component: "shared.media-gallery";
  id: number;
  heading?: string | null;
  images: StrapiMedia[];
};

export type SliderSlide = {
  id: number;
  caption?: string | null;
  image: StrapiMedia;
};

export type SliderBlock = {
  __component: "shared.slider";
  id: number;
  heading?: string | null;
  slides?: SliderSlide[];
  files?: StrapiMedia[];
};

export type RichTextBlock = {
  __component: "shared.rich-text";
  id: number;
  body: string | StrapiBlockNode[];
};

export type QuoteBlock = {
  __component: "shared.quote";
  id: number;
  title?: string | null;
  body: string;
};

export type MediaBlock = {
  __component: "shared.media";
  id: number;
  file: StrapiMedia;
};

export type PageBlock =
  | HeroBannerBlock
  | ServicesBlock
  | VisionMissionBlock
  | TourListBlock
  | TestimonialsBlock
  | MediaGalleryBlock
  | SliderBlock
  | RichTextBlock
  | QuoteBlock
  | MediaBlock;

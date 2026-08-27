const blocksPopulate = [
  "populate[blocks][on][shared.hero-banner][populate]=background",
  "populate[blocks][on][shared.vision-mission][populate]=image",
  "populate[blocks][on][shared.tour-list][populate][tours][populate]=image",
  "populate[blocks][on][shared.media-gallery][populate]=images",
  "populate[blocks][on][shared.slider][populate]=files",
  "populate[blocks][on][shared.services][populate]=items",
  "populate[blocks][on][shared.testimonials][populate]=quotes",
  "populate[blocks][on][shared.rich-text]=true",
  "populate[blocks][on][shared.quote]=true",
  "populate[blocks][on][shared.media][populate]=file",
].join("&");

export const pagesPopulateQuery = [
  "populate[seo][populate]=shareImage",
  blocksPopulate,
].join("&");

export const articlesListQuery = [
  "populate[cover]=true",
  "populate[author][populate]=avatar",
  "populate[category]=true",
  "sort=publishedAt:desc",
].join("&");

export const articleBySlugQuery = [
  "populate[cover]=true",
  "populate[author][populate]=avatar",
  "populate[category]=true",
  blocksPopulate,
].join("&");

export const globalPopulateQuery = [
  "populate[favicon]=true",
  "populate[defaultSeo][populate]=shareImage",
].join("&");

export const aboutPopulateQuery = [
  "populate[about_hero][populate]=background",
  blocksPopulate,
].join("&");

export const homepagePopulateQuery = [
  "populate[home_hero][populate]=background",
  blocksPopulate,
].join("&");

export const authorsPopulateQuery = "populate=avatar";

const params = new URLSearchParams({
  "populate[seo][populate]": "shareImage",
  "populate[blocks][on][shared.hero-banner][populate]": "background",
  "populate[blocks][on][shared.vision-mission][populate]": "image",
  "populate[blocks][on][shared.tour-list][populate][tours][populate]": "image",
  "populate[blocks][on][shared.media-gallery][populate]": "images",
  "populate[blocks][on][shared.slider][populate][slides][populate]": "image",
  "populate[blocks][on][shared.services]": "true",
  "populate[blocks][on][shared.testimonials][populate]": "quotes",
  "populate[blocks][on][shared.rich-text]": "true",
});

export const pagesPopulateQuery = params.toString();

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
  "populate[blocks][populate]=*",
].join("&");

export const globalPopulateQuery = [
  "populate[favicon]=true",
  "populate[defaultSeo][populate]=shareImage",
].join("&");

export const aboutPopulateQuery = "populate[blocks][populate]=*";

export const authorsPopulateQuery = "populate=avatar";

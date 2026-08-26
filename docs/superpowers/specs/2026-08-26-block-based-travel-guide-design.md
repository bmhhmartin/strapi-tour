# Block-Based Travel Guide Frontend

Date: 2026-08-26  
Status: approved design, pending implementation plan

## Problem

Content editors will assemble travel-guide pages in Strapi 5 by adding components to a Dynamic Zone. This repo is the Next.js frontend that renders those pages. It must stay modular: each block is an independent, typed UI component; a central renderer maps Strapi `__component` keys to React components; unknown keys must not crash the page.

Strapi itself is out of scope. This app consumes a Strapi 5 REST API that may not exist yet, so local development uses typed fixtures when the CMS is unreachable.

## Constraints (decided)

- **Repo contents:** Next.js frontend only (no Strapi app, no CMS schema JSON).
- **CMS contract:** Strapi 5 flat documents (no `attributes` wrapper).
- **Data source:** live Strapi in production; in development, fall back to fixtures if the request fails.
- **Architecture:** typed component registry + optional catch-all route.
- **Styling:** Tailwind CSS.
- **Routing:** App Router, including homepage `/` and nested paths such as `/destinations/bali`.

## Architecture

Single Next.js App Router app at the repository root. Server Components fetch page data; block components are presentational and receive typed props only.

```
app/
  layout.tsx
  [[...slug]]/page.tsx
  not-found.tsx
  error.tsx
components/
  blocks/
    HeroBanner.tsx
    MediaGallery.tsx
    DestinationGrid.tsx
    Slider.tsx
    Quote.tsx
    RichText.tsx
    WhyChooseUs.tsx
    UnknownBlock.tsx
  BlockRenderer.tsx
lib/
  strapi/
    client.ts
    queries.ts
  seo.ts
  media.ts
types/
  strapi.ts
  blocks.ts
fixtures/
  pages.ts
```

**Boundaries**

- Blocks never fetch. They only render props from Strapi or fixtures.
- `BlockRenderer` is the only module that maps `__component` → React component.
- `lib/strapi/client.ts` is the only module that talks to the network or chooses fixtures.
- Homepage slug in Strapi and fixtures is `home`. The optional catch-all maps `/` to that slug.

## Types

Shared primitives live in `types/strapi.ts`. Block variants live in `types/blocks.ts` as a discriminated union on `__component`. UIDs match Strapi component names (`shared.hero-banner`, `shared.slider`, and so on).

**Media**

```ts
type StrapiMedia = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  mime: string;
};
```

**SEO (page-level component, not a Dynamic Zone block)**

```ts
type Seo = {
  metaTitle: string;
  metaDescription: string;
  shareImage?: StrapiMedia | null;
  canonicalURL?: string | null;
  noIndex?: boolean;
};
```

**Page**

```ts
type Page = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  seo?: Seo | null;
  blocks: PageBlock[];
};
```

**Blocks (discriminated union)**

| `__component` | Fields |
|---|---|
| `shared.hero-banner` | `title`, `subtitle?`, `ctaLabel?`, `ctaHref?`, `background: StrapiMedia` |
| `shared.media-gallery` | `heading?`, `images: StrapiMedia[]` |
| `shared.destination-grid` | `heading?`, `destinations` (repeatable component): `{ name, blurb, href, image }` |
| `shared.slider` | `heading?`, `slides` (repeatable component): `{ caption?, image }` |
| `shared.quote` | `body`, `attribution?` |
| `shared.rich-text` | `body: string \| StrapiBlockNode[]` — if `string`, treat as HTML; if array, render Strapi Blocks |
| `shared.why-choose-us` | `heading?`, `items` (repeatable component): `{ title, body, icon?: string }` (`icon` is a string key, not media) |

`destinations`, `slides`, and `items` are nested components in the Dynamic Zone payload, not relations to other collection types.

Every block includes `id: number` plus `__component`. `PageBlock` is the union of all seven.

Adding a block later means: add the UID to the union, add the React component, add one registry entry, and add a populate fragment if the block has relations.

## BlockRenderer

`components/BlockRenderer.tsx` holds a dictionary:

```ts
const blockMap = {
  "shared.hero-banner": HeroBanner,
  "shared.media-gallery": MediaGallery,
  "shared.destination-grid": DestinationGrid,
  "shared.slider": Slider,
  "shared.quote": Quote,
  "shared.rich-text": RichText,
  "shared.why-choose-us": WhyChooseUs,
} satisfies Record<PageBlock["__component"], ComponentType<any>>;
```

The registry is a full `Record` of the seven known UIDs so adding a union member without a component is a type error. At runtime, look up `block.__component`; if the key is absent (CMS sent an unhandled UID), render `UnknownBlock`. Keys are `${__component}-${id}`.

`UnknownBlock`: in development, show the unhandled UID; in production, render nothing. The page must not throw.

## Data fetching

**Environment (server-only)**

- `STRAPI_URL` — origin, no trailing slash (example: `http://localhost:1337`)
- `STRAPI_TOKEN` — optional API token

**Endpoint**

`GET {STRAPI_URL}/api/pages` with a slug filter and nested populate. Do not use `populate=deep`.

Homepage: `filters[slug][$eq]=home`  
Other routes: `filters[slug][$eq]={joined catch-all segments}`  
Example: `/destinations/bali` → `destinations/bali`

**Populate**

Populate `seo.shareImage` and, per Dynamic Zone component that has media/relations, an `[on][uid]` fragment:

- `shared.hero-banner` → `background`
- `shared.media-gallery` → `images`
- `shared.destination-grid` → nested destination images
- `shared.slider` → slide images
- `shared.why-choose-us`, `shared.quote`, `shared.rich-text` → no media populate

**Fallback**

1. Attempt Strapi (`fetch` with `next: { revalidate: 60 }`).
2. If the request fails and `NODE_ENV === "development"`, return the fixture whose `slug` matches.
3. Production never uses fixtures. CMS down → throw (error boundary). Missing page → `notFound()`.
4. `toPage()` maps `{ data: Page[] }` (Strapi 5) onto `Page`. Fixtures are already `Page` objects. `BlockRenderer` does not know the source.

**Fixtures**

`fixtures/pages.ts` includes at least:

- `home` — HeroBanner, WhyChooseUs, MediaGallery
- `destinations/bali` — HeroBanner, Quote, Slider

## Routing and SEO

`app/[[...slug]]/page.tsx` is an optional catch-all so `/` and nested paths share one pipeline.

- `params.slug` undefined → `home`
- `["destinations", "bali"]` → `destinations/bali`

`generateMetadata` uses `page.seo`:

- `title` ← `metaTitle`, fallback `page.title`
- `description` ← `metaDescription`
- `openGraph.images` ← absolute URL of `shareImage`
- `alternates.canonical` ← `canonicalURL` when set
- `robots.index` ← false when `noIndex` is true
- Missing page → `{ title: "Not found" }` and the page calls `notFound()`

`next.config` `images.remotePatterns` includes the Strapi host (from `STRAPI_URL`) plus a placeholder host used by fixture images. `lib/media.ts` maps `StrapiMedia` to `{ src, alt, width, height }` for `next/image`, prefixing relative Strapi paths with `STRAPI_URL`.

## Block UI (first pass)

Travel-guide tone, Tailwind only, no separate design system.

| Block | UI |
|---|---|
| HeroBanner | Full-bleed `next/image`, title, subtitle, optional CTA link |
| MediaGallery | Responsive image grid with `sizes` |
| DestinationGrid | Card grid: image, name, blurb, link |
| Slider | CSS scroll-snap carousel (image + caption); no slider library |
| Quote | Pull quote + attribution |
| RichText | Article prose (`prose`) from Blocks JSON or HTML string |
| WhyChooseUs | Heading + list of title/body items |

Empty `blocks` array: page shell and title only.

## Error matrix

| Case | Behavior |
|---|---|
| Unknown slug | `app/not-found.tsx` |
| Strapi down (development) | Matching fixture, if any; else not-found |
| Strapi down (production) | `app/error.tsx` |
| Unknown `__component` | `UnknownBlock` |
| Empty `blocks` | Title/shell only |

## Testing (this pass)

- Unit: slug join (`undefined` → `home`; segments → `"a/b"`)
- Unit: unknown `__component` selects `UnknownBlock`
- No E2E or visual regression in this pass

## Out of scope

- Strapi CMS application and content-type schema files
- Auth, i18n, draft/preview mode
- Animation-heavy carousel libraries
- Codegen from Strapi OpenAPI

## Success criteria

- `/` and `/destinations/bali` render from fixtures with no Strapi process running.
- Replacing fixture data with live API data does not require changes to `BlockRenderer` or block components.
- An unknown `__component` does not crash the page.
- `generateMetadata` reflects the page SEO component when present.
- Gallery and hero images use `next/image`.

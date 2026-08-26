# Block-Based Travel Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Next.js App Router travel-guide frontend that renders Strapi 5 Dynamic Zone pages through a typed `BlockRenderer`, with fixture fallback in development.

**Architecture:** Optional catch-all `app/[[...slug]]/page.tsx` fetches a `Page` by slug. `BlockRenderer` maps `__component` UIDs to presentational block components. `lib/strapi/client.ts` is the only network boundary; on fetch failure in development it returns typed fixtures.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, `next/image`, Vitest + Testing Library, Strapi 5 REST (flat documents).

## Global Constraints

- Next.js frontend only — no Strapi app and no CMS schema JSON.
- Strapi 5 flat documents (no `attributes` wrapper).
- Live Strapi in production; development falls back to fixtures if the request fails.
- Typed component registry + optional catch-all route.
- Tailwind CSS; travel-guide visual tone (ink, sand, terracotta, ocean teal — not generic SaaS purple).
- Homepage slug is `home`; `/` maps to that slug.
- Five primary sections: Hero banner, Services, Vision & mission, Tour list, Testimonials.
- Utility blocks: RichText, MediaGallery, Slider.
- Do not use `populate=deep`.
- Production never uses fixtures.
- Frequent commits are optional; do not commit unless the user asked.

## File map

| File | Responsibility |
|---|---|
| `types/strapi.ts` | `StrapiMedia`, `Seo`, `Page` |
| `types/blocks.ts` | Discriminated `PageBlock` union |
| `lib/slug.ts` | Catch-all params → Strapi slug |
| `lib/media.ts` | `StrapiMedia` → `next/image` props |
| `lib/seo.ts` | `Page` → `Metadata` |
| `lib/strapi/queries.ts` | Nested populate query string |
| `lib/strapi/client.ts` | Fetch page by slug + fixture fallback |
| `fixtures/pages.ts` | `home` and `destinations/bali` |
| `components/BlockRenderer.tsx` | Registry map |
| `components/blocks/*.tsx` | Presentational sections |
| `app/[[...slug]]/page.tsx` | Fetch, metadata, render |
| `app/layout.tsx` | Shell, fonts, nav |
| `app/not-found.tsx` / `app/error.tsx` | Error UI |

---

### Task 1: Scaffold Next.js app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `app/globals.css`, `.env.example`, `.gitignore`
- Keep: `docs/` spec and plan files

**Interfaces:**
- Consumes: empty repo plus existing `docs/`
- Produces: runnable Next.js App Router + Tailwind + `npm test` (Vitest)

- [ ] **Step 1: Scaffold the app in the repo root without deleting `docs/`**

If `create-next-app` refuses a non-empty directory, write the config files by hand. Use App Router, TypeScript, Tailwind, no `src/` directory, import alias `@/*`.

`package.json` scripts must include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  }
}
```

Dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.

- [ ] **Step 2: Configure Vitest**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

`vitest.setup.ts`: `import "@testing-library/jest-dom/vitest";`

- [ ] **Step 3: `next.config.ts` image remote patterns**

Allow `images.unsplash.com` (fixtures) and a Strapi host from `process.env.STRAPI_URL` (default hostname `localhost`).

- [ ] **Step 4: `.env.example`**

```
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=
```

- [ ] **Step 5: Verify scaffold**

Run: `npm test`  
Expected: Vitest starts and reports no tests (or 0 failed). `npm run build` may wait until the catch-all page exists.

---

### Task 2: Types

**Files:**
- Create: `types/strapi.ts`, `types/blocks.ts`

**Interfaces:**
- Consumes: spec field tables
- Produces: exported `StrapiMedia`, `Seo`, `Page`, `PageBlock`, and each block type

- [ ] **Step 1: `types/strapi.ts`**

```ts
export type StrapiMedia = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  mime: string;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  shareImage?: StrapiMedia | null;
  canonicalURL?: string | null;
  noIndex?: boolean;
};

export type StrapiBlockNode = {
  type: string;
  children?: StrapiBlockNode[];
  text?: string;
  [key: string]: unknown;
};

export type Page = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  seo?: Seo | null;
  blocks: import("./blocks").PageBlock[];
};
```

- [ ] **Step 2: `types/blocks.ts`**

Export `HeroBannerBlock`, `ServicesBlock`, `VisionMissionBlock`, `TourListBlock`, `TestimonialsBlock`, `MediaGalleryBlock`, `SliderBlock`, `RichTextBlock`, nested item types (`ServiceItem`, `TourItem`, `TestimonialQuote`, `SliderSlide`), and:

```ts
export type PageBlock =
  | HeroBannerBlock
  | ServicesBlock
  | VisionMissionBlock
  | TourListBlock
  | TestimonialsBlock
  | MediaGalleryBlock
  | SliderBlock
  | RichTextBlock;
```

Each block has `id: number` and the `__component` UID from the spec. Nested repeatables include `id: number`.

---

### Task 3: Slug helper (TDD)

**Files:**
- Create: `lib/slug.ts`
- Test: `lib/slug.test.ts`

**Interfaces:**
- Consumes: `slug?: string[]` from optional catch-all params
- Produces: `slugFromParams(slug: string[] | undefined): string`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { slugFromParams } from "./slug";

describe("slugFromParams", () => {
  it("maps a missing catch-all to home", () => {
    expect(slugFromParams(undefined)).toBe("home");
  });

  it("maps an empty array to home", () => {
    expect(slugFromParams([])).toBe("home");
  });

  it("joins nested segments with slashes", () => {
    expect(slugFromParams(["destinations", "bali"])).toBe("destinations/bali");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL** (module not found)

Run: `npx vitest run lib/slug.test.ts`

- [ ] **Step 3: Implement**

```ts
export function slugFromParams(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return "home";
  return slug.join("/");
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx vitest run lib/slug.test.ts`

---

### Task 4: Media + SEO helpers

**Files:**
- Create: `lib/media.ts`, `lib/seo.ts`

**Interfaces:**
- Consumes: `StrapiMedia`, `Page`
- Produces: `toImageProps(media: StrapiMedia): { src, alt, width, height }`; `toMetadata(page: Page): Metadata`

- [ ] **Step 1: `toImageProps`**

If `url` starts with `http://` or `https://`, use it as `src`. Otherwise prefix with `process.env.STRAPI_URL ?? ""`. `alt` is `alternativeText ?? ""`.

- [ ] **Step 2: `toMetadata`**

- `title` ← `seo.metaTitle` ?? `page.title`
- `description` ← `seo.metaDescription`
- `openGraph.images` ← absolute URL of `shareImage` when present
- `alternates.canonical` ← `canonicalURL` when set
- `robots: { index: false }` when `noIndex` is true

Missing page is handled in `generateMetadata`, not here.

---

### Task 5: BlockRenderer (TDD)

**Files:**
- Create: `components/BlockRenderer.tsx`, `components/blocks/UnknownBlock.tsx`, stub block components that render a `data-component` attribute
- Test: `components/BlockRenderer.test.tsx`

**Interfaces:**
- Consumes: `PageBlock[]`
- Produces: `<BlockRenderer blocks={PageBlock[]} />`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockRenderer } from "./BlockRenderer";

describe("BlockRenderer", () => {
  it("renders UnknownBlock for an unhandled __component", () => {
    const unknown = {
      __component: "shared.does-not-exist",
      id: 99,
    };
    render(
      <BlockRenderer
        blocks={[unknown as never]}
      />,
    );
    expect(screen.getByTestId("unknown-block")).toHaveAttribute(
      "data-component",
      "shared.does-not-exist",
    );
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement registry**

`blockMap` `satisfies Record<PageBlock["__component"], ComponentType<any>>`. Lookup: `blockMap[block.__component as PageBlock["__component"]] ?? UnknownBlock`. Key: `` `${block.__component}-${block.id}` ``.

`UnknownBlock` renders a `data-testid="unknown-block"` element with `data-component={__component}`. In production (`NODE_ENV === "production"`) return `null`. Tests run in development so the fallback is visible.

- [ ] **Step 4: Run — expect PASS**

Stub the eight real blocks as simple sections if needed so the registry type-checks; replace stubs in Task 7.

---

### Task 6: Fixtures + Strapi client

**Files:**
- Create: `fixtures/pages.ts`, `lib/strapi/queries.ts`, `lib/strapi/client.ts`
- Test: `lib/strapi/client.test.ts` for fixture lookup helper

**Interfaces:**
- Consumes: `Page` type, `STRAPI_URL`, `STRAPI_TOKEN`
- Produces: `getPageBySlug(slug: string): Promise<Page | null>`; `pagesPopulateQuery: string`; `getFixturePage(slug: string): Page | null`

- [ ] **Step 1: Fixtures**

`home`: HeroBanner, Services, VisionMission, TourList, Testimonials.  
`destinations/bali`: HeroBanner, TourList, Testimonials.

Use `images.unsplash.com` URLs with width/height set. Include `seo` on both pages.

- [ ] **Step 2: Populate query**

Build nested `populate` for `seo.shareImage` and `[on]` fragments for hero background, vision image, tour images, gallery images, slider images. Export as `pagesPopulateQuery`.

- [ ] **Step 3: `getPageBySlug`**

```
GET {STRAPI_URL}/api/pages?filters[slug][$eq]={slug}&{pagesPopulateQuery}
```

`fetch` with `next: { revalidate: 60 }` and optional `Authorization: Bearer ${STRAPI_TOKEN}`.

- If `!STRAPI_URL` and development → fixture (or treat missing URL as failure).
- If fetch throws or `!res.ok` and development → `getFixturePage(slug)`.
- If fetch throws or `!res.ok` and production → throw.
- If `data` is empty array → `null` (caller `notFound()`). Do not fixture a missing page when Strapi responded 200.
- `toPage(raw)` maps Strapi 5 `{ data: Page[] }` first item onto `Page`.

- [ ] **Step 4: Test `getFixturePage`**

Assert `getFixturePage("home")` is non-null and `getFixturePage("missing")` is null.

---

### Task 7: Section components

**Files:**
- Create/replace: `components/blocks/HeroBanner.tsx`, `Services.tsx`, `VisionMission.tsx`, `TourList.tsx`, `Testimonials.tsx`, `MediaGallery.tsx`, `Slider.tsx`, `RichText.tsx`
- Modify: `app/globals.css` for travel tokens

**Interfaces:**
- Consumes: matching block types; `toImageProps`
- Produces: presentational Server Components (Slider may be a Client Component only if scroll buttons need `onClick`; prefer CSS scroll-snap with no JS)

Visual rules:
- Fonts: `Newsreader` (headings) + `Outfit` (body) via `next/font/google`.
- Colors: deep ink `#14221c`, sand `#f4efe6`, terracotta `#c45c26`, ocean `#1f6f6a`.
- Each primary section uses a `<section>` with padding `py-16 md:py-24` and a max-width container.
- All photos go through `next/image`.
- Hero: min-height ~80vh, overlay gradient, CTA button terracotta.
- Services: 3-column grid of cards.
- Vision & mission: two columns + optional image.
- Tour list: card grid with image, location, duration/price.
- Testimonials: quote cards.
- Slider: horizontal `overflow-x-auto snap-x snap-mandatory`.
- RichText: `dangerouslySetInnerHTML` only when `body` is string; otherwise walk Blocks nodes to text/paragraphs. Wrap with `prose`.

---

### Task 8: App shell and catch-all route

**Files:**
- Create: `app/layout.tsx`, `app/[[...slug]]/page.tsx`, `app/not-found.tsx`, `app/error.tsx`
- Create: `components/SiteHeader.tsx`, `components/SiteFooter.tsx`

**Interfaces:**
- Consumes: `slugFromParams`, `getPageBySlug`, `toMetadata`, `BlockRenderer`
- Produces: `/` and `/destinations/bali` pages

- [ ] **Step 1: `layout.tsx`**

Root layout with fonts, `SiteHeader` (brand “Meridian Trails”, links Home + Bali), `SiteFooter`. `metadata` default title template `%s · Meridian Trails`.

- [ ] **Step 2: `page.tsx`**

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slugFromParams(slug));
  if (!page) return { title: "Not found" };
  return toMetadata(page);
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slugFromParams(slug));
  if (!page) notFound();
  return (
    <article>
      {page.blocks.length === 0 ? (
        <h1>{page.title}</h1>
      ) : null}
      <BlockRenderer blocks={page.blocks} />
    </article>
  );
}
```

`params` type: `{ slug?: string[] }` (Next.js 15+ async params).

- [ ] **Step 3: `not-found.tsx` and `error.tsx`**

Travel-toned empty and error states. `error.tsx` is a Client Component with `reset`.

---

### Task 9: Verify

- [ ] **Step 1: `npx vitest run`** — all tests pass (slug + unknown block + fixture lookup).
- [ ] **Step 2: `npm run build`** — exit 0.
- [ ] **Step 3: `npm run dev` and open `/` and `/destinations/bali` in the browser.** Confirm five homepage sections, Bali page sections, images load, unknown-block does not apply on fixture pages.
- [ ] **Step 4: Hit an unknown slug** — not-found page.

## Spec coverage

| Spec item | Task |
|---|---|
| Folder structure | 1, 2, 5–8 |
| Strapi 5 types + union | 2 |
| Registry BlockRenderer + UnknownBlock | 5 |
| Nested populate, no populate=deep | 6 |
| Fixture fallback in development | 6 |
| Optional catch-all + generateMetadata | 8 |
| Five primary sections + utilities | 7 |
| next/image | 4, 7 |
| Unit tests (slug, unknown block) | 3, 5 |

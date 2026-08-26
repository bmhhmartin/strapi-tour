import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getStrapiMediaUrl, getGlobal } from "@/lib/strapi/client";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobal();
  const seo = global.defaultSeo;
  const title = seo?.metaTitle || global.siteName;
  const description = seo?.metaDescription || global.siteDescription;
  const shareImage = seo?.shareImage;
  const favicon = global.favicon;

  return {
    title: {
      default: title,
      template: `%s · ${global.siteName}`,
    },
    description,
    ...(favicon
      ? { icons: { icon: getStrapiMediaUrl(favicon.url) } }
      : {}),
    ...(shareImage
      ? {
          openGraph: {
            title,
            description,
            images: [
              {
                url: getStrapiMediaUrl(shareImage.url),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const global = await getGlobal();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-sand font-sans text-ink">
        <SiteHeader siteName={global.siteName} />
        <main className="flex-1">{children}</main>
        <SiteFooter
          siteName={global.siteName}
          siteDescription={global.siteDescription}
        />
      </body>
    </html>
  );
}

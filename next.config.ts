import type { NextConfig } from "next";

function strapiOrigin() {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

const strapi = strapiOrigin();
const strapiHost = strapi?.hostname || "localhost";
const strapiPort = strapi?.port || "";
const strapiIsPrivate =
  strapiHost === "localhost" ||
  strapiHost === "127.0.0.1" ||
  strapiHost === "::1";

const nextConfig: NextConfig = {
  images: {
    // Strapi runs on a private IP in local development. Next 16 blocks that
    // unless this is set; production hosts with a public CMS URL stay false.
    dangerouslyAllowLocalIP: strapiIsPrivate,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "http",
        hostname: strapiHost,
        ...(strapiPort ? { port: strapiPort } : {}),
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: strapiHost,
        ...(strapiPort ? { port: strapiPort } : {}),
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;

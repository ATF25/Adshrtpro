import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const PROD_SITE_URL = "https://www.adshrtpro.com";
const LOCAL_SITE_URL = "http://localhost:3000";

const SITE_URL =
  (process.env.NODE_ENV === "production" ? PROD_SITE_URL : LOCAL_SITE_URL).replace(
    /\/$/,
    "",
  );

const STATIC_ROUTES = [
  "",
  "/about",
  "/blog",
  "/blog-post",
  "/contact",
  "/cookies",
  "/disclaimer",
  "/forgot-password",
  "/home",
  "/login",
  "/privacy",
  "/register",
  "/reset-password",
  "/sign-in",
  "/sign-up",
  "/sponsor-detail",
  "/terms",
  "/verify-email",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
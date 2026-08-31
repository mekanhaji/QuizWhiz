import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Bump this when page copy actually changes — a fresh timestamp on every
// build trains crawlers to ignore lastModified entirely.
const CONTENT_UPDATED = new Date("2026-08-31");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/quiz/new`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/quiz`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}

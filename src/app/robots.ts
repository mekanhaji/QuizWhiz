import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// Explicit welcome mat for AI assistant / answer-engine crawlers, redundant
// with the "*" allow-all but a deliberate, machine-readable GEO signal.
const AI_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: AI_USER_AGENTS,
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

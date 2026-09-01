import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://miready.vercel.app";

export const SITE_NAME = "M.I.Ready";
export const SITE_ALT_NAME = "MIReady";
export const SITE_TAGLINE = "Grind smarter, not harder.";

export const SITE_DESCRIPTION =
  "Free, no sign-up: your AI chat (ChatGPT, Claude, Le Chat, Perplexity) writes the multiple-choice questions. Adaptive review rounds re-ask what you miss until it sticks — all in your browser.";

/**
 * Next's metadata merge is shallow per top-level key — a page that sets its own
 * `openGraph` replaces the parent's whole object, not just the fields it names.
 * This helper always returns a complete `openGraph` block so every page stays
 * consistent without having to remember that rule.
 */
export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...(title ? { title } : {}),
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
  };
}

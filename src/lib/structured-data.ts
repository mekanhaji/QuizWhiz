import { SITE_ALT_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const webAppGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: SITE_ALT_NAME,
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      alternateName: SITE_ALT_NAME,
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript and localStorage",
      isAccessibleForFree: true,
      inLanguage: "en",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Builds AI prompts for ChatGPT, Claude, Le Chat and Perplexity to generate multiple-choice questions",
        "Import quiz JSON by paste or file upload",
        "Adaptive review rounds that re-ask wrong or slow answers until mastered (up to 5 rounds)",
        "Explanations shown after every answer",
        "Results with mastered count, average answer time and per-question miss history",
        "No account; quizzes stored locally in the browser",
      ],
    },
  ],
};

export type FaqItem = { q: string; a: string };

export function faqPage(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export const aboutPage = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  name: `About ${SITE_NAME}`,
  about: {
    "@id": `${SITE_URL}/#app`,
  },
};

import type { Metadata } from "next";
import { LandingPage } from "@/app/_components/landing-page";
import { JsonLd } from "@/components/json-ld";
import { buildPageMetadata, SITE_DESCRIPTION } from "@/lib/site-config";
import { faqPage, webAppGraph } from "@/lib/structured-data";
import { FAQ_ITEMS } from "@/app/_components/faq-section";

export const metadata: Metadata = buildPageMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={webAppGraph} />
      <JsonLd data={faqPage(FAQ_ITEMS)} />
      <LandingPage />
    </>
  );
}

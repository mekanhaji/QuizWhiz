import Script from "next/script";

const GA_MEASUREMENT_ID = "G-LJ5DK6B809";

/**
 * Google Analytics (gtag.js). Loaded with `afterInteractive` so it never blocks
 * first paint. GA4's enhanced measurement picks up client-side route changes on
 * its own, so no manual pageview call is needed for App Router navigation.
 */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

import type { Metadata } from "next";
// @ts-expect-error Next.js handles global CSS side-effect imports at build time.
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BrandHeader } from "@/components/brand-header";

export const metadata: Metadata = {
  title: "M.I.Ready | Test & Exam Prep | miready.vercel.app",
  description:
    "Check if you are ready for your next test or exam. grind smarter, not harder.",
  metadataBase: new URL("https://miready.vercel.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "M.I.Ready | MIReady",
    "M.I.Ready Test Prep App | MIReady Test Prep App",
    "M.I.Ready Exam Prep App | MIReady Exam Prep App",
    "M.I.Ready Test & Exam Prep App | MIReady Test & Exam Prep App",
    "M.I.Ready Test Prep App | MIReady Test Prep App",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Karla:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta
          name="google-site-verification"
          content="c6D4rOmvzTEg62pUwm0zVO7ydK2j9k-Zyd-HyVAt0dU"
        />
      </head>
      <body className="font-body antialiased">
        <BrandHeader />
        <main className="flex flex-col items-center justify-center bg-background px-4 sm:px-8 mt-2">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}

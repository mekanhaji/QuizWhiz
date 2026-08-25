import type { Metadata } from "next";
// @ts-expect-error Next.js handles global CSS side-effect imports at build time.
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BrandHeader } from "@/components/brand-header";

export const metadata: Metadata = {
  title: "MIReady",
  description: "A fun and interactive quiz app.",
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
      </head>
      <body className="font-body antialiased">
        <BrandHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

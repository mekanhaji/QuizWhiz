"use client";

import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="w-full border-b-2 border-foreground/10 bg-background">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img
            src="/logo.svg"
            alt="MIReady"
            width={84}
            height={56}
            className="h-10 w-[60px] object-contain sm:h-12 sm:w-[72px]"
          />
          <span className="font-headline text-2xl font-extrabold tracking-tight sm:text-3xl">
            MIReady
          </span>
        </Link>
      </div>
    </header>
  );
}

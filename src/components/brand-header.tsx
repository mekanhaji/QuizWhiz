"use client";

import Link from "next/link";

export function BrandHeader() {
  return (
    <div className="px-4 pt-3 sm:px-8">
      <header className="mx-auto w-full max-w-2xl rounded-[18px] border-[3px] border-foreground bg-card text-card-foreground shadow-[8px_8px_0_hsl(var(--foreground))]">
        <div className="flex w-full items-center justify-start px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src="/logo.svg"
              alt="M.I.Ready"
              className="h-4 object-contain sm:h-6"
            />
            <span className="font-headline text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="text-accent bg-primary px-1 rounded-lg">
                M.I.R
              </span>
              eady
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
}

"use client";

import Link from "next/link";

export function BrandHeader() {
  return (
    <header className="w-full bg-background">
      <main className="flex flex-col items-center justify-center bg-background">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center p-4">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src="/logo.svg"
              alt="MIReady"
              width={64}
              height={43}
              className="h-auto w-16"
            />
          </Link>
        </div>
      </main>
    </header>
  );
}

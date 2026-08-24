"use client";

import Link from "next/link";

export function GlobalLogoutHeader() {
  return (
    <header className="w-full bg-background">
      <main className="flex flex-col items-center justify-center bg-background">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center p-4">
          <Link
            href="/"
            className="text-center text-2xl font-headline font-bold text-primary dark:text-primary-foreground"
          >
            QuizWhiz
          </Link>
        </div>
      </main>
    </header>
  );
}

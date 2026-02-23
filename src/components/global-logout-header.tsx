"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export function GlobalLogoutHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <header className="w-full bg-background">
      <main className="flex flex-col items-center justify-center bg-background">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 items-center p-4">
          <div />
          <Link
            href="/"
            className="text-center text-2xl font-headline font-bold text-primary dark:text-primary-foreground"
          >
            QuizWhiz
          </Link>
          <div className="flex justify-end">
            <form action={signout}>
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </main>
    </header>
  );
}

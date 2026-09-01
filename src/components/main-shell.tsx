"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps page content. On the landing route ("/") renders a plain passthrough
 * so the landing page controls its own layout. All other routes get the
 * standard centred column with top margin.
 */
export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 sm:px-8 mt-2">
      {children}
    </div>
  );
}

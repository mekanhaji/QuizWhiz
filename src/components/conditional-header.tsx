"use client";

import { usePathname } from "next/navigation";
import { BrandHeader } from "@/components/brand-header";

/**
 * Renders BrandHeader on every route except the landing page ("/").
 * Keeping this as a thin client wrapper lets layout.tsx stay a Server Component.
 */
export function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <BrandHeader />;
}

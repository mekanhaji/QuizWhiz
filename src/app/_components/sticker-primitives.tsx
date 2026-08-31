import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared primitive: sticker-style button                             */
/* ------------------------------------------------------------------ */
export function StickerBtn({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 font-display font-bold text-[15px] rounded-[18px] border-[3px] border-foreground px-6 py-3 transition-[transform,box-shadow] duration-100 ease-out shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_hsl(var(--foreground))] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const colours =
    variant === "primary"
      ? "bg-accent text-accent-foreground"
      : "bg-card text-foreground";
  return (
    <Link href={href} className={`${base} ${colours} ${className}`}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand lockup — same mark + wordmark treatment as BrandHeader       */
/* ------------------------------------------------------------------ */
export function BrandLockup({
  markClassName = "h-6 sm:h-7",
  wordClassName = "text-[21px]",
}: {
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="M.I.Ready"
        className={`${markClassName} w-auto object-contain`}
      />
      <span
        className={`font-display font-extrabold tracking-tight leading-none ${wordClassName}`}
      >
        <span className="bg-primary text-accent px-1 rounded-lg">M.I.R</span>
        eady
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header shared across feature / how-it-works sections       */
/* ------------------------------------------------------------------ */
export function SectionHead({
  title,
  index,
}: {
  title: string;
  index: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-t-[3px] border-foreground pt-5 mb-10">
      <h2 className="font-display font-bold text-[28px] sm:text-[32px] tracking-tight mt-2">
        {title}
      </h2>
      <span className="font-code text-[12px] text-muted-foreground pt-3">
        {index}
      </span>
    </div>
  );
}

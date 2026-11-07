import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

interface LogoProps {
  href?: string;
  /** Hide the word mark (icon only), e.g. in a collapsed sidebar. */
  compact?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-[0_6px_16px_-6px_var(--brand-violet)]",
        className,
      )}
    >
      <Sparkles className="size-4.5" strokeWidth={2.25} />
    </span>
  );
}

export function Logo({ href = "/", compact, className, wordmarkClassName }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <LogoMark />
      <span
        className={cn(
          "text-[1.05rem] font-semibold tracking-tight whitespace-nowrap",
          compact && "sr-only",
          wordmarkClassName,
        )}
      >
        {siteConfig.shortName}
        <span className="text-brand-gradient"> AI</span>
      </span>
    </Link>
  );
}

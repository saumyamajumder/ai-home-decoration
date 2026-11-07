import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Construction } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface ComingSoonProps {
  phase: number;
  icon?: LucideIcon;
  title: string;
  items: string[];
}

/** Temporary empty state for pages scheduled in a later build phase. */
export function ComingSoon({ phase, icon: Icon = Construction, title, items }: ComingSoonProps) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-soft sm:px-10">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
        <Icon className="size-6" />
      </span>
      <p className="mt-5 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
        Planned for phase {phase}
      </p>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <ul className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
      <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-8 rounded-xl px-4")}>
        <ArrowLeft data-icon="inline-start" />
        Back to home
      </Link>
    </div>
  );
}

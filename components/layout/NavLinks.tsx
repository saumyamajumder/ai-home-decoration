"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { appNavItems, isActivePath } from "@/lib/navigation";

interface NavLinksProps {
  /**
   * "sidebar": icon rail by default, full labels on desktop when expanded.
   * "sheet": always full labels (mobile drawer).
   */
  mode?: "sidebar" | "sheet";
  onNavigate?: () => void;
}

export function NavLinks({ mode = "sidebar", onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  const rail = mode === "sidebar";

  return (
    <ul className="flex flex-col gap-1">
      {appNavItems.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={rail ? item.title : undefined}
              className={cn(
                "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-foreground/80 transition-colors outline-none",
                "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/40",
                active && "bg-sidebar-accent text-sidebar-accent-foreground",
                rail && "justify-center px-0 sidebar-expanded:justify-start sidebar-expanded:px-3",
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-brand-gradient"
                />
              )}
              <Icon
                className={cn(
                  "size-[1.15rem] shrink-0 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <span className={cn("truncate", rail && "sr-only sidebar-expanded:not-sr-only")}>
                {item.title}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

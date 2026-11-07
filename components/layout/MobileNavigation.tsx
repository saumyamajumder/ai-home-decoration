"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { isActivePath, mobileNavItems } from "@/lib/navigation";

/** Bottom tab bar for phones. Hidden from md up, where the sidebar takes over. */
export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {mobileNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;
          const isCreate = item.href === "/create";
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground outline-none focus-visible:bg-muted",
                  active && "text-primary",
                )}
              >
                {isCreate ? (
                  <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-[0_6px_16px_-6px_var(--brand-violet)]">
                    <Icon className="size-5" />
                  </span>
                ) : (
                  <Icon className="size-5" />
                )}
                <span className={cn(isCreate && "sr-only")}>{item.shortTitle ?? item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

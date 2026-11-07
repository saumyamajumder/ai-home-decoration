"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { appNavItems, isActivePath } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";
import { ThemeToggle } from "@/components/theme/Theme-toggle";

/** Top bar for the app workspace (dashboard, editor, etc.). */
export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = appNavItems.find((item) => isActivePath(pathname, item.href));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Phone: hamburger opens a drawer with the full navigation */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger
          className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "-ml-1.5 md:hidden")}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[82%] max-w-xs gap-0 bg-sidebar p-0">
          <SheetHeader className="h-16 justify-center border-b border-sidebar-border px-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">Move between workspace pages</SheetDescription>
            <Logo href="/dashboard" />
          </SheetHeader>
          <nav className="p-3.5">
            <NavLinks mode="sheet" onNavigate={() => setMenuOpen(false)} />
          </nav>
          <p className="mx-3.5 mt-auto mb-4 rounded-xl bg-background p-3 text-xs leading-relaxed text-muted-foreground">
            Upload a room photo in the AI Room Editor, describe the change and generate a redesign.
          </p>
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold tracking-tight sm:text-lg">
          {current?.title ?? "Workspace"}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        {current?.href !== "/create" && (
          <Link
            href="/create"
            className={cn(buttonVariants({ variant: "gradient", size: "lg" }), "hidden rounded-xl px-3.5 sm:inline-flex")}
          >
            <Plus data-icon="inline-start" />
            New design
          </Link>
        )}
        <Link
          href="/settings"
          aria-label="Account settings"
          className="ml-1 grid size-9 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
        >
          AM
        </Link>
      </div>
    </header>
  );
}

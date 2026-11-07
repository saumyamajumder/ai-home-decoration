"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Menu, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { marketingNavItems } from "@/lib/navigation";
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
import { ThemeToggle } from "@/components/theme/Theme-toggle";

/** Public marketing header (landing page). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {marketingNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "hidden rounded-xl px-3.5 sm:inline-flex")}
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className={cn(buttonVariants({ variant: "gradient", size: "lg" }), "hidden rounded-xl px-4 sm:inline-flex")}
          >
            <Upload data-icon="inline-start" />
            Upload your room
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "lg:hidden")}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm gap-0 p-0">
              <SheetHeader className="h-16 justify-center border-b px-5">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
                <Logo />
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                {marketingNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium outline-none hover:bg-muted focus-visible:bg-muted"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 border-t p-4">
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "gradient", size: "xl" }), "w-full")}
                >
                  <Upload data-icon="inline-start" />
                  Upload your room
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full")}
                >
                  <LayoutDashboard data-icon="inline-start" />
                  Open dashboard
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { Logo, LogoMark } from "@/components/layout/Logo";
import { NavLinks } from "@/components/layout/NavLinks";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * Fixed sidebar for tablet and desktop (phones use MobileNavigation).
 * - md (tablet): icon rail.
 * - lg (desktop): full width, user-collapsible back to the rail.
 * Width is driven purely by CSS (`sidebar-expanded:` variant) to avoid layout shift.
 */
export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  return (
    <aside
      aria-label="Main navigation"
      className="fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex sidebar-expanded:w-[250px]"
    >
      <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-transparent sidebar-expanded:justify-start sidebar-expanded:px-5">
        <Link
          href="/dashboard"
          aria-label="Dashboard"
          className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sidebar-expanded:hidden"
        >
          <LogoMark />
        </Link>
        <Logo href="/dashboard" className="hidden sidebar-expanded:flex" />

        {/* Collapse / expand toggle, on the sidebar edge next to the logo (desktop only; tablets use the rail). */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-1/2 -right-3.5 z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-sidebar-border bg-background text-muted-foreground shadow-soft outline-none transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 lg:grid"
        >
          <ChevronLeft className={cn("size-4 transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-expanded:px-3.5">
        <p className="mb-2 hidden px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase sidebar-expanded:block">
          Workspace
        </p>
        <NavLinks />
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3 sidebar-expanded:p-4">
        <div className="hidden rounded-2xl border border-sidebar-border bg-background p-3.5 shadow-soft sidebar-expanded:block">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI room editor
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Upload a room photo, describe the change and generate a redesign.
          </p>
        </div>

        <Link
          href="/settings"
          title="Alex Morgan — Settings"
          className="flex items-center justify-center gap-3 rounded-xl p-1.5 outline-none hover:bg-sidebar-accent/70 focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 sidebar-expanded:justify-start"
        >
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
          >
            AM
          </span>
          <span className="sr-only min-w-0 sidebar-expanded:not-sr-only">
            <span className="block truncate text-sm font-medium">Alex Morgan</span>
            <span className="block truncate text-xs text-muted-foreground">Demo account</span>
          </span>
        </Link>

      </div>
    </aside>
  );
}

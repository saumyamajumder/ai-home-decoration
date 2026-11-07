"use client";

import type { ReactNode } from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";

/**
 * Workspace chrome: fixed sidebar (md+), sticky header, bottom tab bar (phones).
 * The collapsed preference is remembered in localStorage.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useLocalStorage("hv:sidebar-collapsed", false);

  return (
    <div data-sidebar={collapsed ? "collapsed" : "expanded"} className="min-h-dvh bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:shadow-lift"
      >
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
      <div className="flex min-h-dvh flex-col transition-[padding] duration-200 md:pl-[76px] sidebar-expanded:pl-[250px]">
        <Header />
        <main id="main-content" className="flex-1 px-4 pt-6 pb-24 sm:px-6 md:pb-10 lg:px-8">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}

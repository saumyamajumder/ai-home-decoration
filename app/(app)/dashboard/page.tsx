import type { Metadata } from "next";
import Link from "next/link";
import { ImageUp, LayoutDashboard, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ComingSoon } from "@/components/shared/ComingSoon";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Dashboard" description="Your design workspace at a glance." />

      <section className="mt-8 flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-soft sm:flex-row sm:items-center sm:p-8">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white">
          <ImageUp className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">Redesign a room from a photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a photo, describe what to change and let AI edit your actual room.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/create" className={cn(buttonVariants({ variant: "gradient", size: "lg" }), "rounded-xl px-4")}>
            <ImageUp data-icon="inline-start" />
            Upload photo
          </Link>
          <Link href="/editor" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-xl px-4")}>
            <Wand2 data-icon="inline-start" />
            Open editor
          </Link>
        </div>
      </section>

      <ComingSoon
        phase={2}
        icon={LayoutDashboard}
        title="More dashboard widgets are on their way"
        items={["Recent projects", "Total designs", "Saved projects", "Recent uploads", "Popular styles"]}
      />
    </div>
  );
}

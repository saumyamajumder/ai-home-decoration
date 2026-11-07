import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-4">
      <div className="max-w-md text-center">
        <LogoMark className="mx-auto size-12" />
        <p className="mt-6 text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold">This room doesn’t exist</h1>
        <p className="mt-3 text-muted-foreground">
          The page you’re looking for was moved or never built. Let’s get you back home.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "gradient", size: "xl" }), "mt-8")}>
          <ArrowLeft data-icon="inline-start" />
          Back to home
        </Link>
      </div>
    </main>
  );
}

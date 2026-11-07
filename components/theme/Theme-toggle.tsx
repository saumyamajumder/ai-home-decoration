"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn("rounded-full text-muted-foreground hover:text-foreground", className)}
    >
      {/* CSS-only swap, so there is no hydration flash */}
      <Sun className="hidden size-[1.1rem] [.dark_&]:block" />
      <Moon className="size-[1.1rem] [.dark_&]:hidden" />
      <span className="sr-only">Toggle light and dark mode</span>
    </Button>
  );
}

"use client";

import { Loader2, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface GenerateDesignButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function GenerateDesignButton({ onClick, loading, disabled, className }: GenerateDesignButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(buttonVariants({ variant: "gradient", size: "xl" }), "w-full", className)}
    >
      {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Wand2 data-icon="inline-start" />}
      {loading ? "Generating…" : "Generate Design"}
    </button>
  );
}

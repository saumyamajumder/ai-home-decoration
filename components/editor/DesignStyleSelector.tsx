"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import { editingStyles, type EditingStyleId } from "@/lib/prompts/options";

interface DesignStyleSelectorProps {
  value: EditingStyleId | null;
  onChange: (value: EditingStyleId | null) => void;
}

/** Single-choice style picker built on native radios (arrow keys work). */
export function DesignStyleSelector({ value, onChange }: DesignStyleSelectorProps) {
  const name = useId();

  return (
    <div role="radiogroup" aria-labelledby={`${name}-label`} className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span id={`${name}-label`} className="text-sm font-semibold">
          Design style
        </span>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear style
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {editingStyles.map((style) => {
          const checked = value === style.id;
          return (
            <label
              key={style.id}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-[0.8rem] font-medium transition-colors",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                checked
                  ? "border-primary bg-secondary text-secondary-foreground"
                  : "border-border bg-background hover:border-primary/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={style.id}
                checked={checked}
                onChange={() => onChange(style.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-full ring-1 ring-black/10"
                style={{ background: `linear-gradient(135deg, ${style.swatch[0]} 50%, ${style.swatch[1]} 50%)` }}
              />
              <span className="truncate">{style.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

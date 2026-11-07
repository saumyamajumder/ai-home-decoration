"use client";

import { forwardRef, useId } from "react";
import { Eraser, Sparkles, Undo2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { PROMPT_MAX_LENGTH, PROMPT_PLACEHOLDER } from "@/lib/prompts/options";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onImprove: () => void;
  onUndoImprove?: () => void;
  /** Shown under the field after "Improve prompt" runs. */
  improveNote?: string | null;
  error?: string | null;
}

/** Large multiline instruction field with counter, clear and improve actions. */
export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  { value, onChange, onClear, onImprove, onUndoImprove, improveNote, error },
  ref,
) {
  const id = useId();
  const length = value.length;
  const ratio = length / PROMPT_MAX_LENGTH;
  const empty = value.trim().length === 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold">
          Design instructions
        </label>
        <span
          id={`${id}-count`}
          aria-live="polite"
          className={cn(
            "text-xs tabular-nums text-muted-foreground",
            ratio >= 0.9 && "text-amber-600 dark:text-amber-400",
            ratio >= 1 && "font-medium text-destructive",
          )}
        >
          {length} / {PROMPT_MAX_LENGTH}
        </span>
      </div>

      <div
        className={cn(
          "mt-2 rounded-2xl border border-input bg-background shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        )}
      >
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={PROMPT_MAX_LENGTH}
          rows={7}
          placeholder={PROMPT_PLACEHOLDER}
          aria-invalid={Boolean(error)}
          aria-describedby={[`${id}-count`, error && `${id}-error`, improveNote && `${id}-note`].filter(Boolean).join(" ")}
          className="block min-h-40 w-full resize-y rounded-t-2xl bg-transparent px-4 pt-3.5 pb-2 text-[0.95rem] leading-relaxed outline-none placeholder:text-muted-foreground/70"
        />
        <div className="flex items-center justify-between gap-2 border-t border-border/70 px-2 py-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onImprove}
              disabled={empty}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-primary outline-none hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-45"
            >
              <Sparkles className="size-3.5" />
              Improve prompt
            </button>
            {onUndoImprove && (
              <button
                type="button"
                onClick={onUndoImprove}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <Undo2 className="size-3.5" />
                Undo
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={length === 0}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-45"
          >
            <Eraser className="size-3.5" />
            Clear
          </button>
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {improveNote && !error && (
        <p id={`${id}-note`} className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {improveNote}
        </p>
      )}
    </div>
  );
});

"use client";

import { Check, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { containsSuggestion } from "@/lib/prompts/suggestions";

interface SuggestedPromptsProps {
  roomName: string;
  suggestions: string[];
  prompt: string;
  /** Called with the suggestion; the parent decides whether to add or remove it. */
  onToggle: (suggestion: string) => void;
}

/**
 * Clickable instruction chips. Clicking inserts the text into the prompt
 * (or removes it if it is already there). It never starts generation.
 */
export function SuggestedPrompts({ roomName, suggestions, prompt, onToggle }: SuggestedPromptsProps) {
  return (
    <section aria-labelledby="suggestions-title">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id="suggestions-title" className="text-sm font-semibold">
          Suggested instructions
        </h3>
        <span className="text-xs text-muted-foreground">{roomName}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Tap to add. Combine as many as you like.</p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const added = containsSuggestion(prompt, suggestion);
          return (
            <li key={suggestion}>
              <button
                type="button"
                aria-pressed={added}
                onClick={() => onToggle(suggestion)}
                className={cn(
                  "inline-flex min-h-9 items-start gap-1.5 rounded-xl border px-3 py-2 text-left text-[0.8rem] leading-snug transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                  added
                    ? "border-primary/40 bg-secondary text-secondary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-secondary/50",
                )}
              >
                {added ? (
                  <Check className="mt-px size-3.5 shrink-0 text-primary" />
                ) : (
                  <Plus className="mt-px size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span>{suggestion.replace(/\.$/, "")}</span>
                <span className="sr-only">{added ? " (added, click to remove)" : " (click to add)"}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Check, CornerDownLeft, History, Pencil, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { roomCategories } from "@/lib/catalog";
import { PROMPT_MAX_LENGTH, editingStyles } from "@/lib/prompts/options";
import type { PromptHistoryEntry } from "@/lib/prompts/history";

interface PromptHistoryProps {
  entries: PromptHistoryEntry[];
  projectId: string;
  onUse: (entry: PromptHistoryEntry) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onClear: (projectId: string | null) => void;
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function PromptHistory({ entries, projectId, onUse, onUpdate, onDelete, onClear }: PromptHistoryProps) {
  const [scope, setScope] = useState<"project" | "all">("project");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const visible = scope === "project" ? entries.filter((entry) => entry.projectId === projectId) : entries;

  const startEdit = (entry: PromptHistoryEntry) => {
    setEditingId(entry.id);
    setDraft(entry.text);
  };
  const saveEdit = () => {
    if (editingId && draft.trim()) onUpdate(editingId, draft);
    setEditingId(null);
  };

  return (
    <section aria-labelledby="history-title">
      <div className="flex items-center justify-between gap-2">
        <h3 id="history-title" className="flex items-center gap-1.5 text-sm font-semibold">
          <History className="size-4 text-muted-foreground" />
          Recent prompts
        </h3>
        <div role="group" aria-label="History scope" className="flex rounded-lg bg-muted p-0.5 text-xs">
          {(["project", "all"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={scope === value}
              onClick={() => setScope(value)}
              className={cn(
                "rounded-md px-2 py-1 font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                scope === value && "bg-background text-foreground shadow-xs",
              )}
            >
              {value === "project" ? "This project" : "All"}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-5 text-center text-xs leading-relaxed text-muted-foreground">
          Prompts you submit with Generate Design are saved here so you can reuse or edit them.
        </p>
      ) : (
        <>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
            {visible.map((entry) => {
              const room = roomCategories.find((item) => item.id === entry.roomCategory)?.name;
              const style = editingStyles.find((item) => item.id === entry.styleId)?.name;
              const isEditing = editingId === entry.id;
              return (
                <li key={entry.id} className="rounded-xl border border-border bg-background p-3">
                  {isEditing ? (
                    <div>
                      <label htmlFor={`edit-${entry.id}`} className="sr-only">
                        Edit saved prompt
                      </label>
                      <textarea
                        id={`edit-${entry.id}`}
                        value={draft}
                        maxLength={PROMPT_MAX_LENGTH}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") setEditingId(null);
                          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) saveEdit();
                        }}
                        rows={3}
                        autoFocus
                        className="block w-full resize-y rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/25"
                      />
                      <div className="mt-2 flex justify-end gap-1">
                        <IconButton label="Cancel editing" onClick={() => setEditingId(null)}>
                          <X />
                        </IconButton>
                        <IconButton label="Save prompt" onClick={saveEdit} disabled={!draft.trim()} tone="primary">
                          <Check />
                        </IconButton>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="line-clamp-3 text-sm leading-relaxed">{entry.text}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-[11px] text-muted-foreground">
                          {[room, style, scope === "all" ? entry.projectName : null, dateFormat.format(new Date(entry.updatedAt))]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <div className="flex shrink-0 gap-0.5">
                          <IconButton label="Use this prompt" onClick={() => onUse(entry)} tone="primary">
                            <CornerDownLeft />
                          </IconButton>
                          <IconButton label="Edit this prompt" onClick={() => startEdit(entry)}>
                            <Pencil />
                          </IconButton>
                          <IconButton label="Delete this prompt" onClick={() => onDelete(entry.id)} tone="danger">
                            <Trash2 />
                          </IconButton>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => onClear(scope === "project" ? projectId : null)}
            className="mt-2 text-xs font-medium text-muted-foreground hover:text-destructive"
          >
            {scope === "project" ? "Clear this project’s history" : "Clear all history"}
          </button>
        </>
      )}
    </section>
  );
}

function IconButton({
  label,
  onClick,
  children,
  disabled,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  tone?: "default" | "primary" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-40 [&_svg]:size-3.5",
        tone === "primary" && "hover:text-primary",
        tone === "danger" && "hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}

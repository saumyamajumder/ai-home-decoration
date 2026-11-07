"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  PROMPT_HISTORY_KEY,
  addHistoryEntry,
  clearHistoryForProject,
  removeHistoryEntry,
  updateHistoryEntry,
  type PromptHistoryEntry,
} from "@/lib/prompts/history";

const EMPTY: PromptHistoryEntry[] = [];

/**
 * Prompt history persisted in localStorage.
 * The returned API (entries/add/update/remove/clear) is the seam for a future
 * Supabase-backed implementation; components never touch storage directly.
 */
export function usePromptHistory() {
  const [stored, setEntries] = useLocalStorage<PromptHistoryEntry[]>(PROMPT_HISTORY_KEY, EMPTY);
  const entries = Array.isArray(stored) ? stored : EMPTY;

  const add = useCallback(
    (input: Omit<PromptHistoryEntry, "id" | "createdAt" | "updatedAt">) =>
      setEntries((current) => addHistoryEntry(Array.isArray(current) ? current : [], input)),
    [setEntries],
  );
  const update = useCallback(
    (id: string, text: string) => setEntries((current) => updateHistoryEntry(current, id, text)),
    [setEntries],
  );
  const remove = useCallback(
    (id: string) => setEntries((current) => removeHistoryEntry(current, id)),
    [setEntries],
  );
  const clear = useCallback(
    (projectId: string | null) => setEntries((current) => clearHistoryForProject(current, projectId)),
    [setEntries],
  );

  return { entries, add, update, remove, clear };
}

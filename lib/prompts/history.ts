import type { RoomCategoryId } from "@/lib/catalog";
import type { EditingStyleId } from "@/lib/prompts/options";

export interface PromptHistoryEntry {
  id: string;
  text: string;
  roomCategory: RoomCategoryId;
  styleId: EditingStyleId | null;
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

export const PROMPT_HISTORY_KEY = "hv:prompt-history";
export const PROMPT_HISTORY_LIMIT = 30;

/*
 * Pure state transitions. The localStorage hook uses these today; a Supabase
 * repository (table `prompt_history`, same columns in snake_case) can reuse
 * them for optimistic updates later.
 */

export function addHistoryEntry(
  entries: PromptHistoryEntry[],
  input: Omit<PromptHistoryEntry, "id" | "createdAt" | "updatedAt">,
  now = new Date().toISOString(),
  id: string = crypto.randomUUID(),
): PromptHistoryEntry[] {
  const text = input.text.trim();
  const existing = entries.find(
    (entry) => entry.projectId === input.projectId && entry.text.trim().toLowerCase() === text.toLowerCase(),
  );
  // Same prompt in the same project: move it to the top instead of duplicating.
  if (existing) {
    const updated = { ...existing, ...input, text, updatedAt: now };
    return [updated, ...entries.filter((entry) => entry.id !== existing.id)];
  }
  const entry: PromptHistoryEntry = { ...input, text, id, createdAt: now, updatedAt: now };
  return [entry, ...entries].slice(0, PROMPT_HISTORY_LIMIT);
}

export function updateHistoryEntry(
  entries: PromptHistoryEntry[],
  id: string,
  text: string,
  now = new Date().toISOString(),
) {
  return entries.map((entry) => (entry.id === id ? { ...entry, text: text.trim(), updatedAt: now } : entry));
}

export function removeHistoryEntry(entries: PromptHistoryEntry[], id: string) {
  return entries.filter((entry) => entry.id !== id);
}

export function clearHistoryForProject(entries: PromptHistoryEntry[], projectId: string | null) {
  return projectId === null ? [] : entries.filter((entry) => entry.projectId !== projectId);
}

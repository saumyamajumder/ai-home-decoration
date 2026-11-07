/** Design styles offered in the AI editor (used by the prompt builder later). */
export const editingStyles = [
  { id: "modern", name: "Modern", swatch: ["#d6d3cf", "#2b2b2e"] },
  { id: "minimalist", name: "Minimalist", swatch: ["#f4f2ee", "#c9c4bb"] },
  { id: "luxury", name: "Luxury", swatch: ["#1f2a37", "#c9a45c"] },
  { id: "scandinavian", name: "Scandinavian", swatch: ["#f3efe7", "#c8a77e"] },
  { id: "contemporary", name: "Contemporary", swatch: ["#e9e6e1", "#e2b33b"] },
  { id: "traditional", name: "Traditional", swatch: ["#e7dccb", "#7a4b32"] },
  { id: "industrial", name: "Industrial", swatch: ["#8d8a86", "#3b3633"] },
  { id: "rustic", name: "Rustic", swatch: ["#c9a27a", "#6b4a2f"] },
] as const;

export type EditingStyleId = (typeof editingStyles)[number]["id"];

export const PROMPT_MAX_LENGTH = 1000;
export const PROMPT_MIN_LENGTH = 10;

export const PROMPT_PLACEHOLDER =
  "Describe how you want to transform your room. Example: Add a modern built-in oven below the countertop, install white cabinets and keep the existing kitchen layout unchanged.";

export type PromptValidation =
  | { ok: true }
  | { ok: false; message: string };

export function validatePrompt(prompt: string): PromptValidation {
  const text = prompt.trim();
  if (!text) {
    return { ok: false, message: "Describe at least one change, or pick a suggestion below." };
  }
  if (text.length < PROMPT_MIN_LENGTH) {
    return {
      ok: false,
      message: `Add a little more detail (at least ${PROMPT_MIN_LENGTH} characters) so the AI knows what to change.`,
    };
  }
  if (text.length > PROMPT_MAX_LENGTH) {
    return { ok: false, message: `Keep instructions under ${PROMPT_MAX_LENGTH} characters.` };
  }
  return { ok: true };
}

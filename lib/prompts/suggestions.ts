import type { RoomCategoryId } from "@/lib/catalog";

/**
 * Ready-made instructions per room category. Clicking one inserts it into the
 * prompt editor; nothing is generated until the user presses Generate Design.
 */
export const promptSuggestions: Record<RoomCategoryId, string[]> = {
  kitchen: [
    "Add a built-in oven below the kitchen countertop.",
    "Place a dustbin underneath the sink.",
    "Add a modern chimney above the cooking area.",
    "Change kitchen cabinets to white.",
    "Replace the countertop with black granite.",
    "Add modern wooden cabinets.",
    "Add a refrigerator beside the kitchen cabinets.",
    "Add modern under-cabinet lighting.",
    "Replace existing kitchen tiles.",
    "Create a luxury modular kitchen.",
  ],
  bedroom: [
    "Add a modern king-size bed.",
    "Add a wardrobe with sliding doors.",
    "Change the wall colour to beige.",
    "Add LED lighting behind the bed.",
    "Add modern bedside tables.",
    "Create a luxury bedroom design.",
  ],
  "living-room": [
    "Add a modern L-shaped sofa.",
    "Add a wall-mounted television.",
    "Add a modern TV cabinet.",
    "Change the wall design.",
    "Add decorative lighting.",
    "Create a minimalist living room.",
  ],
  bathroom: [
    "Add a modern vanity unit.",
    "Install a glass shower enclosure.",
    "Add a modern mirror with LED lighting.",
    "Replace the existing tiles.",
    "Add a wall-mounted storage cabinet.",
  ],
  "dining-room": [
    "Add a six-seater wooden dining table.",
    "Add a statement pendant light above the table.",
    "Add a sideboard against the wall.",
    "Change the dining chairs to upholstered chairs.",
    "Add a large mirror on the main wall.",
  ],
  office: [
    "Add a wooden desk facing the window.",
    "Add an ergonomic office chair.",
    "Add floor-to-ceiling bookshelves.",
    "Add a warm desk lamp and soft task lighting.",
    "Add indoor plants beside the desk.",
  ],
  garden: [
    "Add a stone pathway through the lawn.",
    "Add an outdoor seating area with a pergola.",
    "Add flower beds along the borders.",
    "Add warm outdoor string lights.",
    "Add a small water feature.",
  ],
  exterior: [
    "Change the facade colour to warm white.",
    "Add wooden cladding to the front wall.",
    "Add modern outdoor wall lights.",
    "Replace the front door with a modern wooden door.",
    "Add planters beside the entrance.",
  ],
};

/** Collapse whitespace so inserted/removed sentences never leave gaps. */
export function normalizeSpacing(text: string) {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function containsSuggestion(prompt: string, suggestion: string) {
  return prompt.toLowerCase().includes(suggestion.toLowerCase());
}

/** Append a suggestion to the prompt, separated by a space. */
export function appendSuggestion(prompt: string, suggestion: string) {
  const base = prompt.trimEnd();
  if (!base) return suggestion;
  const needsPeriod = !/[.!?]$/.test(base);
  return `${base}${needsPeriod ? "." : ""} ${suggestion}`;
}

/** Remove a previously inserted suggestion (case-insensitive). */
export function removeSuggestion(prompt: string, suggestion: string) {
  const index = prompt.toLowerCase().indexOf(suggestion.toLowerCase());
  if (index === -1) return prompt;
  return normalizeSpacing(prompt.slice(0, index) + prompt.slice(index + suggestion.length));
}

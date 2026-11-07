/**
 * Local, rule-based prompt clean-up. It does not call any AI service.
 * Once Gemini is configured this can be swapped for an API call with the same
 * signature; the UI only depends on `improvePrompt(text, context)`.
 */
export interface ImproveContext {
  roomName?: string;
  styleName?: string;
}

export interface ImproveResult {
  text: string;
  /** Human-readable list of what changed, for the UI. */
  changes: string[];
}

const PRESERVE_PATTERN = /\b(keep|preserve|maintain|unchanged|retain)\b/i;

function toSentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
}

function tidySentence(sentence: string) {
  let s = sentence.replace(/\s+/g, " ").replace(/\s+([,.!?])/g, "$1");
  s = s.replace(/[\s,;:]+$/, "");
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.!?]$/.test(s)) s += ".";
  return s;
}

export function improvePrompt(text: string, context: ImproveContext = {}): ImproveResult {
  const changes: string[] = [];
  const original = toSentences(text);

  const seen = new Set<string>();
  const sentences: string[] = [];
  for (const raw of original) {
    const tidy = tidySentence(raw);
    const key = tidy.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    if (seen.has(key)) continue;
    seen.add(key);
    sentences.push(tidy);
  }
  if (sentences.length < original.length) changes.push("Removed duplicate instructions");

  const tidied = sentences.join(" ");
  if (tidied !== text.trim().replace(/\s+/g, " ")) changes.push("Tidied punctuation and spacing");

  const room = context.roomName?.toLowerCase();
  const style = context.styleName;

  if (style && !tidied.toLowerCase().includes(style.toLowerCase())) {
    sentences.push(`Use a ${style.toLowerCase()} design style${room ? ` suited to a ${room}` : ""}.`);
    changes.push(`Added the ${style} style`);
  }

  if (!PRESERVE_PATTERN.test(tidied)) {
    sentences.push(
      `Keep the existing ${room ?? "room"} layout, walls and camera perspective unchanged.`,
    );
    changes.push("Asked the AI to keep the existing layout");
  }

  if (!/photorealistic|realistic/i.test(tidied)) {
    sentences.push("Make the result photorealistic with natural lighting.");
    changes.push("Requested a photorealistic result");
  }

  return { text: sentences.join(" "), changes };
}

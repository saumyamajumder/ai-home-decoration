/**
 * Turns the user's request plus Gemini's structured edit plan into the final
 * instruction sent to the image-editing model. Pure function: easy to test.
 */

export interface EditChange {
  /** The object or surface being changed, e.g. "lower cabinets". */
  target: string;
  /** add | replace | recolor | remove | move | modify */
  action: string;
  /** Exact position, material, colour and style. */
  details: string;
}

export interface EditPlan {
  summary: string;
  changes: EditChange[];
  /** Things that must stay exactly as in the photo. */
  preserve: string[];
}

export const editPlanJsonSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    changes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          target: { type: "string" },
          action: { type: "string", enum: ["add", "replace", "recolor", "remove", "move", "modify"] },
          details: { type: "string" },
        },
        required: ["target", "action", "details"],
      },
    },
    preserve: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "changes", "preserve"],
} as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function parseEditPlan(raw: unknown): EditPlan | null {
  if (!isObject(raw) || !Array.isArray(raw.changes)) return null;
  const changes = raw.changes
    .filter(isObject)
    .map((c) => ({ target: str(c.target), action: str(c.action) || "modify", details: str(c.details) }))
    .filter((c) => c.target && c.details);
  if (changes.length === 0) return null;
  return {
    summary: str(raw.summary),
    changes,
    preserve: Array.isArray(raw.preserve) ? raw.preserve.map(str).filter(Boolean) : [],
  };
}

export interface BuildPromptInput {
  plan: EditPlan;
  roomName: string;
  styleName?: string | null;
}

/** Final instruction for the image model: precise edits, strong preservation, photorealism. */
export function buildImageEditPrompt({ plan, roomName, styleName }: BuildPromptInput): string {
  const lines = [
    `Edit this photograph of a ${roomName.toLowerCase()}. Apply ONLY the following changes:`,
    ...plan.changes.map((c, i) => `${i + 1}. ${capitalize(c.action)} ${c.target}: ${c.details}`),
  ];
  if (styleName) lines.push(`New or changed elements should follow a ${styleName.toLowerCase()} interior style.`);
  lines.push(
    "Keep everything else exactly as in the original photo:",
    ...[
      "the same room layout, walls, doors and windows",
      "the same camera position, angle, lens and framing",
      "the same lighting direction and colour temperature",
      ...plan.preserve,
    ].map((p) => `- ${p}`),
    "The result must be a photorealistic photograph with correct perspective, scale, shadows and reflections. Do not add text, watermarks or borders.",
  );
  return lines.join("\n");
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

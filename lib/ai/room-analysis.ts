import type { RoomCategoryId } from "@/lib/catalog";

/**
 * Structured result of analysing a room photo. Shared by the API route (which
 * asks Gemini for exactly this shape) and the browser (which renders it).
 */

export const ROOM_TYPES = [
  "kitchen",
  "bedroom",
  "living-room",
  "bathroom",
  "dining-room",
  "office",
  "garden",
  "exterior",
  "other",
] as const satisfies readonly (RoomCategoryId | "other")[];
export type DetectedRoomType = (typeof ROOM_TYPES)[number];

export const ROOM_ELEMENT_KEYS = [
  "cabinets",
  "sink",
  "oven",
  "refrigerator",
  "countertop",
  "walls",
  "flooring",
  "doors",
  "windows",
  "lighting",
] as const;
export type RoomElementKey = (typeof ROOM_ELEMENT_KEYS)[number];

export interface RoomElement {
  present: boolean;
  /** Material, colour, style and position, or why it is not visible. */
  description: string;
}

export interface FurnitureItem {
  name: string;
  description: string;
  location: string;
}

export interface RoomAnalysis {
  roomType: DetectedRoomType;
  /** 0–1 */
  confidence: number;
  summary: string;
  layout: { type: string; description: string };
  elements: Record<RoomElementKey, RoomElement>;
  furniture: FurnitureItem[];
  camera: { perspective: string; lighting: string };
  /** Things an edit should keep fixed to stay faithful to the original photo. */
  preserveNotes: string[];
}

const elementSchema = {
  type: "object",
  properties: {
    present: { type: "boolean" },
    description: { type: "string" },
  },
  required: ["present", "description"],
};

/** JSON Schema sent to Gemini as `responseJsonSchema`. */
export const roomAnalysisJsonSchema = {
  type: "object",
  properties: {
    roomType: { type: "string", enum: [...ROOM_TYPES] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    summary: { type: "string" },
    layout: {
      type: "object",
      properties: { type: { type: "string" }, description: { type: "string" } },
      required: ["type", "description"],
    },
    elements: {
      type: "object",
      properties: Object.fromEntries(ROOM_ELEMENT_KEYS.map((key) => [key, elementSchema])),
      required: [...ROOM_ELEMENT_KEYS],
    },
    furniture: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, description: { type: "string" }, location: { type: "string" } },
        required: ["name", "description", "location"],
      },
    },
    camera: {
      type: "object",
      properties: { perspective: { type: "string" }, lighting: { type: "string" } },
      required: ["perspective", "lighting"],
    },
    preserveNotes: { type: "array", items: { type: "string" } },
  },
  required: ["roomType", "confidence", "summary", "layout", "elements", "furniture", "camera", "preserveNotes"],
} as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const str = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : fallback);

/**
 * Validates and normalises the model's JSON. Returns null when the core fields
 * are missing so the caller can report an invalid response instead of guessing.
 */
export function parseRoomAnalysis(raw: unknown): RoomAnalysis | null {
  if (!isObject(raw) || !isObject(raw.elements) || typeof raw.roomType !== "string") return null;
  const roomType = (ROOM_TYPES as readonly string[]).includes(raw.roomType) ? (raw.roomType as DetectedRoomType) : "other";
  const rawElements = raw.elements;
  const elements = Object.fromEntries(
    ROOM_ELEMENT_KEYS.map((key) => {
      const el = rawElements[key];
      return [key, isObject(el) ? { present: el.present === true, description: str(el.description) } : { present: false, description: "" }];
    }),
  ) as Record<RoomElementKey, RoomElement>;
  const layout = isObject(raw.layout) ? raw.layout : {};
  const camera = isObject(raw.camera) ? raw.camera : {};
  const confidence = typeof raw.confidence === "number" ? Math.min(1, Math.max(0, raw.confidence)) : 0;

  return {
    roomType,
    confidence,
    summary: str(raw.summary),
    layout: { type: str(layout.type, "unknown"), description: str(layout.description) },
    elements,
    furniture: Array.isArray(raw.furniture)
      ? raw.furniture.filter(isObject).map((f) => ({ name: str(f.name), description: str(f.description), location: str(f.location) })).filter((f) => f.name)
      : [],
    camera: { perspective: str(camera.perspective), lighting: str(camera.lighting) },
    preserveNotes: Array.isArray(raw.preserveNotes) ? raw.preserveNotes.map((n) => str(n)).filter(Boolean) : [],
  };
}

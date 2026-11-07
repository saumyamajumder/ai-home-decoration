import type { RoomCategoryId } from "@/lib/catalog";
import type { RoomAnalysis } from "@/lib/ai/room-analysis";
import type { EditPlan } from "@/lib/ai/prompt-builder";
import type { EditingStyleId } from "@/lib/prompts/options";

/** Browser-side helpers for the editor API routes. No secrets here: the server holds all keys. */

export interface ApiFailure {
  ok: false;
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

async function postForm<T>(url: string, form: FormData, signal?: AbortSignal): Promise<({ ok: true } & T) | ApiFailure> {
  let response: Response;
  try {
    response = await fetch(url, { method: "POST", body: form, signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return { ok: false, status: 0, code: "network_error", message: "Could not reach the server. Check your connection and try again." };
  }
  const body = await response.json().catch(() => null);
  if (!response.ok || !body) {
    return {
      ok: false,
      status: response.status,
      code: body?.error?.code ?? "internal_error",
      message: body?.error?.message ?? `The server returned an error (${response.status}).`,
      details: body?.error?.details,
    };
  }
  return { ok: true, ...(body as T) };
}

export function analyzeImage(image: Blob, roomCategory: RoomCategoryId, signal?: AbortSignal) {
  const form = new FormData();
  form.append("image", image, "room");
  form.append("roomCategory", roomCategory);
  return postForm<{ analysis: RoomAnalysis; model: string }>("/api/analyze-image", form, signal);
}

export interface GenerateDesignInput {
  image: Blob;
  prompt: string;
  roomCategory: RoomCategoryId;
  styleId: EditingStyleId | null;
}

export interface GenerateDesignResult {
  image: { data: string; mimeType: string };
  plan: EditPlan;
  instruction: string;
  note: string | null;
  models: { planning: string; image: string };
}

export function generateDesign(input: GenerateDesignInput, signal?: AbortSignal) {
  const form = new FormData();
  form.append("image", input.image, "room");
  form.append("prompt", input.prompt);
  form.append("roomCategory", input.roomCategory);
  if (input.styleId) form.append("styleId", input.styleId);
  return postForm<GenerateDesignResult>("/api/generate-design", form, signal);
}

export function base64ToBlob(data: string, mimeType: string): Blob {
  const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: mimeType });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

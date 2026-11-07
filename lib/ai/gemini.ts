import "server-only";

import { ApiError as GeminiApiError, GoogleGenAI, type GenerateContentParameters, type GenerateContentResponse } from "@google/genai";

import { ApiError } from "@/lib/server/api-error";
import { getGeminiConfig, getImageModel, type GeminiConfig } from "@/lib/server/env";
import { parseRoomAnalysis, roomAnalysisJsonSchema, type RoomAnalysis } from "@/lib/ai/room-analysis";
import { editPlanJsonSchema, parseEditPlan, type EditPlan } from "@/lib/ai/prompt-builder";
import type { ImageInput } from "@/lib/server/image-input";

const TEXT_TIMEOUT_MS = 30_000;
const IMAGE_TIMEOUT_MS = 100_000;

let client: { key: string; ai: GoogleGenAI } | null = null;

function getClient(): { ai: GoogleGenAI; config: GeminiConfig } {
  const config = getGeminiConfig();
  if (!config) {
    throw new ApiError(503, "not_configured", "Gemini is not configured. Set GEMINI_API_KEY and GEMINI_MODEL in .env.local and restart the server.", {
      service: "gemini",
    });
  }
  if (client?.key !== config.apiKey) client = {
      key: config.apiKey,
      ai: new GoogleGenAI({
        apiKey: config.apiKey,
        // No SDK-level retries: quota errors never succeed on retry, and overloads are
        // handled by falling back to GEMINI_FALLBACK_MODEL (see generateWithFallback).
        httpOptions: { timeout: TEXT_TIMEOUT_MS, retryOptions: { attempts: 1 } },
      }),
    };
  return { ai: client.ai, config };
}

/** Maps SDK failures to user-safe errors. Never includes the API key or raw upstream payloads. */
export function toGeminiError(error: unknown, model: string): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof GeminiApiError) {
    const retry = /retry in ([\dhms.]+)/i.exec(error.message)?.[1];
    switch (error.status) {
      case 400:
        if (/api key/i.test(error.message)) break;
        return new ApiError(502, "upstream_error", "Gemini could not process this image. Try a different photo.", { service: "gemini" });
      case 404:
        return new ApiError(503, "not_configured", `The Gemini model “${model}” is not available to this API key. Update GEMINI_MODEL.`, {
          service: "gemini",
          model,
        });
      case 429:
        if (/limit: ?0\b/.test(error.message)) {
          return new ApiError(
            402,
            "quota_exceeded",
            `Your Gemini API key has no quota for “${model}”. Image generation is not included in the free tier: enable billing for this project in Google AI Studio, then try again.`,
            { service: "gemini", model, billingRequired: true },
          );
        }
        return new ApiError(429, "quota_exceeded", "The Gemini quota for this API key is used up. Try again later or enable billing in Google AI Studio.", {
          service: "gemini",
          model,
          ...(retry ? { retryAfter: retry } : {}),
        });
    }
    if (error.status === 401 || error.status === 403 || /api key/i.test(error.message)) {
      return new ApiError(503, "not_configured", "Gemini rejected the API key. Check GEMINI_API_KEY.", { service: "gemini" });
    }
    if (isTransient(error)) {
      return new ApiError(503, "upstream_error", "Gemini is under high demand right now (a temporary Google-side issue). Try again in a minute.", {
        service: "gemini",
        model,
        status: error.status,
      });
    }
    return new ApiError(502, "upstream_error", "Gemini is unavailable right now. Try again shortly.", { service: "gemini", status: error.status });
  }
  if (isTransient(error)) {
    return new ApiError(504, "upstream_error", "Gemini took too long to respond. Try again in a minute.", { service: "gemini", model });
  }
  console.error("[gemini] unexpected error", error);
  return new ApiError(502, "upstream_error", "Could not reach Gemini. Check the server’s network connection.", { service: "gemini" });
}

/** Overloaded, unavailable or timed out: worth trying another model. */
function isTransient(error: unknown): boolean {
  if (error instanceof GeminiApiError) return [500, 502, 503, 504].includes(error.status);
  return error instanceof Error && /abort|timeout|timed out/i.test(`${error.name} ${error.message}`);
}

/** Calls the main text model, then GEMINI_FALLBACK_MODEL if the main one is overloaded or out of quota. */
async function generateWithFallback(
  ai: GoogleGenAI,
  config: GeminiConfig,
  request: Omit<GenerateContentParameters, "model">,
): Promise<{ response: GenerateContentResponse; model: string }> {
  const models = [...new Set([config.model, ...config.fallbackModels])];
  let lastError: unknown;
  for (const model of models) {
    try {
      return { response: await ai.models.generateContent({ ...request, model }), model };
    } catch (error) {
      lastError = error;
      // Overloaded/timed out, or this model's quota is used up (quotas are per model).
      const quota = error instanceof GeminiApiError && error.status === 429;
      if (!isTransient(error) && !quota) throw toGeminiError(error, model);
      console.warn(`[gemini] ${model} unavailable (${error instanceof GeminiApiError ? error.status : "timeout"}), trying fallback`);
    }
  }
  throw toGeminiError(lastError, models.at(-1) ?? config.model);
}

const ANALYSIS_INSTRUCTIONS = `You are an interior-design assistant analysing a single room photograph for an AI photo editor.
Describe only what is actually visible. Never invent objects.
- roomType: the best matching room type; "other" if none fit.
- confidence: 0–1 confidence in roomType.
- layout: the floor-plan shape (e.g. L-shaped, U-shaped, galley, island, open-plan, rectangular) and how the space is arranged.
- elements: for each key, present=true only if it is visible, and describe material, colour, style and position. If not visible, present=false and say so briefly. "oven" includes ranges and cooktops.
- furniture: every visible furniture item (also appliances not covered by elements) with its location in the frame.
- camera: viewpoint/angle and the lighting conditions.
- preserveNotes: short constraints an edit must respect to keep the photo realistic (fixed walls, window positions, perspective, light direction).`;

export async function analyzeRoomImage(image: ImageInput, roomHint?: string): Promise<{ analysis: RoomAnalysis; model: string }> {
  const { ai, config } = getClient();
  try {
    const { response, model } = await generateWithFallback(ai, config, {
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: image.mimeType, data: Buffer.from(image.bytes).toString("base64") } },
            { text: roomHint ? `The user says this is a ${roomHint}. Verify it from the photo.` : "Analyse this room photo." },
          ],
        },
      ],
      config: {
        systemInstruction: ANALYSIS_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseJsonSchema: roomAnalysisJsonSchema,
        temperature: 0.2,
      },
    });

    if (response.promptFeedback?.blockReason) {
      throw new ApiError(422, "upstream_error", "Gemini declined to analyse this image.", { reason: response.promptFeedback.blockReason });
    }
    let raw: unknown;
    try {
      raw = JSON.parse(response.text ?? "");
    } catch {
      throw new ApiError(502, "invalid_upstream_response", "Gemini returned an unreadable analysis. Try again.");
    }
    const analysis = parseRoomAnalysis(raw);
    if (!analysis) throw new ApiError(502, "invalid_upstream_response", "Gemini returned an incomplete analysis. Try again.");
    return { analysis, model };
  } catch (error) {
    throw toGeminiError(error, config.model);
  }
}

const imagePart = (image: ImageInput) => ({
  inlineData: { mimeType: image.mimeType, data: Buffer.from(image.bytes).toString("base64") },
});

const PLAN_INSTRUCTIONS = `You prepare precise editing instructions for an AI photo editor working on a real room photograph.
Read the user's request and look at the photo. Produce:
- summary: one sentence describing the intended result.
- changes: one entry per requested change. "target" names the object/surface; "details" gives the exact position relative to
  visible objects in THIS photo (e.g. "below the countertop, left of the dishwasher"), plus material, colour, size and style.
  Only include changes the user asked for. Do not invent extra changes.
- preserve: specific visible things in this photo that must stay unchanged (fixtures, appliances, walls, windows, flooring, decor).`;

/** Step 1: Gemini (text/vision) turns the free-text request into a structured plan grounded in the photo. */
export async function prepareEditPlan(
  image: ImageInput,
  input: { prompt: string; roomName: string; styleName?: string | null },
): Promise<{ plan: EditPlan; model: string }> {
  const { ai, config } = getClient();
  try {
    const { response, model } = await generateWithFallback(ai, config, {
      contents: [
        {
          role: "user",
          parts: [
            imagePart(image),
            {
              text: `Room: ${input.roomName}.${input.styleName ? ` Preferred style: ${input.styleName}.` : ""}\nUser request: ${input.prompt}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: PLAN_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseJsonSchema: editPlanJsonSchema,
        temperature: 0.2,
      },
    });
    let raw: unknown;
    try {
      raw = JSON.parse(response.text ?? "");
    } catch {
      throw new ApiError(502, "invalid_upstream_response", "Gemini returned unreadable editing instructions. Try again.");
    }
    const plan = parseEditPlan(raw);
    if (!plan) {
      throw new ApiError(422, "bad_request", "Gemini could not find a concrete change in your instructions. Describe what to add, remove or change.");
    }
    return { plan, model };
  } catch (error) {
    throw toGeminiError(error, config.model);
  }
}

/** Step 2: the image-editing model edits the actual photo. Returns the real model output only. */
export async function generateEditedImage(
  image: ImageInput,
  instruction: string,
): Promise<{ bytes: Buffer; mimeType: string; model: string; note: string | null }> {
  const { ai } = getClient();
  const model = getImageModel();
  if (!model) {
    throw new ApiError(
      503,
      "not_configured",
      "Image generation is not configured. Set GEMINI_IMAGE_MODEL to an image-editing model (for example gemini-3.1-flash-image) and restart the server.",
      { service: "image-generation" },
    );
  }
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [imagePart(image), { text: instruction }] }],
      config: { responseModalities: ["IMAGE", "TEXT"], httpOptions: { timeout: IMAGE_TIMEOUT_MS, retryOptions: { attempts: 1 } } },
    });
    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];
    const out = parts.find((p) => p.inlineData?.data);
    if (!out?.inlineData?.data) {
      const reason = response.promptFeedback?.blockReason ?? candidate?.finishReason;
      throw new ApiError(502, "invalid_upstream_response", "The image model did not return an image. Try rephrasing your instructions.", {
        reason: reason ?? null,
      });
    }
    const note = parts.map((p) => p.text?.trim()).filter(Boolean).join(" ") || null;
    return { bytes: Buffer.from(out.inlineData.data, "base64"), mimeType: out.inlineData.mimeType ?? "image/png", model, note };
  } catch (error) {
    throw toGeminiError(error, model);
  }
}

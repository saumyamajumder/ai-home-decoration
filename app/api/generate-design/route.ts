import { generateEditedImage, prepareEditPlan } from "@/lib/ai/gemini";
import { buildImageEditPrompt } from "@/lib/ai/prompt-builder";
import { ApiError, errorResponse } from "@/lib/server/api-error";
import { readForm, readImageField } from "@/lib/server/image-input";
import { roomCategories } from "@/lib/catalog";
import { editingStyles, validatePrompt } from "@/lib/prompts/options";

export const maxDuration = 120;

/**
 * POST /api/generate-design
 * multipart/form-data:
 *   image        – the photo to edit (the original upload, or a previous result to continue editing)
 *   prompt       – the user's instructions (10–1000 chars)
 *   roomCategory – catalog id
 *   styleId?     – editing style id
 *
 * 1. Gemini (GEMINI_MODEL) reads the photo and prepares a structured edit plan.
 * 2. The image model (GEMINI_IMAGE_MODEL) edits the real photo.
 * 200 → { image: { data (base64), mimeType }, plan, instruction, models }
 * If step 2 is unavailable, the error response still includes the prepared plan so the
 * user can see the backend understood the request, but no image is returned.
 */
export async function POST(request: Request) {
  try {
    const form = await readForm(request);
    const image = await readImageField(form);

    const prompt = String(form.get("prompt") ?? "").trim();
    const validation = validatePrompt(prompt);
    if (!validation.ok) throw new ApiError(400, "bad_request", validation.message);

    const room = roomCategories.find((r) => r.id === form.get("roomCategory"));
    if (!room) throw new ApiError(400, "bad_request", "Choose a valid room category.");

    const styleId = form.get("styleId");
    const style = styleId ? editingStyles.find((s) => s.id === styleId) : undefined;
    if (styleId && !style) throw new ApiError(400, "bad_request", "Unknown design style.");

    const { plan, model: planModel } = await prepareEditPlan(image, { prompt, roomName: room.name, styleName: style?.name });
    const instruction = buildImageEditPrompt({ plan, roomName: room.name, styleName: style?.name });

    try {
      const result = await generateEditedImage(image, instruction);
      return Response.json({
        image: { data: result.bytes.toString("base64"), mimeType: result.mimeType },
        plan,
        instruction,
        note: result.note,
        models: { planning: planModel, image: result.model },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new ApiError(error.status, error.code, error.message, { ...error.details, stage: "image-generation", plan, instruction });
      }
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}

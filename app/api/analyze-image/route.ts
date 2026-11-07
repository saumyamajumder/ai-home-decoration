import { analyzeRoomImage } from "@/lib/ai/gemini";
import { ApiError, errorResponse } from "@/lib/server/api-error";
import { readForm, readImageField } from "@/lib/server/image-input";
import { roomCategories } from "@/lib/catalog";

export const maxDuration = 60;

/**
 * POST /api/analyze-image
 * multipart/form-data: image (JPG/PNG/WebP ≤ 10 MB), roomCategory? (catalog id, used as a hint)
 * 200 → { analysis: RoomAnalysis, model }
 */
export async function POST(request: Request) {
  try {
    const form = await readForm(request);
    const image = await readImageField(form);

    const hintId = form.get("roomCategory");
    let roomHint: string | undefined;
    if (typeof hintId === "string" && hintId) {
      const room = roomCategories.find((r) => r.id === hintId);
      if (!room) throw new ApiError(400, "bad_request", "Unknown room category.");
      roomHint = room.name.toLowerCase();
    }

    const result = await analyzeRoomImage(image, roomHint);
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

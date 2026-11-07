import "server-only";

import { ApiError } from "@/lib/server/api-error";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, type AcceptedImageType } from "@/lib/uploads/limits";

export interface ImageInput {
  bytes: Uint8Array;
  mimeType: AcceptedImageType;
  name: string;
}

/** Identifies the real format from the file's magic bytes rather than trusting the client's MIME type. */
export function sniffImageType(bytes: Uint8Array): AcceptedImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((b, i) => bytes[i] === b)) return "image/png";
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "image/webp";
  return null;
}

/** Reads and validates an uploaded image from a multipart form field. */
export async function readImageField(form: FormData, field = "image"): Promise<ImageInput> {
  const file = form.get(field);
  if (!(file instanceof File) || file.size === 0) {
    throw new ApiError(400, "bad_request", "Attach a room photo in the “image” field.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ApiError(413, "payload_too_large", `Images must be ${MAX_IMAGE_BYTES / 1024 / 1024} MB or smaller.`);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = sniffImageType(bytes);
  if (!mimeType || !ACCEPTED_IMAGE_TYPES.includes(mimeType)) {
    throw new ApiError(415, "unsupported_media", "Use a JPG, PNG or WebP image.");
  }
  return { bytes, mimeType, name: file.name || "room-photo" };
}

/** Parses a multipart body, turning malformed bodies into a 400. */
export async function readForm(request: Request): Promise<FormData> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("multipart/form-data")) {
    throw new ApiError(415, "unsupported_media", "Send the request as multipart/form-data.");
  }
  try {
    return await request.formData();
  } catch {
    throw new ApiError(400, "bad_request", "The upload could not be read. Try again.");
  }
}

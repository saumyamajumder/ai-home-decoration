import "server-only";

export type ApiErrorCode =
  | "bad_request"
  | "unsupported_media"
  | "payload_too_large"
  | "not_configured"
  | "quota_exceeded"
  | "upstream_error"
  | "invalid_upstream_response"
  | "internal_error";

/** An error whose message is safe to show to the user. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string; details?: Record<string, unknown> };
}

/** Converts any thrown value to a JSON response without leaking internals. */
export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    const body: ApiErrorBody = { error: { code: error.code, message: error.message, details: error.details } };
    return Response.json(body, { status: error.status });
  }
  console.error("[api] unexpected error", error);
  const body: ApiErrorBody = { error: { code: "internal_error", message: "Something went wrong on the server." } };
  return Response.json(body, { status: 500 });
}

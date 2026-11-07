import "server-only";

/**
 * Server-side configuration. Secrets are read here and never leave the server:
 * nothing in this file is prefixed NEXT_PUBLIC_, and `server-only` makes any
 * accidental import from a Client Component a build error.
 */

/** Returns the trimmed value, or undefined when empty or still a `YOUR_…` placeholder. */
function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value || /^YOUR_/i.test(value)) return undefined;
  return value;
}

export interface GeminiConfig {
  apiKey: string;
  /** Text/vision model used for room analysis and prompt preparation. */
  model: string;
  /** Optional models tried in order when the main one is overloaded, out of quota or times out. */
  fallbackModels: string[];
}

export function getGeminiConfig(): GeminiConfig | null {
  const apiKey = read("GEMINI_API_KEY");
  const model = read("GEMINI_MODEL");
  return apiKey && model ? { apiKey, model, fallbackModels: (read("GEMINI_FALLBACK_MODEL") ?? "").split(",").map((m) => m.trim()).filter(Boolean) } : null;
}

/**
 * Image-editing model (must explicitly support image output, e.g. a Gemini "-image" model).
 * Null when not configured: the app then explains what to set instead of faking a result.
 */
export function getImageModel(): string | null {
  return read("GEMINI_IMAGE_MODEL") ?? null;
}

export interface SupabaseServerConfig {
  url: string;
  publishableKey: string;
  /** Bypasses Row Level Security. Only for trusted server code. */
  secretKey: string | undefined;
}

export function getSupabaseConfig(): SupabaseServerConfig | null {
  const url = read("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return url && publishableKey ? { url, publishableKey, secretKey: read("SUPABASE_SECRET_KEY") } : null;
}

/** Non-secret summary of what is configured, safe to send to the browser. */
export interface ServiceStatus {
  gemini: { configured: boolean; model: string | null; missing: string[] };
  imageGeneration: { configured: boolean; model: string | null };
  supabase: { configured: boolean; serverKey: boolean; missing: string[] };
}

export function getServiceStatus(): ServiceStatus {
  const missing = (names: string[]) => names.filter((name) => !read(name));
  const geminiMissing = missing(["GEMINI_API_KEY", "GEMINI_MODEL"]);
  const supabaseMissing = missing(["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"]);
  return {
    gemini: { configured: geminiMissing.length === 0, model: read("GEMINI_MODEL") ?? null, missing: geminiMissing },
    imageGeneration: { configured: Boolean(read("GEMINI_API_KEY") && getImageModel()), model: getImageModel() },
    supabase: {
      configured: !supabaseMissing.includes("NEXT_PUBLIC_SUPABASE_URL") && !supabaseMissing.includes("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
      serverKey: !supabaseMissing.includes("SUPABASE_SECRET_KEY"),
      missing: supabaseMissing,
    },
  };
}

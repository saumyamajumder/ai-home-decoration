import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { ApiError } from "@/lib/server/api-error";
import { getSupabaseConfig } from "@/lib/server/env";

function requireConfig() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new ApiError(503, "not_configured", "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.", {
      service: "supabase",
    });
  }
  return config;
}

/**
 * Per-request client acting as the signed-in user (session from cookies).
 * Row Level Security applies. Create a new one for every request.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const config = requireConfig();
  const cookieStore = await cookies();
  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. proxy.ts refreshes the session.
        }
      },
    },
  });
}

/**
 * Admin client using the secret key: bypasses Row Level Security. Only for
 * trusted server tasks (setup checks, signed uploads after ownership checks).
 * Never pass its results to the browser without filtering by the user.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  const config = requireConfig();
  if (!config.secretKey) {
    throw new ApiError(503, "not_configured", "SUPABASE_SECRET_KEY is not set on the server.", { service: "supabase" });
  }
  return createClient(config.url, config.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

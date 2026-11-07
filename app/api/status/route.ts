import { connection } from "next/server";

import { getServiceStatus } from "@/lib/server/env";

/**
 * GET /api/status — which services are configured (booleans and model names only,
 * never key values). The UI uses it to show clear "not configured" messages.
 */
export async function GET() {
  await connection(); // read env per request, not at build time
  return Response.json(getServiceStatus(), { headers: { "Cache-Control": "no-store" } });
}

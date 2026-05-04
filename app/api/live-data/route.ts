/*
  /api/live-data

  Dynamic API route used by both comparison panels. It returns a fresh snapshot
  on every request so developers can observe real cache reuse, hydration, and
  refetch behavior in the UI.
*/
import { NextResponse } from "next/server";
import { fetchLiveDataSnapshot } from "@/lib/live-data";

// This route must not be statically cached by Next.js; every request represents live data.
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = fetchLiveDataSnapshot();

  return NextResponse.json(snapshot, {
    headers: {
      /*
        no-store keeps browser/proxy caching out of the lesson. TanStack Query
        should be the visible cache on the production side, not HTTP caching.
      */
      "Cache-Control": "no-store"
    }
  });
}

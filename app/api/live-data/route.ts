import { NextRequest, NextResponse } from "next/server";
import { fetchLiveDataSnapshot } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const delay = Number(request.nextUrl.searchParams.get("delay") ?? 0);
  const snapshot = await fetchLiveDataSnapshot(Number.isFinite(delay) ? delay : 0);

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

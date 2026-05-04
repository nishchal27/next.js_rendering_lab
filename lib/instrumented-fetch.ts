/*
  instrumented-fetch.ts

  Browser fetch wrapper used by the live comparison. It does not delay or alter
  responses; it only marks real request boundaries for the rendering timeline.
*/
import { markBrowserTimelineEvent } from "@/lib/render-timeline-store";

export async function instrumentedFetch(input: RequestInfo | URL, init?: RequestInit) {
  markBrowserTimelineEvent("fetch_start", "Data fetch start");

  try {
    const response = await fetch(input, init);

    markBrowserTimelineEvent("fetch_end", "Data fetch end");

    return response;
  } catch (error) {
    markBrowserTimelineEvent("fetch_end", "Data fetch failed");
    throw error;
  }
}

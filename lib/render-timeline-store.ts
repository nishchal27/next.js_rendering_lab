/*
  render-timeline-store.ts

  Small client-side event store for the rendering lifecycle timeline. It records
  real browser/runtime events only: Navigation Timing, Paint Timing, hydration,
  fetch boundaries, and UI commits from React components.
*/
import { useSyncExternalStore } from "react";

export type TimelineEventType =
  | "request_start"
  | "html_received"
  | "fcp"
  | "js_loaded"
  | "hydrated"
  | "fetch_start"
  | "fetch_end"
  | "ui_updated";

export type TimelineEventSource = "browser" | "server";

export type TimelineEvent = {
  type: TimelineEventType;
  label: string;
  timestamp: number;
  source: TimelineEventSource;
};

const listeners = new Set<() => void>();
let events: TimelineEvent[] = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getTimelineSnapshot() {
  return events;
}

export function getServerTimelineSnapshot() {
  return [];
}

/*
  markTimelineEvent upserts by event type. Fetch and UI events may happen many
  times, but the timeline is a signal panel, not a log, so it shows the latest
  occurrence for each lifecycle step.
*/
export function markTimelineEvent(event: TimelineEvent) {
  const existingIndex = events.findIndex((item) => item.type === event.type);

  events =
    existingIndex >= 0
      ? events.map((item, index) => (index === existingIndex ? event : item))
      : [...events, event];

  emitChange();
}

export function markBrowserTimelineEvent(
  type: TimelineEventType,
  label: string,
  timestamp = typeof performance !== "undefined" ? performance.now() : 0
) {
  markTimelineEvent({
    type,
    label,
    timestamp,
    source: "browser"
  });
}

export function useTimelineEvents() {
  return useSyncExternalStore(subscribe, getTimelineSnapshot, getServerTimelineSnapshot);
}

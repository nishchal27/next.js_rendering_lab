"use client";

/*
  RenderingTimeline.tsx

  Real-time glass-box view of the current page lifecycle. It reads browser
  Performance API entries for navigation/paint timing and combines them with
  explicit React/fetch marks from the app.
*/
import { useEffect } from "react";
import {
  markBrowserTimelineEvent,
  type TimelineEvent,
  type TimelineEventType,
  useTimelineEvents
} from "@/lib/render-timeline-store";

type TimelineStep = {
  type: TimelineEventType;
  shortLabel: string;
  detail: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    type: "request_start",
    shortLabel: "Request",
    detail: "Document request started"
  },
  {
    type: "html_received",
    shortLabel: "HTML",
    detail: "HTML response received"
  },
  {
    type: "fcp",
    shortLabel: "FCP",
    detail: "First contentful paint"
  },
  {
    type: "js_loaded",
    shortLabel: "JS",
    detail: "Client JavaScript running"
  },
  {
    type: "hydrated",
    shortLabel: "Hydration",
    detail: "React effects can run"
  },
  {
    type: "fetch_start",
    shortLabel: "Fetch",
    detail: "Client data request started"
  },
  {
    type: "fetch_end",
    shortLabel: "Fetch done",
    detail: "Client data response resolved"
  },
  {
    type: "ui_updated",
    shortLabel: "UI",
    detail: "React committed new data"
  }
];

export function RenderingTimeline() {
  const events = useTimelineEvents();

  useEffect(() => {
    /*
      Navigation Timing gives real document-level milestones. These values are
      read after hydration, but their timestamps come from the browser's actual
      loading timeline.
    */
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigation) {
      markBrowserTimelineEvent("request_start", "Request start", navigation.requestStart);
      markBrowserTimelineEvent("html_received", "HTML received", navigation.responseEnd);
    }

    /*
      This mark means the app's client bundle is executing. It is not a fake
      network milestone; it is the first moment this client component can run.
    */
    markBrowserTimelineEvent("js_loaded", "JavaScript loaded");

    /*
      This runs only on the client after hydration. It marks when React has
      attached enough for effects and client data fetching to begin.
    */
    markBrowserTimelineEvent("hydrated", "Hydration complete");

    const paintEntry = performance.getEntriesByName("first-contentful-paint")[0];

    if (paintEntry) {
      markBrowserTimelineEvent("fcp", "First Contentful Paint", paintEntry.startTime);
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const fcp = list.getEntries().find((entry) => entry.name === "first-contentful-paint");

      if (fcp) {
        markBrowserTimelineEvent("fcp", "First Contentful Paint", fcp.startTime);
        observer.disconnect();
      }
    });

    observer.observe({ type: "paint", buffered: true });

    return () => observer.disconnect();
  }, []);

  const eventsByType = new Map(events.map((event) => [event.type, event]));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            Real-Time Rendering Timeline
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Request to interactive UI</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          Performance API
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
        {TIMELINE_STEPS.map((step, index) => (
          <TimelineStepCard
            key={step.type}
            index={index}
            step={step}
            event={eventsByType.get(step.type)}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineStepCard({
  index,
  step,
  event
}: {
  index: number;
  step: TimelineStep;
  event?: TimelineEvent;
}) {
  const isActive = Boolean(event);

  return (
    <div
      className={`rounded-2xl border p-3 transition duration-300 ${
        isActive
          ? "scale-[1.01] border-slate-300 bg-slate-950 text-white shadow-sm"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
            isActive ? "bg-white text-slate-950" : "bg-slate-200 text-slate-500"
          }`}
        >
          {index + 1}
        </span>
        <span className="font-mono text-[0.65rem] font-black">
          {event ? `${Math.round(event.timestamp)}ms` : "waiting"}
        </span>
      </div>

      <p className="mt-3 text-sm font-black">{step.shortLabel}</p>
      <p className={`mt-1 text-xs leading-5 ${isActive ? "text-slate-300" : "text-slate-500"}`}>
        {step.detail}
      </p>
    </div>
  );
}

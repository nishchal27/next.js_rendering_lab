/*
  live-data.ts

  Realistic in-memory data source for the lab's live API. It behaves like a
  fast service whose values change between requests, which lets the UI expose
  hydration, caching, and refetching without any artificial delay.
*/
export type LivePoint = {
  label: string;
  value: number;
};

export type LiveDataSnapshot = {
  id: number;
  title: string;
  value: number;
  delta: number;
  timestamp: string;
  requestId: number;
  points: LivePoint[];
};

let requestId = 0;
let currentValue = 126.4;
let previousValue = currentValue;
/*
  Module-level state gives the API continuity across requests in the same server
  process, similar to reading a changing market price from a backend service.
*/
let points = Array.from({ length: 18 }, (_, index) => ({
  label: String(index + 1),
  value: round(120 + Math.sin(index / 2.1) * 9 + Math.cos(index / 4.5) * 4)
}));

function round(value: number) {
  return Number(value.toFixed(2));
}

/*
  Shared live data generator.

  There is intentionally no artificial delay here. The API behaves like a fast
  in-process data source whose value changes whenever it is requested. Any
  loading, flicker, duplicate fetching, or smoothness in the UI comes from the
  React/Next.js data flow, not from staged latency.
*/
export function fetchLiveDataSnapshot(): LiveDataSnapshot {
  const now = Date.now();
  const nextRequestId = requestId + 1;
  /*
    Randomness is used only to change the value, like a live metric moving over
    time. It is not used to slow the response or exaggerate one UI pattern.
  */
  const movement = (Math.random() - 0.48) * 2.4;

  requestId = nextRequestId;
  previousValue = currentValue;
  currentValue = round(Math.max(90, currentValue + movement));
  points = [
    ...points.slice(1),
    {
      label: String(nextRequestId),
      value: currentValue
    }
  ];

  return {
    id: nextRequestId,
    title: "Realtime Price Index",
    value: currentValue,
    delta: round(currentValue - previousValue),
    timestamp: new Date(now).toISOString(),
    requestId: nextRequestId,
    points
  };
}

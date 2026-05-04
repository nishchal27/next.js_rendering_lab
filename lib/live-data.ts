/*
  live-data.ts

  Realistic time-based data source for the lab's live API. It behaves like a
  fast backend metric that changes over time, which lets the UI expose hydration,
  caching, and refetching without randomness or artificial delay.
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
const BUCKET_MS = 3000;

function round(value: number) {
  return Number(value.toFixed(2));
}

function valueForBucket(bucket: number) {
  const wave = Math.sin(bucket / 2.4) * 7;
  const smallerWave = Math.cos(bucket / 5.2) * 3;

  return round(100 + wave + smallerWave);
}

function buildPoints(currentBucket: number): LivePoint[] {
  return Array.from({ length: 18 }, (_, index) => {
    const bucket = currentBucket - 17 + index;

    return {
      label: String(index + 1),
      value: valueForBucket(bucket)
    };
  });
}

/*
  Shared live data generator.

  There is intentionally no artificial delay or random per-request movement.
  The value is derived from the current time bucket, so repeated requests inside
  the same bucket are stable and updates reflect a realistic backend metric that
  changes over time.
*/
export function fetchLiveDataSnapshot(): LiveDataSnapshot {
  const now = Date.now();
  const nextRequestId = requestId + 1;
  const bucket = Math.floor(now / BUCKET_MS);
  const currentValue = valueForBucket(bucket);
  const previousValue = valueForBucket(bucket - 1);

  requestId = nextRequestId;

  return {
    id: nextRequestId,
    title: "Live Backend Metric",
    value: currentValue,
    delta: round(currentValue - previousValue),
    timestamp: new Date(now).toISOString(),
    requestId: nextRequestId,
    points: buildPoints(bucket)
  };
}

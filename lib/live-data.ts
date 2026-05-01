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
  points: LivePoint[];
};

function round(value: number) {
  return Number(value.toFixed(2));
}

function buildPoints(seed: number): LivePoint[] {
  return Array.from({ length: 18 }, (_, index) => {
    const wave = Math.sin((seed + index) / 2.1) * 9;
    const smallerWave = Math.cos((seed + index) / 4.5) * 4;

    return {
      label: String(index + 1),
      value: round(120 + wave + smallerWave)
    };
  });
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
  Shared live data generator.

  This simulates an API value that changes over time. Keeping it local gives the
  demo full control over update speed, delay, and chart shape without relying on
  an external service.
*/
export async function fetchLiveDataSnapshot(delayMs = 0): Promise<LiveDataSnapshot> {
  if (delayMs > 0) {
    await wait(delayMs);
  }

  const now = Date.now();
  const seed = Math.floor(now / 2500);
  const points = buildPoints(seed);
  const previous = points.at(-2)?.value ?? points[0].value;
  const current = points.at(-1)?.value ?? points[0].value;

  return {
    id: seed,
    title: "Realtime Price Index",
    value: current,
    delta: round(current - previous),
    timestamp: new Date(now).toISOString(),
    points
  };
}

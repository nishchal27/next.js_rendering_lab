"use client";

/*
  TelemetryPanel.tsx

  Compact signal panel for the live comparison cards. It intentionally avoids
  logs and repeated rows; each tile answers one question about current behavior.
*/
import { useEffect, useState } from "react";
import type { RenderLocation } from "@/lib/rendering-modes";

export type TelemetrySignals = {
  renderedAt: string;
  dataFetchedAt?: string;
  renderSource: RenderLocation;
  hydrationStatus: "Yes" | "No";
  requestCount: number;
  lastUpdate?: string;
  cacheStatus: "Cached" | "Fresh" | "No cache";
  updateMode: "Background refetch" | "Blocking fetch" | "Client fetch";
};

export function TelemetryPanel({ telemetry }: { telemetry: TelemetrySignals }) {
  const now = useNow();
  const lastUpdate = telemetry.lastUpdate
    ? `${formatTime(telemetry.lastUpdate)} (${formatAge(now - Date.parse(telemetry.lastUpdate))} ago)`
    : "Pending";

  return (
    <section className="mt-5 rounded-2xl border border-white/80 bg-white/80 p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Telemetry</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Signal label="Rendered at" value={formatTime(telemetry.renderedAt)} />
        <Signal label="Data fetched at" value={telemetry.dataFetchedAt ? formatTime(telemetry.dataFetchedAt) : "Pending"} />
        <Signal label="Render source" value={telemetry.renderSource} />
        <Signal label="Hydrated" value={telemetry.hydrationStatus} />
        <Signal label="Request count" value={String(telemetry.requestCount)} emphasis />
        <Signal label="Last update" value={lastUpdate} wide />
        <Signal label="Cache status" value={telemetry.cacheStatus} />
        <Signal label="Update mode" value={telemetry.updateMode} />
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
  emphasis = false,
  wide = false
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white px-3 py-2 ${wide ? "col-span-2" : ""}`}>
      <p className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p
        key={emphasis ? value : label}
        className={`mt-1 break-words font-mono leading-5 ${
          emphasis
            ? "animate-count-pop text-2xl font-black text-slate-950"
            : "text-xs font-black text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/*
  Relative timestamps should keep moving even when data does not refetch, so the
  timer is display-only and independent from the request cadence.
*/
function useNow() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  return now;
}

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatAge(ms: number) {
  if (ms < 1000) {
    return `${Math.max(ms, 0)} ms`;
  }

  return `${Math.floor(ms / 1000)} s`;
}

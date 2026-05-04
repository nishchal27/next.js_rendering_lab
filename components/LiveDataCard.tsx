"use client";

/*
  LiveDataCard.tsx

  Presentation component for both halves of the live data comparison. It keeps
  the visual language identical so developers can focus on behavior: cached
  background updates on the production side versus local loading states on the
  naive side.
*/
import { useEffect, useState } from "react";
import type { LiveDataSnapshot } from "@/lib/live-data";
import type { RenderLocation } from "@/lib/rendering-modes";

export type TelemetrySignals = {
  renderSource: RenderLocation;
  renderTimestamp: string;
  lastFetchTimestamp?: string;
  requestCount: number;
  hydrationStatus?: "Yes" | "No";
  updateMode: "Background refetch" | "Client fetch" | "Blocking fetch";
  cacheStatus: "Cached" | "No cache";
};

type LiveDataCardProps = {
  data?: LiveDataSnapshot;
  title: string;
  subtitle: string;
  status: string;
  tags: string[];
  tone: "production" | "naive";
  endpoint: string;
  telemetry: TelemetrySignals;
  isUpdating?: boolean;
  isLoading?: boolean;
};

/*
  Shows the latest live value, a small chart, and request telemetry.

  The card intentionally accepts state from its parent instead of fetching by
  itself. That separation keeps rendering concerns here and data-flow concerns
  in LiveComparisonPanel.
*/
export function LiveDataCard({
  data,
  title,
  subtitle,
  status,
  tags,
  tone,
  endpoint,
  telemetry,
  isUpdating = false,
  isLoading = false
}: LiveDataCardProps) {
  const isProduction = tone === "production";

  return (
    <article
      className={`min-h-[28rem] rounded-2xl border p-4 shadow-sm transition-all duration-300 sm:p-5 ${
        isProduction
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-red-200 bg-red-50/50"
      } ${isUpdating && isProduction ? "ring-2 ring-emerald-200" : ""} ${
        isLoading && !isProduction ? "scale-[0.99] opacity-80" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p
            className={`text-xs font-black uppercase tracking-[0.16em] ${
              isProduction ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">{subtitle}</h3>
        </div>
        <span className="rounded-full border border-white/80 bg-white px-3 py-1 text-xs font-bold text-slate-600">
          {status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-2.5 py-1 text-xs font-black ${
              isProduction ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {isLoading ? (
        <LoadingState tone={tone} />
      ) : data ? (
        /*
          Production usually keeps this content visible during refetch. The naive
          card reaches this branch only after local state has been repopulated.
        */
        <div className="transition-opacity duration-300">
          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">{data.title}</p>
              <p className="mt-1 text-5xl font-black tracking-tight text-slate-950">
                ${data.value.toFixed(2)}
              </p>
            </div>
            <DeltaPill delta={data.delta} />
          </div>

          <Sparkline data={data} tone={tone} />

          <div className="mt-5 rounded-2xl border border-white/80 bg-white/80 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Updated at</p>
            <p className="mt-1 break-words font-mono text-xs font-semibold text-slate-700">
              {data.timestamp}
            </p>
          </div>
        </div>
      ) : null}

      <TelemetryPanel endpoint={endpoint} telemetry={telemetry} />
    </article>
  );
}

/*
  The loader means different things depending on the data model:
  - production: the query has no hydrated or cached data yet
  - naive: local state was cleared and the component is waiting for fetch
*/
function LoadingState({ tone }: { tone: "production" | "naive" }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="h-10 w-36 animate-pulse rounded-xl bg-white/80" />
      <div className="h-44 animate-pulse rounded-2xl bg-white/80" />
      <div
        className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
          tone === "naive"
            ? "border-red-200 bg-white text-red-700"
            : "border-emerald-200 bg-white text-emerald-700"
        }`}
      >
        {tone === "naive" ? "Local state is empty until fetch resolves" : "Preparing query state"}
      </div>
    </div>
  );
}

/*
  Signal-based telemetry replaces verbose request logs.

  Each tile answers one behavior question at a glance: where render work happened,
  whether hydration provided data, how many API requests happened, and whether
  updates are cached/background work or blocking client fetches.
*/
function TelemetryPanel({
  endpoint,
  telemetry
}: {
  endpoint: string;
  telemetry: TelemetrySignals;
}) {
  const now = useNow();
  const lastFetchRelative = telemetry.lastFetchTimestamp
    ? `${formatAge(now - Date.parse(telemetry.lastFetchTimestamp))} ago`
    : "Pending";
  const lastFetchValue = telemetry.lastFetchTimestamp
    ? `${formatTime(telemetry.lastFetchTimestamp)} (${lastFetchRelative})`
    : "Pending";

  return (
    <section className="mt-5 rounded-2xl border border-white/80 bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Telemetry</p>
        <p className="break-words font-mono text-xs font-semibold text-slate-500">{endpoint}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Signal label="Render source" value={telemetry.renderSource} />
        <Signal label="Render time" value={formatTime(telemetry.renderTimestamp)} />
        <Signal label="Last fetch" value={lastFetchValue} wide />
        <Signal label="Request count" value={String(telemetry.requestCount)} emphasis />
        {telemetry.hydrationStatus && <Signal label="Hydration" value={telemetry.hydrationStatus} />}
        <Signal label="Update mode" value={telemetry.updateMode} />
        <Signal label="Cache status" value={telemetry.cacheStatus} />
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
  Updates relative "last fetch" labels once per second. Keeping this timer local
  avoids coupling display freshness to the actual data refetch interval.
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

function DeltaPill({ delta }: { delta: number }) {
  const isUp = delta >= 0;

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-black ${
        isUp ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isUp ? "+" : ""}
      {delta.toFixed(2)}
    </span>
  );
}

/*
  Lightweight SVG chart used instead of a charting library.

  The chart visualizes the exact points returned by the API; no animation or fake
  interpolation is added, so changes reflect real snapshots.
*/
function Sparkline({ data, tone }: { data: LiveDataSnapshot; tone: "production" | "naive" }) {
  const width = 520;
  const height = 210;
  const padding = 18;
  const values = data.points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const stroke = tone === "production" ? "#059669" : "#dc2626";
  const fillId = `${tone}-sparkline-fill`;

  const path = data.points
    .map((point, index) => {
      const x = padding + (index / (data.points.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.value - min) / range) * (height - padding * 2);

      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${data.title} sparkline`}
      className="mt-6 h-52 w-full overflow-visible rounded-2xl bg-white/60"
    >
      <defs>
        <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
        fill={`url(#${fillId})`}
      />
      <path d={path} fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

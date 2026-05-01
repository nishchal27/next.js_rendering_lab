"use client";

import type { LiveDataSnapshot } from "@/lib/live-data";

type LiveDataCardProps = {
  data?: LiveDataSnapshot;
  title: string;
  subtitle: string;
  status: string;
  tags: string[];
  tone: "production" | "naive";
  isUpdating?: boolean;
  isLoading?: boolean;
};

export function LiveDataCard({
  data,
  title,
  subtitle,
  status,
  tags,
  tone,
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
        <div className={isProduction ? "transition-opacity duration-300" : "animate-naive-pop"}>
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
    </article>
  );
}

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
        {tone === "naive" ? "Fetching again - UI is empty while waiting" : "Preparing cached state"}
      </div>
    </div>
  );
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

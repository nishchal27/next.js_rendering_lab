import Link from "next/link";
import { MODES, type RenderingMode } from "@/lib/rendering-modes";
import type { Post } from "@/lib/api";
import { RenderingPipeline } from "@/components/RenderingPipeline";

/*
  Shared page UI for all four rendering strategies.

  The goal of this project is to compare rendering behavior, not different UI.
  So CSR, SSR, SSG, and ISR all use this same component. The route decides where
  and when data is prepared; this component only displays the result clearly.
*/
type RenderingLabPageProps = {
  mode: RenderingMode;
  posts: Post[];
  renderedAt: string;
  dataFetchedAt: string;
  dataSource?: string;
};

export function RenderingLabPage({
  mode,
  posts,
  renderedAt,
  dataFetchedAt,
  dataSource = "English teaching dataset"
}: RenderingLabPageProps) {
  const config = MODES[mode];

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/" className="font-semibold text-slate-600 transition hover:text-slate-950">
          Next.js Rendering Lab
        </Link>
        <div className="flex flex-wrap gap-2">
          {Object.values(MODES).map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className={`rounded-full px-3 py-1 font-bold transition ${
                item.slug === mode ? item.badgeClass : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Header: identifies the rendering mode and the main HTML generation location. */}
      <section className={`rounded-lg border bg-white/95 p-5 shadow-soft sm:p-6 ${config.borderClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${config.badgeClass}`}>
              {config.label}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {config.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{config.explanation}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p className="font-semibold text-slate-500">HTML generated in</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{config.htmlGeneratedAt}</p>
          </div>
        </div>
      </section>

      {/* Rendering Info: the short interview answer for this rendering strategy. */}
      <section className="mt-5 rounded-lg border border-white/80 bg-white/90 p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Rendering Info</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
              These values are the quick interview answer: where HTML is created, when it is created, and which runtime did the work.
            </p>
          </div>
          <div className={`rounded-lg px-4 py-3 text-sm font-semibold leading-6 ${config.softClass}`}>
            {config.mentalModel}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <InfoTile label="Where HTML is generated" value={config.htmlGeneratedAt} />
          <InfoTile label="When it is generated" value={config.generatedWhen} />
          <InfoTile label="Rendered on" value={config.renderedOn} />
        </div>
      </section>

      {/* Pipeline: a live visual explanation of browser, server, cache, and data work. */}
      <section className="mt-5 rounded-lg border border-white/80 bg-white/90 p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-950">Rendering Pipeline</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            Live simulation
          </span>
        </div>
        <RenderingPipeline
          steps={config.pipeline}
          accentClass={config.accentClass}
          softClass={config.softClass}
        />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_22rem]">
        {/* Posts: same content across all routes so rendering differences are easier to see. */}
        <section className="rounded-lg border border-white/80 bg-white/95 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-950">Posts</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Shared UI
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {posts.map((post) => (
              <article key={post.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Post {post.id}
                </p>
                <h3 className="mt-2 text-base font-bold text-slate-950">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.body}</p>
              </article>
            ))}
          </div>
        </section>

        <DebugPanel
          mode={mode}
          renderedAt={renderedAt}
          dataFetchedAt={dataFetchedAt}
          dataSource={dataSource}
        />
      </div>
    </main>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-28 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

/*
  DebugPanel is intentionally visible in the UI.
  It exposes the timestamps and rendering location so learners can refresh pages
  and observe what changes between CSR, SSR, SSG, and ISR.
*/
function DebugPanel({
  mode,
  renderedAt,
  dataFetchedAt,
  dataSource
}: {
  mode: RenderingMode;
  renderedAt: string;
  dataFetchedAt: string;
  dataSource: string;
}) {
  const config = MODES[mode];

  return (
    <aside className={`rounded-lg border bg-slate-950 p-5 text-white shadow-soft ${config.borderClass}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Debug Panel</h2>
        <span className={`h-3 w-3 rounded-full ${config.accentClass} animate-pulse`} />
      </div>
      <dl className="mt-5 space-y-4 text-sm">
        <DebugRow label="Rendered at" value={renderedAt} />
        <DebugRow label="Data fetched at" value={dataFetchedAt} />
        <DebugRow label="Rendered on" value={config.renderedOn} />
        <DebugRow label="Data source" value={dataSource} />
        <DebugRow label="Revalidate time" value={config.revalidateTime ?? "None"} />
      </dl>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          Behind the scenes
        </p>
        <ol className="mt-3 space-y-3">
          {config.pipeline.map((step, index) => (
            <li key={`${step.title}-${index}`} className="flex gap-3 text-sm leading-5">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${config.accentClass}`} />
              <span>
                <strong>{step.actor}</strong> - {step.title}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</dt>
      <dd className="mt-1 break-words font-mono text-sm text-slate-50">{value}</dd>
    </div>
  );
}

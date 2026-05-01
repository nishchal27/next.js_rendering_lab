import Link from "next/link";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { LiveComparisonPanel } from "@/components/LiveComparisonPanel";
import { RenderingPipeline } from "@/components/RenderingPipeline";
import type { LiveDataSnapshot } from "@/lib/live-data";
import { MODES, type RenderingMode } from "@/lib/rendering-modes";

type RenderingLabPageProps = {
  mode: RenderingMode;
  renderedAt: string;
  dataFetchedAt: string;
  dataSource?: string;
  liveInitialData?: LiveDataSnapshot;
};

/*
  Shared visual comparison page.

  Server routes decide how the initial HTML is generated. This component keeps
  the screen consistent and highlights the separate client-update comparison.
*/
export function RenderingLabPage({
  mode,
  renderedAt,
  dataFetchedAt,
  dataSource = "English teaching dataset",
  liveInitialData
}: RenderingLabPageProps) {
  const config = MODES[mode];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <TopNav activeMode={mode} />

      <section className={`rounded-2xl border bg-white/95 p-5 shadow-sm sm:p-6 ${config.borderClass}`}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-black ${config.badgeClass}`}>
              {config.label}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {config.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{config.explanation}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Initial HTML</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{config.htmlGeneratedAt}</p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Initial Render Info
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{config.initialInsight}</h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${config.softClass}`}>
            {config.renderedOn}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <InfoTile label="Where HTML is generated" value={config.htmlGeneratedAt} />
          <InfoTile label="When" value={config.generatedWhen} />
          <InfoTile label="Rendered at" value={renderedAt} />
        </div>
      </section>

      <div className="mt-4">
        <LiveComparisonPanel initialData={liveInitialData} />
      </div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">What to notice</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <InsightPill label="Initial render" value={config.initialInsight} />
          <InsightPill label="Production update" value="Cached + background refetch" />
          <InsightPill label="Naive update" value="Loader + client-only fetch" />
        </div>
      </section>

      <section className="mt-4 grid gap-4">
        <CollapsibleSection
          title="Rendering Pipeline"
          description="Initial HTML path for this route."
          badge="Collapsed"
        >
          <RenderingPipeline
            steps={config.pipeline}
            accentClass={config.accentClass}
            softClass={config.softClass}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Debug Panel"
          description={`${config.renderedOn} render - ${renderedAt}`}
          badge={config.revalidateTime ?? "No revalidate"}
        >
          <DebugPanel
            mode={mode}
            renderedAt={renderedAt}
            dataFetchedAt={dataFetchedAt}
            dataSource={dataSource}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Technical Notes" description="Implementation details." badge="Notes">
          <TechnicalNotes mode={mode} />
        </CollapsibleSection>
      </section>
    </main>
  );
}

function TopNav({ activeMode }: { activeMode: RenderingMode }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
      <Link href="/" className="font-bold text-slate-700 transition hover:text-slate-950">
        Next.js Rendering Lab
      </Link>
      <div className="flex flex-wrap gap-2">
        {Object.values(MODES).map((item) => (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            className={`rounded-full px-3 py-1 font-bold transition hover:-translate-y-0.5 ${
              item.slug === activeMode ? item.badgeClass : "bg-white/80 text-slate-600 hover:bg-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 break-words text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function InsightPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-white">{value}</p>
    </div>
  );
}

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
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <dl className="space-y-4 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-white">
        <DebugRow label="Rendered at" value={renderedAt} />
        <DebugRow label="Data fetched at" value={dataFetchedAt} />
        <DebugRow label="Rendered on" value={config.renderedOn} />
        <DebugRow label="Data source" value={dataSource} />
        <DebugRow label="Revalidate time" value={config.revalidateTime ?? "None"} />
      </dl>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Behind the scenes</p>
        <ol className="mt-3 grid gap-3 md:grid-cols-2">
          {config.pipeline.map((step, index) => (
            <li key={`${step.title}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="font-black text-slate-950">{step.actor}</p>
              <p className="mt-1 text-slate-600">{step.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
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

function TechnicalNotes({ mode }: { mode: RenderingMode }) {
  const config = MODES[mode];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {config.technicalNotes.map((note) => (
        <div key={note.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-950">{note.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{note.body}</p>
        </div>
      ))}
    </div>
  );
}

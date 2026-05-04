/*
  app/page.tsx

  Entry point for the lab. This page does not demonstrate a rendering strategy
  itself; it routes developers to the four controlled examples so they can
  compare one concept at a time.
*/
import Link from "next/link";
import { MODES } from "@/lib/rendering-modes";

/*
  Home route for the lab.

  This is a simple Server Component landing screen. It links to the four routes
  so learners can compare the same UI rendered by CSR, SSR, SSG, and ISR.
*/
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          App Router Teaching Lab
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Next.js Rendering Lab
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
          The same post UI rendered four different ways, with timestamps and flow diagrams that make the runtime behavior visible.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/*
          The cards are generated from the same config used by the lesson pages,
          so navigation labels and page explanations cannot drift apart.
        */}
        {Object.values(MODES).map((mode) => (
          <Link
            key={mode.slug}
            href={`/${mode.slug}`}
            className="group rounded-lg border border-white/80 bg-white/80 p-5 shadow-soft transition hover:-translate-y-1 hover:bg-white"
          >
            <div className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${mode.badgeClass}`}>
              {mode.label}
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">{mode.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{mode.explanation}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-slate-900 transition group-hover:translate-x-1">
              Open lab -&gt;
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}

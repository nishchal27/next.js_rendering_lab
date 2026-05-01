export type RenderingMode = "csr" | "ssr" | "ssg" | "isr";

export type RenderLocation = "Browser" | "Server" | "Build" | "Cache";

export type PipelineStep = {
  actor: "Browser" | "Next.js Server" | "Build Process" | "Data API" | "CDN Cache";
  title: string;
  detail: string;
  network: string;
};

export type RenderingModeConfig = {
  slug: RenderingMode;
  label: string;
  title: string;
  badgeClass: string;
  accentClass: string;
  softClass: string;
  borderClass: string;
  htmlGeneratedAt: string;
  generatedWhen: string;
  explanation: string;
  renderedOn: RenderLocation;
  revalidateTime?: string;
  mentalModel: string;
  initialInsight: string;
  liveInsight: string;
  technicalNotes: Array<{
    title: string;
    body: string;
  }>;
  pipeline: PipelineStep[];
};

/*
  Central teaching config for the lab.

  The four pages render the same UI, but each page passes a different `mode`.
  This config changes the labels, colors, explanation text, debug values, and
  pipeline steps for that rendering strategy.

  Keeping this in one file makes the teaching content easy to compare:
  CSR focuses on browser work, SSR on request-time server work, SSG on build-time
  work, and ISR on cached HTML plus later regeneration.
*/
export const MODES: Record<RenderingMode, RenderingModeConfig> = {
  csr: {
    slug: "csr",
    label: "CSR",
    title: "Client Side Rendering",
    badgeClass: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    accentClass: "bg-blue-500",
    softClass: "bg-blue-50 text-blue-800",
    borderClass: "border-blue-200",
    htmlGeneratedAt: "Browser",
    generatedWhen: "After JavaScript downloads and runs",
    explanation: "The server sends a light shell. The browser does the data fetch and paints the real content.",
    renderedOn: "Browser",
    mentalModel: "Useful for interactive screens, but the useful content waits for client JavaScript.",
    initialInsight: "Initial render is browser-driven.",
    liveInsight: "The first posts appear after hydration. The stock panel also updates on the client through SWR.",
    technicalNotes: [
      {
        title: "Client component",
        body: "The CSR demo uses a client component because useEffect and useState only run in the browser."
      },
      {
        title: "Loader is expected",
        body: "The loader appears because data is not part of the first HTML response."
      },
      {
        title: "Live data stays separate",
        body: "SWR updates stocks after the app is interactive, independent of the initial render."
      }
    ],
    pipeline: [
      {
        actor: "Browser",
        title: "Request page",
        detail: "The browser asks Next.js for /csr.",
        network: "Document request"
      },
      {
        actor: "Next.js Server",
        title: "Send app shell",
        detail: "Next.js returns minimal HTML plus the client JavaScript bundle.",
        network: "HTML shell + JS"
      },
      {
        actor: "Browser",
        title: "Hydrate and run useEffect",
        detail: "React becomes interactive, then the client component starts fetching posts.",
        network: "JavaScript execution"
      },
      {
        actor: "Data API",
        title: "Fetch posts from browser",
        detail: "The network request happens after the page is already open.",
        network: "Client fetch"
      },
      {
        actor: "Browser",
        title: "Render final UI",
        detail: "React updates state, removes the loader, and paints the posts.",
        network: "No new HTML"
      }
    ]
  },
  ssr: {
    slug: "ssr",
    label: "SSR",
    title: "Server Side Rendering",
    badgeClass: "bg-green-100 text-green-700 ring-1 ring-green-200",
    accentClass: "bg-green-500",
    softClass: "bg-green-50 text-green-800",
    borderClass: "border-green-200",
    htmlGeneratedAt: "Server",
    generatedWhen: "On every request",
    explanation: "The server fetches the data first and sends ready-to-read HTML for that request.",
    renderedOn: "Server",
    mentalModel: "Best when each request needs fresh personalized or frequently changing data.",
    initialInsight: "Initial render is server-driven.",
    liveInsight: "The server prepares the initial HTML, then SWR keeps stock data fresh in the browser.",
    technicalNotes: [
      {
        title: "Dynamic route",
        body: "force-dynamic tells Next.js to render this route on every request."
      },
      {
        title: "HTML includes data",
        body: "Posts are available before the browser receives the document."
      },
      {
        title: "Fallback live data",
        body: "The page can pass a stock snapshot to SWR so the live panel starts without flicker."
      }
    ],
    pipeline: [
      {
        actor: "Browser",
        title: "Request page",
        detail: "The browser asks Next.js for /ssr.",
        network: "Document request"
      },
      {
        actor: "Next.js Server",
        title: "Run server component",
        detail: "The page function executes on the server for this request.",
        network: "Server runtime"
      },
      {
        actor: "Data API",
        title: "Fetch posts on server",
        detail: "Data is loaded before HTML is sent to the browser.",
        network: "Server fetch"
      },
      {
        actor: "Next.js Server",
        title: "Generate full HTML",
        detail: "Next.js renders the posts into the document response.",
        network: "Rendered HTML"
      },
      {
        actor: "Browser",
        title: "Display immediately",
        detail: "The browser receives useful HTML without a client data loader.",
        network: "Hydration follows"
      }
    ]
  },
  ssg: {
    slug: "ssg",
    label: "SSG",
    title: "Static Site Generation",
    badgeClass: "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
    accentClass: "bg-purple-500",
    softClass: "bg-purple-50 text-purple-800",
    borderClass: "border-purple-200",
    htmlGeneratedAt: "Build",
    generatedWhen: "During next build",
    explanation: "Next.js creates the HTML ahead of time, then every visitor gets the same static file.",
    renderedOn: "Build",
    mentalModel: "Best for pages that can be prepared ahead of time: docs, marketing, blogs, and public content.",
    initialInsight: "Initial render is build-driven.",
    liveInsight: "Static HTML can still contain client components that fetch live data after hydration.",
    technicalNotes: [
      {
        title: "Static route",
        body: "force-static tells Next.js the initial page can be generated at build time."
      },
      {
        title: "Stable timestamp",
        body: "In production, the initial render timestamp stays the same until the next build."
      },
      {
        title: "Client updates still work",
        body: "SWR runs in the browser, so live stock updates are separate from static page generation."
      }
    ],
    pipeline: [
      {
        actor: "Build Process",
        title: "Run next build",
        detail: "Next.js executes the static page before users visit it.",
        network: "Build step"
      },
      {
        actor: "Data API",
        title: "Fetch posts once",
        detail: "Data is captured at build time.",
        network: "Build-time fetch"
      },
      {
        actor: "Build Process",
        title: "Write static HTML",
        detail: "The finished page is saved as deployable static output.",
        network: "Static artifact"
      },
      {
        actor: "CDN Cache",
        title: "Serve same file",
        detail: "Each request gets the already generated HTML.",
        network: "Cache hit"
      },
      {
        actor: "Browser",
        title: "Display instantly",
        detail: "No request-time rendering is needed.",
        network: "HTML response"
      }
    ]
  },
  isr: {
    slug: "isr",
    label: "ISR",
    title: "Incremental Static Regeneration",
    badgeClass: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    accentClass: "bg-orange-500",
    softClass: "bg-orange-50 text-orange-800",
    borderClass: "border-orange-200",
    htmlGeneratedAt: "Build + Cache",
    generatedWhen: "At build time, then after revalidate",
    explanation: "Visitors get cached HTML quickly while Next.js refreshes the page after the revalidate window.",
    renderedOn: "Cache",
    revalidateTime: "15 seconds",
    mentalModel: "Best when content can be slightly stale but should update automatically without a full rebuild.",
    initialInsight: "Initial render is cache-driven.",
    liveInsight: "The cached page can regenerate later, while SWR updates live stock data immediately on the client.",
    technicalNotes: [
      {
        title: "Revalidate interval",
        body: "The route can serve cached HTML and regenerate after the configured interval."
      },
      {
        title: "Fast cached response",
        body: "Users get existing HTML quickly while Next.js handles regeneration when needed."
      },
      {
        title: "Two update paths",
        body: "ISR updates page HTML over time; SWR updates client data every few seconds."
      }
    ],
    pipeline: [
      {
        actor: "Browser",
        title: "Request page",
        detail: "The browser asks for /isr.",
        network: "Document request"
      },
      {
        actor: "CDN Cache",
        title: "Serve cached HTML",
        detail: "The user gets the existing static response immediately.",
        network: "Cache hit"
      },
      {
        actor: "Next.js Server",
        title: "Check revalidate timer",
        detail: "Next.js checks whether the cached page is older than 15 seconds.",
        network: "Cache metadata"
      },
      {
        actor: "Data API",
        title: "Regenerate in background",
        detail: "After the interval, Next.js fetches fresh data and rebuilds the page.",
        network: "Background fetch"
      },
      {
        actor: "CDN Cache",
        title: "Update cached page",
        detail: "The next visitor receives the refreshed HTML.",
        network: "New cache entry"
      }
    ]
  }
};

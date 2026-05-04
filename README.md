# Next.js Rendering Lab

A visual comparison app for exploring rendering and client-side data updates in the Next.js App Router.

The app separates two concerns that are often mixed together:

- **Initial rendering**: CSR, SSR, SSG, and ISR
- **Client-side updates**: TanStack Query versus a naive `useEffect` fetch

The goal is to make real behavior visible: the left side is the production-style pattern, the right side is the naive pattern. The app does not add fake latency or intentionally slow one side down.

## Routes

| Route | Rendering Strategy | What It Shows |
| --- | --- | --- |
| `/csr` | Client Side Rendering | Initial content appears after browser JavaScript runs. |
| `/ssr` | Server Side Rendering | Initial HTML is generated on the server for each request. |
| `/ssg` | Static Site Generation | Initial HTML is generated during the production build. |
| `/isr` | Incremental Static Regeneration | Cached HTML is served and regenerated after a revalidate interval. |

## Main Comparison

Each route includes a side-by-side live data comparison.

Each route also includes a real-time rendering timeline built from browser
Performance API entries plus explicit hydration, fetch, and UI update marks.

### Production Pattern

The left panel uses **TanStack Query**.

It demonstrates:

- `queryKey`
- `queryFn`
- `refetchInterval`
- `staleTime`
- cached data
- background refetching
- initial data support for server-rendered/static routes
- request timestamps

The UI keeps showing the previous value while fresh data is fetched in the background.

### Naive Pattern

The right panel uses plain `useEffect` and `fetch`.

It demonstrates:

- no shared cache
- no fallback data
- client-only loading
- visible flicker on updates
- UI replacement after every request
- request timestamps

The difference comes from data ownership. TanStack Query keeps cached server state available during background refetches, while the naive component clears local state before each client fetch.

## Data Source

The app uses a local API:

```txt
/api/live-data
```

It returns:

- a changing value
- a delta
- a timestamp
- a request id
- sparkline points

No external API is used. The value is derived from time buckets, so repeated
requests in the same bucket are stable and updates happen naturally over time.
The endpoint does not simulate latency. To observe slow networks, use your
browser DevTools network throttling instead of adding delay code to the app.

## Page Structure

Each rendering route follows the same structure:

1. Header
2. Initial Paint State
3. Real-Time Rendering Timeline
4. Live Comparison with telemetry
5. What to notice
6. Collapsible sections

Collapsed sections include:

- Rendering Pipeline
- Debug Panel
- Technical Notes

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- ESLint

## Project Structure

```txt
app/
  api/
    live-data/
      route.ts
  csr/
    page.tsx
    ClientRenderingPage.tsx
  ssr/
    page.tsx
  ssg/
    page.tsx
  isr/
    page.tsx
  globals.css
  layout.tsx
  page.tsx

components/
  dev/
    RenderingTimeline.tsx
    TelemetryPanel.tsx
  CollapsibleSection.tsx
  LiveComparisonPanel.tsx
  LiveDataCard.tsx
  RenderingLabPage.tsx
  RenderingPipeline.tsx

lib/
  api.ts
  instrumented-fetch.ts
  live-data.ts
  render-timeline-store.ts
  rendering-modes.ts
```

## How Each Route Works

### CSR: `/csr`

CSR uses a client component with `useEffect` and `useState`.

The initial page shell is sent first. Data appears after browser JavaScript runs.

### SSR: `/ssr`

SSR uses an async Server Component and `force-dynamic`.

The server prepares the initial render for each request and passes initial live data into the TanStack Query panel.

### SSG: `/ssg`

SSG uses `force-static`.

The initial page is generated during `next build`. The client comparison still updates after hydration.

### ISR: `/isr`

ISR uses `revalidate`.

The page can be served from cache and regenerated after the configured interval.

Current revalidate interval:

```ts
export const revalidate = 15;
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Run lint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Expected Build Output

After `npm run build`, the route output should show routes similar to:

```txt
ƒ /api/live-data
○ /csr
ƒ /ssr
○ /ssg
○ /isr  revalidate 15s
```

## Notes

This project is intentionally focused. It avoids external data services and heavy charting libraries so the rendering and data-fetching behavior stays easy to see in the browser and in the code.

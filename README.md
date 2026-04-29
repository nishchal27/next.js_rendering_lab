# Next.js Rendering Lab

A visual demo app for comparing **CSR, SSR, SSG, and ISR** in the Next.js App Router.

The app renders the same UI in four different ways so the rendering behavior is easier to observe:

- where HTML is generated
- when data is prepared
- whether the browser, server, build process, or cache is involved
- how timestamps change across rendering strategies

## Routes

| Route | Rendering Strategy | What It Shows |
| --- | --- | --- |
| `/csr` | Client Side Rendering | Data is loaded in the browser after JavaScript runs. |
| `/ssr` | Server Side Rendering | HTML is generated on the server for each request. |
| `/ssg` | Static Site Generation | HTML is generated during the production build. |
| `/isr` | Incremental Static Regeneration | Cached HTML is served and regenerated after a revalidate interval. |

## What The App Shows

Each route uses the same base UI:

- page header
- rendering info panel
- rendering pipeline
- posts list
- debug panel

The UI stays consistent so the differences between CSR, SSR, SSG, and ISR are easier to compare.

## Rendering Info

Each page displays:

- where HTML is generated
- when HTML is generated
- where the page was rendered
- revalidate time, when applicable

## Rendering Pipeline

The rendering pipeline visualizes the main steps involved in each strategy.

Examples:

- browser requests a route
- Next.js sends an app shell
- React hydrates on the client
- server prepares data
- build process creates static HTML
- cache serves an existing page
- ISR regenerates after the configured interval

The pipeline is a UI simulation. The actual rendering behavior is controlled by the files inside the `app/` directory.

## Debug Panel

The debug panel shows runtime values for each route:

- `Rendered at`
- `Data fetched at`
- `Rendered on`
- `Data source`
- `Revalidate time`
- background steps for the selected rendering strategy

These values make it easier to compare how each route behaves when the page is opened, refreshed, built, or regenerated.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint

## Project Structure

```txt
app/
  page.tsx
  layout.tsx
  globals.css
  csr/
    page.tsx
    ClientRenderingPage.tsx
  ssr/
    page.tsx
  ssg/
    page.tsx
  isr/
    page.tsx

components/
  LoadingPosts.tsx
  RenderingLabPage.tsx
  RenderingPipeline.tsx

lib/
  api.ts
  rendering-modes.ts
```

## How Each Route Works

### CSR: `/csr`

CSR uses a client component with `useEffect` and `useState`.

Flow:

1. The browser requests `/csr`.
2. Next.js sends the initial app shell.
3. Browser downloads and runs JavaScript.
4. React hydrates.
5. `useEffect` fetches the posts.
6. React updates the UI in the browser.

Important files:

- `app/csr/page.tsx`
- `app/csr/ClientRenderingPage.tsx`
- `components/LoadingPosts.tsx`

### SSR: `/ssr`

SSR uses an async Server Component and `force-dynamic`.

Flow:

1. The browser requests `/ssr`.
2. Next.js runs the page on the server.
3. Data is prepared on the server.
4. Next.js sends HTML that already contains the posts.
5. The browser hydrates the page.

Important file:

- `app/ssr/page.tsx`

### SSG: `/ssg`

SSG uses `force-static`.

Flow:

1. `next build` runs the page.
2. Data is prepared during the build.
3. HTML is generated ahead of time.
4. Requests receive the already generated static HTML.

Important file:

- `app/ssg/page.tsx`

### ISR: `/isr`

ISR uses `revalidate`.

Flow:

1. Cached HTML is served quickly.
2. Next.js checks whether the cached page is stale.
3. After the revalidate interval, Next.js regenerates the page.
4. Later requests receive the refreshed HTML.

Important file:

- `app/isr/page.tsx`

Current revalidate interval:

```ts
export const revalidate = 15;
```

## Data Source

The project uses a local English dataset in `lib/api.ts`.

This keeps the output stable and avoids depending on an external API while comparing rendering behavior.

The same shared function is used by all rendering pages:

```ts
fetchPosts()
```

Where that function runs depends on the route:

- CSR: browser after hydration
- SSR: server per request
- SSG: build time
- ISR: build time or regeneration time

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

## Useful Checks

After running a production build, Next.js prints the route output.

Expected behavior:

```txt
/csr  static shell
/ssr  dynamic server-rendered route
/ssg  static route
/isr  static route with revalidate
```

## Notes

This project is intentionally small and focused. It avoids extra features so the rendering behavior stays easy to inspect in the code and in the browser.

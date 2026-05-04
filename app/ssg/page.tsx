/*
  /ssg/page.tsx

  Static Site Generation example. Next.js can run this route during the build,
  save the HTML, and serve the same result to visitors until a new build ships.
  The client-side live comparison still hydrates and updates after load.
*/
import { RenderingLabPage } from "@/components/RenderingLabPage";
import { fetchPosts } from "@/lib/api";
import { fetchLiveDataSnapshot } from "@/lib/live-data";

/*
  /ssg route

  This page demonstrates Static Site Generation.
  Next.js renders this page ahead of time during `next build`.

  What happens in production:
  1. `next build` runs this page function.
  2. Posts are fetched/created during the build.
  3. Next.js saves the generated HTML as static output.
  4. Every visitor receives that same already-built HTML.

  The timestamp is useful here because it should stay the same until another build.
*/
export const dynamic = "force-static";

export default async function SsgPage() {
  // force-static tells Next.js this page should be treated as static HTML.
  /*
    These values are captured when the static page is generated. That is why the
    initial timestamps can stay stable while the client-side live panel continues
    making fresh browser requests after hydration.
  */
  const [result, liveInitialData] = await Promise.all([fetchPosts(), fetchLiveDataSnapshot()]);

  return (
    <RenderingLabPage
      mode="ssg"
      renderedAt={new Date().toISOString()}
      dataFetchedAt={result.fetchedAt}
      dataSource={result.source}
      liveInitialData={liveInitialData}
    />
  );
}

import { RenderingLabPage } from "@/components/RenderingLabPage";
import { fetchPosts } from "@/lib/api";
import { fetchLiveDataSnapshot } from "@/lib/live-data";

/*
  /isr route

  This page demonstrates Incremental Static Regeneration.
  ISR starts like SSG: Next.js can serve cached/static HTML quickly.
  The difference is that Next.js is allowed to refresh the cached page later.

  What happens in production:
  1. A cached HTML version is served immediately.
  2. Next.js checks whether the cached page is older than `revalidate`.
  3. If it is stale, Next.js regenerates the page in the background.
  4. Future visitors receive the refreshed HTML.
*/
export const revalidate = 15;

export default async function IsrPage() {
  // This function is used when Next.js builds or regenerates the cached HTML.
  const [result, liveInitialData] = await Promise.all([fetchPosts(), fetchLiveDataSnapshot()]);

  return (
    <RenderingLabPage
      mode="isr"
      renderedAt={new Date().toISOString()}
      dataFetchedAt={result.fetchedAt}
      dataSource={result.source}
      liveInitialData={liveInitialData}
    />
  );
}

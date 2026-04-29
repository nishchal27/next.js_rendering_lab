import { RenderingLabPage } from "@/components/RenderingLabPage";
import { fetchPosts } from "@/lib/api";

/*
  /ssr route

  This page demonstrates Server Side Rendering in the App Router.
  It is an async Server Component, so its code runs on the Next.js server.

  What happens on each request:
  1. Browser requests /ssr.
  2. Next.js runs this page function on the server.
  3. The server fetches/creates the posts data.
  4. Next.js renders HTML that already contains the posts.
  5. The browser receives useful HTML immediately, then hydrates React.
*/
export const dynamic = "force-dynamic";

export default async function SsrPage() {
  // force-dynamic makes this route render on every request instead of being cached.
  const result = await fetchPosts();

  return (
    <RenderingLabPage
      mode="ssr"
      posts={result.posts}
      renderedAt={new Date().toISOString()}
      dataFetchedAt={result.fetchedAt}
      dataSource={result.source}
    />
  );
}

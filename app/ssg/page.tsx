import { RenderingLabPage } from "@/components/RenderingLabPage";
import { fetchPosts } from "@/lib/api";

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
  const result = await fetchPosts();

  return (
    <RenderingLabPage
      mode="ssg"
      posts={result.posts}
      renderedAt={new Date().toISOString()}
      dataFetchedAt={result.fetchedAt}
      dataSource={result.source}
    />
  );
}

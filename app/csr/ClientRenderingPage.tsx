"use client";

/*
  This component intentionally runs in the browser.

  "use client" tells Next.js that this file needs client-side JavaScript.
  That is required here because CSR uses useState and useEffect, which only run
  after the page has loaded in the browser.
*/
import { useEffect, useState } from "react";
import { fetchPosts, type PostsResult } from "@/lib/api";
import { LoadingPosts } from "@/components/LoadingPosts";
import { RenderingLabPage } from "@/components/RenderingLabPage";

export function ClientRenderingPage() {
  const [result, setResult] = useState<PostsResult | null>(null);
  const [renderedAt, setRenderedAt] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    async function loadPostsInBrowser() {
      /*
        CSR timing:
        - This function does not run while Next.js is generating HTML.
        - It runs only after React hydrates in the browser.
        - The artificial delay makes the loader visible for teaching.
      */
      const postsResult = await fetchPosts({ delayMs: 1200 });

      if (isActive) {
        // This timestamp proves the final UI was rendered by browser-side React.
        setRenderedAt(new Date().toISOString());
        setResult(postsResult);
      }
    }

    loadPostsInBrowser();

    return () => {
      isActive = false;
    };
  }, []);

  if (!result) {
    // The loader is the visible CSR clue: data is not in the first HTML response.
    return <LoadingPosts />;
  }

  return (
    <RenderingLabPage
      mode="csr"
      renderedAt={renderedAt}
      dataFetchedAt={result.fetchedAt}
      dataSource={result.source}
    />
  );
}

"use client";

/*
  ClientRenderingPage.tsx

  Implements the CSR route's main lesson. This file is intentionally a client
  component because CSR relies on browser-only hooks: the initial HTML contains
  the shell, and data appears after hydration starts running React effects.

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
        - Any loader is a real consequence of the browser starting with no data,
          not a delay added by the demo.
      */
      const postsResult = await fetchPosts();

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
    /*
      The loader is the visible CSR clue. It appears because the first HTML
      response did not include posts, not because the demo slowed anything down.
    */
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

export type Post = {
  id: number;
  title: string;
  body: string;
};

export type PostsResult = {
  posts: Post[];
  fetchedAt: string;
  source: "English teaching dataset";
};

const teachingPosts: Post[] = [
  {
    id: 1,
    title: "CSR: the browser does the final work",
    body: "The initial HTML is light. JavaScript loads, fetches data, then React updates the screen."
  },
  {
    id: 2,
    title: "SSR: the server prepares the page per request",
    body: "Next.js fetches data on the server and sends complete HTML to the browser for that visit."
  },
  {
    id: 3,
    title: "SSG: the page is prepared during the build",
    body: "Next.js creates a static HTML file before users arrive, so every request can be served quickly."
  },
  {
    id: 4,
    title: "ISR: cached HTML can refresh later",
    body: "Users get the cached page immediately while Next.js regenerates a newer version after the interval."
  },
  {
    id: 5,
    title: "The timestamp tells the story",
    body: "Compare rendered time and fetched time to see whether work happened in the browser, server, build, or cache."
  }
];

type FetchPostsOptions = {
  delayMs?: number;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
  Shared data function used by all rendering pages.

  In a real app this function might call a database or an external API.
  For this learning lab, the data is local and always English so the rendering
  behavior is the focus, not API reliability or random placeholder text.

  The same function is called from different places:
  - CSR calls it from the browser after hydration.
  - SSR calls it on the server for each request.
  - SSG calls it while Next.js builds static HTML.
  - ISR calls it when Next.js builds or regenerates cached HTML.

  The optional delay is used only by CSR to make the client-side loading state
  obvious on screen.
*/
export async function fetchPosts(options: FetchPostsOptions = {}): Promise<PostsResult> {
  if (options.delayMs) {
    await wait(options.delayMs);
  }

  // The lab uses fixed English teaching data so the UI always explains rendering clearly.
  return {
    posts: teachingPosts,
    fetchedAt: new Date().toISOString(),
    source: "English teaching dataset"
  };
}

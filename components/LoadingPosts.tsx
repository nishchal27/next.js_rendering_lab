/*
  LoadingPosts.tsx

  Loader shown only for the CSR demo.

  SSR, SSG, and ISR send HTML that already contains the posts.
  CSR sends a shell first, then fetches posts in the browser, so we show this
  loading state only while the real browser-side request is unresolved.
*/
export function LoadingPosts() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4">
      <div className="rounded-2xl border border-blue-200 bg-white/95 p-8 text-center shadow-sm">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <h1 className="mt-5 text-2xl font-bold text-slate-950">CSR is fetching in the browser</h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          The page shell loaded first. JavaScript is now requesting posts and preparing the UI.
        </p>
      </div>
    </div>
  );
}

"use client";

/*
  LiveComparisonPanel.tsx

  Hosts the side-by-side client data fetching lab. Both cards read from the same
  API on the same interval so the only meaningful difference is the state model:
  TanStack Query owns cached server state, while the naive card owns local React
  state and resets it on every request.
*/
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { LiveDataCard } from "@/components/LiveDataCard";
import type { LiveDataSnapshot } from "@/lib/live-data";
import type { RenderLocation } from "@/lib/rendering-modes";

type LiveComparisonPanelProps = {
  initialData?: LiveDataSnapshot;
  renderSource: RenderLocation;
  renderTimestamp: string;
};

const LIVE_DATA_QUERY_KEY = ["live-data"] as const;
const REFRESH_INTERVAL_MS = 3000;

/*
  A single shared client fetcher keeps the comparison honest. If either side
  used a different endpoint or payload, the UI would be comparing APIs instead
  of comparing React data-fetching patterns.
*/
async function getLiveData(): Promise<LiveDataSnapshot> {
  const response = await fetch("/api/live-data", {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Live data request failed");
  }

  return response.json() as Promise<LiveDataSnapshot>;
}

/*
  Provides one QueryClient for this comparison area.

  The client is created lazily so React does not recreate the cache on every
  render. That mirrors production usage: query state should survive component
  re-renders so cached data can be reused.
*/
export function LiveComparisonPanel({
  initialData,
  renderSource,
  renderTimestamp
}: LiveComparisonPanelProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Live Comparison
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Production vs naive client updates</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            Same endpoint, same 3s cadence
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ProductionLiveCard
            initialData={initialData}
            renderSource={renderSource}
            renderTimestamp={renderTimestamp}
          />
          <NaiveLiveCard renderTimestamp={renderTimestamp} />
        </div>
      </section>
    </QueryClientProvider>
  );
}

/*
  ProductionLiveCard demonstrates the production server-state pattern.

  Users should observe that hydrated data appears immediately on server-rendered
  routes, and later network requests happen in the background without clearing
  the existing UI.
*/
function ProductionLiveCard({
  initialData,
  renderSource,
  renderTimestamp
}: {
  initialData?: LiveDataSnapshot;
  renderSource: RenderLocation;
  renderTimestamp: string;
}) {
  const [requestCount, setRequestCount] = useState(() => (initialData ? 1 : 0));

  /*
    TanStack Query owns server state here.

    It uses the same /api/live-data endpoint as the naive card, but the cache is
    the difference. Initial server data can hydrate the query, staleTime prevents
    an immediate duplicate client fetch, and refetchInterval updates in the
    background while the previous value stays on screen.
  */
  const { data, isFetching, isLoading } = useQuery({
    queryKey: LIVE_DATA_QUERY_KEY,
    queryFn: async () => {
      setRequestCount((current) => current + 1);

      const nextData = await getLiveData();

      return nextData;
    },
    initialData,
    /*
      staleTime is just under the refetch interval so hydrated data stays fresh
      long enough to avoid an immediate client fetch after SSR/SSG/ISR hydration.
      The next refresh still happens on the normal cadence.
    */
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: REFRESH_INTERVAL_MS - 500
  });

  return (
    <LiveDataCard
      title="TanStack Query"
      subtitle="Production Pattern"
      status={isFetching ? "Background Refetch" : "Cached"}
      tags={["TanStack Query", "Cached", "Background Refetch"]}
      tone="production"
      data={data}
      endpoint="/api/live-data"
      telemetry={{
        renderSource,
        renderTimestamp,
        lastFetchTimestamp: data?.timestamp,
        requestCount,
        hydrationStatus: initialData ? "Yes" : undefined,
        updateMode: isLoading ? "Blocking fetch" : "Background refetch",
        cacheStatus: data ? "Cached" : "No cache"
      }}
      isUpdating={isFetching && !isLoading}
      isLoading={isLoading}
    />
  );
}

/*
  NaiveLiveCard demonstrates the basic useEffect approach.

  Users should observe a client-only first request and a local loading state on
  every refresh. The flicker is not simulated by slow code; it comes from clearing
  component state before each fetch and having no cache to fall back to.
*/
function NaiveLiveCard({ renderTimestamp }: { renderTimestamp: string }) {
  const [data, setData] = useState<LiveDataSnapshot | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    // setInterval creates the same 3s update frequency used by TanStack Query.
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function load() {
      /*
        This intentionally shows a basic useEffect fetch without exaggeration.
        The UI clears because this component resets local state before each
        request. There is no cache, no server fallback data, and no artificial
        network delay; any flicker is caused by the state model itself.
      */
      setRequestCount((current) => current + 1);
      /*
        Clearing data before fetch is the core naive behavior being observed.
        A real app often does this accidentally when loading and data are stored
        separately without a cache layer.
      */
      setIsLoading(true);
      setData(undefined);

      const nextData = await getLiveData();

      if (isActive) {
        setData(nextData);
        setIsLoading(false);
      }
    }

    load();

    return () => {
      // Prevent a completed request from writing into an unmounted component.
      isActive = false;
    };
  }, [tick]);

  const status = useMemo(() => (isLoading ? "Client Fetching" : "No Cache"), [isLoading]);

  return (
    <LiveDataCard
      title="useEffect Fetch"
      subtitle="Naive Pattern"
      status={status}
      tags={["useEffect Fetch", "No Cache", "Client Only"]}
      tone="naive"
      data={data}
      endpoint="/api/live-data"
      telemetry={{
        renderSource: "Browser",
        renderTimestamp,
        lastFetchTimestamp: data?.timestamp,
        requestCount,
        updateMode: isLoading ? "Blocking fetch" : "Client fetch",
        cacheStatus: "No cache"
      }}
      isLoading={isLoading}
    />
  );
}

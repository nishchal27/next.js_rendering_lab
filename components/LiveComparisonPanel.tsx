"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { LiveDataCard } from "@/components/LiveDataCard";
import type { LiveDataSnapshot } from "@/lib/live-data";

type LiveComparisonPanelProps = {
  initialData?: LiveDataSnapshot;
};

async function getLiveData(delayMs = 0): Promise<LiveDataSnapshot> {
  const response = await fetch(`/api/live-data${delayMs ? `?delay=${delayMs}` : ""}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Live data request failed");
  }

  return response.json() as Promise<LiveDataSnapshot>;
}

export function LiveComparisonPanel({ initialData }: LiveComparisonPanelProps) {
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
            Refetch every 3s
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ProductionLiveCard initialData={initialData} />
          <NaiveLiveCard />
        </div>
      </section>
    </QueryClientProvider>
  );
}

function ProductionLiveCard({ initialData }: { initialData?: LiveDataSnapshot }) {
  /*
    TanStack Query owns server state here.

    It keeps previous data during background refetches, uses initialData when the
    server already prepared a snapshot, and avoids the loading flicker that a
    naive useEffect fetch often creates.
  */
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ["live-data"],
    queryFn: () => getLiveData(),
    initialData,
    refetchInterval: 3000,
    staleTime: 2500
  });

  return (
    <LiveDataCard
      title="TanStack Query"
      subtitle="Production Pattern"
      status={isFetching ? "Background Refetch" : "Cached"}
      tags={["TanStack Query", "Cached", "Background Refetch"]}
      tone="production"
      data={data}
      isUpdating={isFetching && !isLoading}
      isLoading={isLoading}
    />
  );
}

function NaiveLiveCard() {
  const [data, setData] = useState<LiveDataSnapshot | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function load() {
      /*
        This intentionally shows the naive pattern:
        clear the UI, fetch again, then replace everything when data arrives.
        It has no shared cache, no server fallback, and visible flicker.
      */
      setIsLoading(true);
      setData(undefined);

      const nextData = await getLiveData(900);

      if (isActive) {
        setData(nextData);
        setIsLoading(false);
      }
    }

    load();

    return () => {
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
      isLoading={isLoading}
    />
  );
}

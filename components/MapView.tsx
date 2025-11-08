"use client";

import dynamic from "next/dynamic";
import type { TravelPlan } from "@/lib/types";

const DynamicMap = dynamic(() => import("./map/MapCanvas").then((mod) => mod.MapCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex h-[32rem] w-full items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/80 shadow-card text-slate-400">
      Initializing map intelligence…
    </div>
  )
});

type MapViewProps = {
  plan: TravelPlan;
};

export function MapView({ plan }: MapViewProps) {
  return <DynamicMap plan={plan} />;
}

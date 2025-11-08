"use client";

import type { TravelPlan, TransportOption } from "@/lib/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
import clsx from "clsx";

type EditorPanelProps = {
  plan: TravelPlan;
  onTransportChange: (option: TransportOption) => void;
  onSwap: (itemId: string) => void;
  onRemove: (itemId: string) => void;
};

export function EditorPanel({
  plan,
  onTransportChange,
  onSwap,
  onRemove
}: EditorPanelProps) {
  const trainOption = plan.transportOptions.find((option) => option.mode === "train");

  return (
    <div className="glass rounded-3xl p-6 shadow-card space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Agent edits & re-optimization
          </h2>
          <p className="text-xs text-slate-300">
            Adjust nodes below. The agent recalculates timing, routing, and cost
            on each change without resetting your goal.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-right">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Total Estimate
          </div>
          <div className="text-xl font-semibold text-slate-100">
            {formatCurrency(plan.totals.estimatedSpendUSD)}
          </div>
          <div className="text-xs text-slate-400">
            {plan.totals.activityCount} curated experiences
          </div>
        </div>
      </header>

      {trainOption && trainOption.id !== plan.selectedTransport.id && (
        <button
          type="button"
          onClick={() => onTransportChange(trainOption)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-left transition hover:border-sky-500/70 hover:bg-slate-900/90"
        >
          <div className="text-sm font-semibold text-slate-100">
            Try low-carbon rail instead ({formatCurrency(trainOption.priceUSD)})
          </div>
          <div className="text-xs text-slate-400">
            Recompute itinerary with {formatDuration(trainOption.durationHours)}{" "}
            travel time and {trainOption.carbonKg} kg CO₂e.
          </div>
        </button>
      )}

      <div className="space-y-3">
        <h3 className="text-sm uppercase tracking-widest text-slate-400">
          Live itinerary nodes
        </h3>
        <div className="space-y-3 max-h-[22rem] overflow-y-auto pr-1 scrollbar-thin">
          {plan.itinerary
            .sort((a, b) =>
              a.day === b.day
                ? a.startTime.localeCompare(b.startTime)
                : a.day - b.day
            )
            .map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "rounded-2xl border bg-slate-900/60 p-4 text-sm",
                  item.day === 1
                    ? "border-day1/60"
                    : "border-day2/60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      Day {item.day} • {item.startTime} – {item.endTime}
                    </div>
                    <div className="text-slate-100 font-semibold">
                      {item.attraction.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.attraction.category.toUpperCase()} •{" "}
                      {formatCurrency(item.attraction.costEstimateUSD)} • Transfer{" "}
                      {item.transferMinutes} min
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onSwap(item.id)}
                      className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-widest text-slate-200 hover:border-sky-500 hover:text-sky-100 transition"
                    >
                      Swap Day
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="rounded-full border border-red-500/50 px-3 py-1 text-xs uppercase tracking-widest text-red-200 hover:border-red-400/70 hover:text-red-100 transition"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <footer className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
        <div className="font-semibold text-slate-100">
          Scenario spotlight
        </div>
        <p>
          Swap a morning anchor with an evening vibe to see the agent reflow all
          hand-offs, or pivot to a slower travel mode above. The map and timing
          matrix update instantly.
        </p>
      </footer>
    </div>
  );
}

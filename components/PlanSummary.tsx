"use client";

import type { TravelPlan } from "@/lib/types";
import { formatCurrency, formatDuration } from "@/lib/utils";

type PlanSummaryProps = {
  plan: TravelPlan;
};

export function PlanSummary({ plan }: PlanSummaryProps) {
  const destination = plan.parsed.destinationCity;
  const origin = plan.parsed.originCity;

  return (
    <div className="glass rounded-3xl p-6 shadow-card space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {origin?.name ?? plan.parsed.originFallback ?? "Origin"} →{" "}
            {destination?.name ?? plan.parsed.destinationFallback ?? "Destination"}
          </h2>
          <p className="text-xs text-slate-300">
            {plan.parsed.durationDays}-day sprint • Generated{" "}
            {new Date(plan.generatedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-right">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Selected transport
          </div>
          <div className="text-sm text-slate-100 font-semibold">
            {plan.selectedTransport.provider} ({plan.selectedTransport.mode})
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Travel time
          </div>
          <div className="text-lg font-semibold text-slate-100">
            {formatDuration(plan.selectedTransport.durationHours)}
          </div>
          <div className="text-xs text-slate-400">
            {plan.selectedTransport.departureTime} →{" "}
            {plan.selectedTransport.arrivalTime}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Estimated spend
          </div>
          <div className="text-lg font-semibold text-slate-100">
            {formatCurrency(plan.totals.estimatedSpendUSD)}
          </div>
          <div className="text-xs text-slate-400">
            Includes travel, lodging, & activities
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Experiences
          </div>
          <div className="text-lg font-semibold text-slate-100">
            {plan.totals.activityCount}
          </div>
          <div className="text-xs text-slate-400">
            Balanced mix of culture, food, and landmarks
          </div>
        </div>
      </div>
    </div>
  );
}

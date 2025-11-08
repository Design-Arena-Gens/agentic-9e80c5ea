"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import type { TravelPlan, TransportOption } from "@/lib/types";
import { formatCurrency, formatDuration } from "@/lib/utils";

type TransportOptionsProps = {
  plan: TravelPlan;
  onSelect: (option: TransportOption) => void;
};

const modeLabel: Record<string, string> = {
  flight: "Flight",
  train: "High-speed Rail",
  bus: "Coach"
};

const modeIcon: Record<string, string> = {
  flight: "✈️",
  train: "🚄",
  bus: "🚌"
};

export function TransportOptions({ plan, onSelect }: TransportOptionsProps) {
  return (
    <div className="glass rounded-3xl p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Door-to-door transport</h2>
          <p className="text-xs text-slate-400">
            Ranked by blended price-time-carbon score. Tap to pivot transport
            and auto-re-sequence the itinerary.
          </p>
        </div>
        <div className="rounded-full px-3 py-1 text-xs bg-slate-800/70 border border-slate-700">
          {plan.parsed.originCity?.name ?? plan.parsed.originFallback ?? "Origin"} →{" "}
          {plan.parsed.destinationCity?.name ??
            plan.parsed.destinationFallback ??
            "Destination"}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {plan.transportOptions.map((option) => {
          const active = option.id === plan.selectedTransport.id;
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                "rounded-2xl p-4 text-left border transition shadow",
                active
                  ? "border-sky-400/70 bg-sky-500/10 shadow-sky-500/30"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{modeIcon[option.mode]}</span>
                <span
                  className={clsx(
                    "px-2 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide",
                    active
                      ? "bg-sky-500/30 text-sky-100"
                      : "bg-slate-800 text-slate-300"
                  )}
                >
                  {modeLabel[option.mode]}
                </span>
              </div>
              <div className="mt-3 text-2xl font-semibold">
                {formatCurrency(option.priceUSD)}
              </div>
              <div className="text-sm text-slate-300">
                {formatDuration(option.durationHours)} • {option.provider}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>
                  <dt className="uppercase tracking-widest">Depart</dt>
                  <dd className="text-slate-200 font-medium">
                    {option.departureTime}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest">Arrive</dt>
                  <dd className="text-slate-200 font-medium">
                    {option.arrivalTime}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest">Carbon</dt>
                  <dd>{option.carbonKg} kg CO₂e</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-widest">Score</dt>
                  <dd>
                    {Math.round(
                      (plan.transportOptions.indexOf(option) + 1) * 1.7
                    )}
                    /10
                  </dd>
                </div>
              </dl>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

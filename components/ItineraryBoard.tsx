"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { TravelPlan } from "@/lib/types";
import { formatCurrency, formatDuration, minutesBetween } from "@/lib/utils";

type ItineraryBoardProps = {
  plan: TravelPlan;
};

const dayAccent: Record<number, string> = {
  1: "border-day1/70 bg-day1/10",
  2: "border-day2/70 bg-day2/10"
};

export function ItineraryBoard({ plan }: ItineraryBoardProps) {
  const dayGroups = [1, 2].map((day) => ({
    day,
    items: plan.itinerary
      .filter((item) => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {dayGroups.map(({ day, items }) => (
        <motion.div
          key={day}
          className={clsx(
            "rounded-3xl border p-6 glass shadow-card space-y-4",
            dayAccent[day]
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: day * 0.05 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Day {day} •{" "}
                {plan.parsed.destinationCity?.name ??
                  plan.parsed.destinationFallback ??
                  "Destination"}
              </h3>
              <p className="text-xs text-slate-300">
                Sequenced for minimal hops & balanced energy.
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              Total time{" "}
              {formatDuration(
                items.reduce(
                  (sum, item) =>
                    sum + minutesBetween(item.startTime, item.endTime) / 60,
                  0
                )
              )}
            </div>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/5 bg-slate-900/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100">
                        {item.attraction.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.attraction.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-300">
                    <div className="font-semibold text-sm text-white">
                      {item.startTime} – {item.endTime}
                    </div>
                    <div>{formatDuration(item.attraction.durationHours)}</div>
                    <div className="text-slate-400">
                      {formatCurrency(item.attraction.costEstimateUSD)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase tracking-widest">
                    Transfer • {item.transferMinutes} min
                  </span>
                  <span>{item.attraction.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

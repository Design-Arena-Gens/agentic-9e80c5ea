"use client";

import { useMemo, useState } from "react";
import { GoalForm } from "@/components/GoalForm";
import { generateTravelPlan, adjustTransport, swapItineraryDay, removeItineraryItem } from "@/lib/planner";
import type { TravelPlan, TransportOption } from "@/lib/types";
import { PlanSummary } from "@/components/PlanSummary";
import { TransportOptions } from "@/components/TransportOptions";
import { ItineraryBoard } from "@/components/ItineraryBoard";
import { EditorPanel } from "@/components/EditorPanel";
import { MapView } from "@/components/MapView";
import { motion } from "framer-motion";

export default function Page() {
  const [goal, setGoal] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmitGoal = async (value: string) => {
    setBusy(true);
    try {
      const nextPlan = generateTravelPlan(value);
      setGoal(value);
      setPlan(nextPlan);
    } finally {
      setBusy(false);
    }
  };

  const handleTransportChange = (option: TransportOption) => {
    if (!plan) return;
    const nextPlan = adjustTransport(plan, option.id);
    setPlan(nextPlan);
  };

  const handleSwap = (itemId: string) => {
    if (!plan) return;
    const nextPlan = swapItineraryDay(plan, itemId);
    setPlan(nextPlan);
  };

  const handleRemove = (itemId: string) => {
    if (!plan) return;
    const nextPlan = removeItineraryItem(plan, itemId);
    setPlan(nextPlan);
  };

  const showResults = Boolean(plan);

  const heroCopy = useMemo(() => {
    if (!plan) {
      return "Describe a travel goal and let the agent orchestrate transport, sequencing, and optimization.";
    }
    return `Optimized ${plan.parsed.durationDays}-day circuit for ${plan.parsed.destinationCity?.name ?? plan.parsed.destinationFallback}. Adjust nodes in real-time.`;
  }, [plan]);

  return (
    <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_55%)]" />
      <motion.section
        className="grid gap-6 lg:grid-cols-[1.1fr_1fr]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GoalForm defaultGoal={goal ?? undefined} onSubmit={handleSubmitGoal} busy={busy} />
        <div className="glass rounded-3xl p-6 shadow-card">
          <div className="flex h-full flex-col justify-between space-y-4">
            <div>
              <h2 className="text-3xl font-semibold text-gradient">
                Mission Control
              </h2>
              <p className="mt-3 text-sm text-slate-300">{heroCopy}</p>
            </div>
            {plan ? (
              <PlanSummary plan={plan} />
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
                Output area will light up with transport trade-offs, itinerary blueprint, and map routing once the agent parses your goal.
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {showResults && plan && (
        <>
          <motion.section
            className="grid gap-6 lg:grid-cols-[2fr_1fr]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <TransportOptions plan={plan} onSelect={handleTransportChange} />
            <EditorPanel
              plan={plan}
              onTransportChange={handleTransportChange}
              onSwap={handleSwap}
              onRemove={handleRemove}
            />
          </motion.section>

          <motion.section
            className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <ItineraryBoard plan={plan} />
            <MapView plan={plan} />
          </motion.section>
        </>
      )}
    </main>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { motion } from "framer-motion";

type GoalFormProps = {
  defaultGoal?: string;
  onSubmit: (goal: string) => void;
  busy?: boolean;
};

export function GoalForm({ defaultGoal, onSubmit, busy }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<{ goal: string }>({
    defaultValues: {
      goal: defaultGoal ?? "Plan a 2-day trip to Tokyo from New Delhi"
    }
  });

  useEffect(() => {
    if (defaultGoal) {
      setValue("goal", defaultGoal);
    }
  }, [defaultGoal, setValue]);

  const loading = busy || isSubmitting;

  const quickGoals = [
    "Plan a 2-day trip to Tokyo from New Delhi",
    "Plan a creative foodie weekend in Singapore from Mumbai",
    "Plan a 48-hour art and culture sprint in Paris from London"
  ];

  return (
    <motion.form
      className="glass rounded-3xl p-6 sm:p-8 space-y-6 shadow-card"
      onSubmit={handleSubmit((data) => onSubmit(data.goal))}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gradient">
          Agentic Travel Architect
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Describe your travel ambition in natural language. The agent will map
          transport, orchestrate a two-day sequence, and surface trade-offs.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex flex-col space-y-2">
          <span className="text-xs uppercase tracking-widest text-slate-400">
            Travel Goal
          </span>
          <textarea
            className="rounded-2xl border border-slate-700 bg-slate-900/80 focus:ring-2 focus:ring-sky-500 focus:outline-none p-4 text-sm sm:text-base h-28"
            placeholder="e.g. Craft a 2-day design + ramen hunt in Tokyo starting from Seoul next month"
            {...register("goal", { required: true })}
            disabled={loading}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {quickGoals.map((goal) => (
            <button
              key={goal}
              type="button"
              className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/70 text-xs sm:text-sm hover:border-sky-500 hover:text-white transition"
              onClick={() => setValue("goal", goal)}
              disabled={loading}
            >
              {goal.replace("Plan a ", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Autonomy mode: agent will parse, estimate, and optimize without extra
          input.
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-70"
        >
          {loading ? "Generating…" : "Forge My Plan"}
        </motion.button>
      </div>
    </motion.form>
  );
}

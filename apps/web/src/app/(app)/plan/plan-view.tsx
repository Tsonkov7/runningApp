"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/token";
import { raceGoalsControllerFindActive } from "@/lib/api/generated/race-goals/race-goals";
import {
  trainingPlansControllerFindByRaceGoal,
  trainingPlansControllerGenerate,
} from "@/lib/api/generated/training-plans/training-plans";
import type { TrainingPlanResponseDto } from "@/lib/api/generated/models";

export function PlanView() {
  const router = useRouter();
  const [plan, setPlan] = useState<TrainingPlanResponseDto | null>(null);
  const [raceGoalId, setRaceGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const goalRes = await raceGoalsControllerFindActive();
        const goalId = goalRes.data.id;
        setRaceGoalId(goalId);

        try {
          const planRes = await trainingPlansControllerFindByRaceGoal(goalId);
          setPlan(planRes.data);
        } catch {
          // no plan yet — show generate button
          setPlan(null);
        }
      } catch {
        setError("No active race goal. Create one first.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  async function onGenerate() {
    if (!raceGoalId) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await trainingPlansControllerGenerate(raceGoalId);
      setPlan(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error && !raceGoalId) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/onboarding" className="underline">
          Go to onboarding
        </Link>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          No training plan yet. Generate one from your race goal.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="w-fit rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate training plan"}
        </button>
      </div>
    );
  }

  const workoutsByWeek = plan.workouts.reduce<
    Record<number, typeof plan.workouts>
  >((acc, workout) => {
    const week = workout.weekNumber;
    if (!acc[week]) acc[week] = [];
    acc[week].push(workout);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-gray-600">
        <p>
          {plan.startDate.toString().slice(0, 10)} →{" "}
          {plan.endDate.toString().slice(0, 10)}
        </p>
        <p>
          {plan.planMetadata.totalWeeks} weeks · peak{" "}
          {plan.planMetadata.peakWeeklyMileageKm} km/week
        </p>
      </div>

      {Object.entries(workoutsByWeek).map(([week, workouts]) => (
        <section key={week} className="flex flex-col gap-2">
          <h2 className="font-medium">Week {week}</h2>
          <ul className="flex flex-col gap-2">
            {workouts.map((w) => (
              <li key={w.id} className="rounded border px-3 py-2 text-sm">
                <div className="font-medium">
                  {String(w.scheduledDate).slice(0, 10)} · {w.title}
                </div>
                <div className="text-gray-600">
                  {w.workoutType}
                  {w.plannedDistanceKm > 0
                    ? ` · ${w.plannedDistanceKm} km`
                    : ""}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

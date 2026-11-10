"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/token";
import { workoutsControllerFindOne } from "@/lib/api/generated/workouts/workouts";
import { raceGoalsControllerFindActive } from "@/lib/api/generated/race-goals/race-goals";
import type { PlannedWorkoutResponseDto } from "@/lib/api/generated/models";
import { LogRunForm } from "@/components/runs/log-run-form";

export function WorkoutDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [workout, setWorkout] = useState<PlannedWorkoutResponseDto | null>(
    null,
  );
  const [raceGoalId, setRaceGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const [workoutRes, goalRes] = await Promise.all([
          workoutsControllerFindOne(id),
          raceGoalsControllerFindActive(),
        ]);
        setWorkout(workoutRes.data);
        setRaceGoalId(goalRes.data.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load workout");
      }
    }
    void load();
  }, [id, router]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!workout || !raceGoalId) {
    return <p className="text-sm text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">{workout.title}</p>
        <p className="text-sm text-gray-600">
          {String(workout.scheduledDate).slice(0, 10)} · {workout.workoutType}
        </p>
        {workout.plannedDistanceKm > 0 && (
          <p className="text-sm">{workout.plannedDistanceKm} km planned</p>
        )}
        {workout.description && (
          <p className="text-sm text-gray-600">{String(workout.description)}</p>
        )}
      </div>

      {workout.workoutType !== "REST" && (
        <section className="flex flex-col gap-3">
          <h2 className="font-medium">Log this run</h2>
          <LogRunForm
            raceGoalId={raceGoalId}
            plannedWorkoutId={workout.id}
            defaultDate={String(workout.scheduledDate).slice(0, 10)}
            defaultDistanceKm={workout.plannedDistanceKm || undefined}
          />
        </section>
      )}

      <Link href="/calendar" className="text-sm underline">
        Back to calendar
      </Link>
    </div>
  );
}

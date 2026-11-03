"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/token";
import { workoutsControllerFindOne } from "@/lib/api/generated/workouts/workouts";
import type {
  PlannedWorkoutResponseDto,
  PlannedWorkoutResponseDtoDescription,
} from "@/lib/api/generated/models";

export function WorkoutDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [workout, setWorkout] = useState<PlannedWorkoutResponseDto | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    workoutsControllerFindOne(id)
      .then((res) => setWorkout(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load workout"),
      );
  }, [id, router]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!workout) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-medium">{workout.title}</p>
      <p className="text-sm text-gray-600">
        {String(workout.scheduledDate).slice(0, 10)} · {workout.workoutType}
      </p>
      {workout.plannedDistanceKm > 0 && (
        <p className="text-sm">{workout.plannedDistanceKm} km</p>
      )}
      {workout.description && (
        <p className="text-sm text-gray-600">
          {workout.description.toString()}
        </p>
      )}
      <Link
        href="/calendar"
        className="mt-4 text-sm underline-offset-2 underline"
      >
        Back to calendar
      </Link>
    </div>
  );
}

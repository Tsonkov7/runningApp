"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/token";
import { workoutsControllerFindByDateRange } from "@/lib/api/generated/workouts/workouts";
import type { PlannedWorkoutResponseDto } from "@/lib/api/generated/models";

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toYmd(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function CalendarView() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [workouts, setWorkouts] = useState<PlannedWorkoutResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await workoutsControllerFindByDateRange({
          from: toYmd(weekStart),
          to: toYmd(weekEnd),
        });
        setWorkouts(res.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load workouts",
        );
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router, weekStart, weekEnd]);

  const byDate = useMemo(() => {
    const map = new Map<string, PlannedWorkoutResponseDto[]>();
    for (const w of workouts) {
      const key = String(w.scheduledDate).slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(w);
      map.set(key, list);
    }
    return map;
  }, [workouts]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          onClick={() => setWeekStart((d) => addDays(d, -7))}
        >
          Previous week
        </button>
        <p className="text-sm font-medium">
          {toYmd(weekStart)} → {toYmd(weekEnd)}
        </p>
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          onClick={() => setWeekStart((d) => addDays(d, 7))}
        >
          Next week
        </button>
      </div>

      {loading && <p className="text-sm text-gray-600">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && (
        <div className="grid gap-3">
          {days.map((day) => {
            const key = toYmd(day);
            const dayWorkouts = byDate.get(key) ?? [];

            return (
              <section key={key} className="rounded border p-3">
                <h2 className="mb-2 text-sm font-medium">{key}</h2>
                {dayWorkouts.length === 0 ? (
                  <p className="text-sm text-gray-500">No workouts</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {dayWorkouts.map((w) => (
                      <li key={w.id} className="text-sm">
                        <Link
                          href={`/workouts/${w.id}`}
                          className="font-medium underline"
                        >
                          {w.title}
                        </Link>
                        <div className="text-gray-600">
                          {w.workoutType}
                          {w.plannedDistanceKm > 0
                            ? ` · ${w.plannedDistanceKm} km`
                            : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

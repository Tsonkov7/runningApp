"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/token";
import {
  progressControllerGetSummary,
  progressControllerGetWeekly,
} from "@/lib/api/generated/progress/progress";
import type {
  ProgressSummaryResponseDto,
  WeeklyProgressItemDto,
} from "@/lib/api/generated/models";

export function ProgressView() {
  const router = useRouter();
  const [summary, setSummary] = useState<ProgressSummaryResponseDto | null>(
    null,
  );
  const [weekly, setWeekly] = useState<WeeklyProgressItemDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const [summaryRes, weeklyRes] = await Promise.all([
          progressControllerGetSummary(),
          progressControllerGetWeekly({ weeks: 8 }),
        ]);

        setSummary(summaryRes.data);
        setWeekly(weeklyRes.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load progress",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/onboarding" className="text-sm underline">
          Set up a race goal
        </Link>
      </div>
    );
  }

  if (!summary) return null;

  const maxKm = Math.max(
    ...weekly.map((w) => Math.max(w.plannedKm, w.actualKm)),
    1,
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded border p-3">
          <p className="text-xs text-gray-500">Days until race</p>
          <p className="text-2xl font-semibold">{summary.daysUntilRace}</p>
        </div>
        <div className="rounded border p-3">
          <p className="text-xs text-gray-500">This week</p>
          <p className="text-2xl font-semibold">
            {summary.thisWeek.actualKm}/{summary.thisWeek.plannedKm} km
          </p>
        </div>
        <div className="rounded border p-3">
          <p className="text-xs text-gray-500">Adherence</p>
          <p className="text-2xl font-semibold">
            {summary.thisWeek.adherencePercent}%
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Weekly planned vs actual</h2>
        <ul className="flex flex-col gap-3">
          {weekly.map((week) => (
            <li key={week.weekStart} className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Week of {week.weekStart}</span>
                <span>
                  {week.actualKm}/{week.plannedKm} km
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded bg-gray-100">
                <div
                  className="h-full bg-gray-400"
                  style={{ width: `${(week.plannedKm / maxKm) * 100}%` }}
                  title="Planned"
                />
              </div>
              <div className="h-2 overflow-hidden rounded bg-gray-100">
                <div
                  className="h-full bg-black"
                  style={{ width: `${(week.actualKm / maxKm) * 100}%` }}
                  title="Actual"
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500">Gray = planned · Black = actual</p>
      </section>
    </div>
  );
}

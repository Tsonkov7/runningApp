"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth/token";
import { runLogsControllerFindAll } from "@/lib/api/generated/run-logs/run-logs";
import type { RunLogResponseDto } from "@/lib/api/generated/models";

export function RunsListView() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunLogResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    async function loadRuns() {
      try {
        const res = await runLogsControllerFindAll();
        setRuns(res.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load runs");
      } finally {
        setLoading(false);
      }
    }

    void loadRuns();
  }, [router]);

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (runs.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-600">No runs logged yet.</p>
        <Link href="/calendar" className="text-sm underline">
          Pick a workout from the calendar
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {runs.map((run) => (
        <li key={run.id} className="rounded border px-3 py-2 text-sm">
          <div className="font-medium">
            {String(run.completedAt).slice(0, 10)} · {run.distanceKm} km
          </div>
          <div className="text-gray-600">
            {run.durationMin} min
            {run.rpe ? ` · RPE ${run.rpe}` : ""}
          </div>
          {run.notes && <p className="mt-1 text-gray-600">{run.notes}</p>}
        </li>
      ))}
    </ul>
  );
}

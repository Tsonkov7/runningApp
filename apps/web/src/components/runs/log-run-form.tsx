"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { runLogsControllerCreate } from "@/lib/api/generated/run-logs/run-logs";

type Props = {
  raceGoalId: string;
  plannedWorkoutId?: string;
  defaultDate?: string;
  defaultDistanceKm?: number;
};

export function LogRunForm({
  raceGoalId,
  plannedWorkoutId,
  defaultDate,
  defaultDistanceKm,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const rpeRaw = form.get("rpe");
    const notesRaw = form.get("notes");

    const body = {
      raceGoalId,
      plannedWorkoutId,
      completedAt: String(form.get("completedAt") ?? ""),
      distanceKm: Number(form.get("distanceKm")),
      durationMin: Number(form.get("durationMin")),
      ...(rpeRaw && String(rpeRaw).trim() !== ""
        ? { rpe: Number(rpeRaw) }
        : {}),
      ...(notesRaw && String(notesRaw).trim() !== ""
        ? { notes: String(notesRaw) }
        : {}),
    };

    try {
      await runLogsControllerCreate(body);
      router.push("/runs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log run");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          name="completedAt"
          type="date"
          required
          defaultValue={defaultDate}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Distance (km)
        <input
          name="distanceKm"
          type="number"
          min={0.1}
          step={0.1}
          required
          defaultValue={defaultDistanceKm}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Duration (min)
        <input
          name="durationMin"
          type="number"
          min={1}
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        RPE (1–10, optional)
        <input
          name="rpe"
          type="number"
          min={1}
          max={10}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Notes (optional)
        <textarea name="notes" rows={3} className="rounded border px-3 py-2" />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Log run"}
      </button>
    </form>
  );
}

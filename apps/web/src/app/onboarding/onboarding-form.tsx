"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { raceGoalsControllerCreate } from "@/lib/api/generated/race-goals/race-goals";
import { getAccessToken } from "@/lib/auth/token";

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    const form = new FormData(e.currentTarget);

    const targetFinishHours = form.get("targetFinishHours");
    const targetFinishTimeSec =
      targetFinishHours && String(targetFinishHours).trim() !== ""
        ? Math.round(Number(targetFinishHours) * 3600)
        : undefined;

    const body = {
      raceDate: String(form.get("raceDate") ?? ""),
      baselineWeeklyMileageKm: Number(form.get("baselineWeeklyMileageKm")),
      baselineLongestRunKm: Number(form.get("baselineLongestRunKm")),
      daysPerWeek: Number(form.get("daysPerWeek")),
      ...(targetFinishTimeSec !== undefined ? { targetFinishTimeSec } : {}),
    };

    try {
      await raceGoalsControllerCreate(body);
      // Next step (F4) will generate the plan; for now go to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create race goal",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Race date
        <input
          name="raceDate"
          type="date"
          required
          className="rounded border px-3 py-2"
        />
        <span className="text-xs text-gray-500">
          Prefer at least 8 weeks from today (needed for plan generation).
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Target finish time (hours, optional)
        <input
          name="targetFinishHours"
          type="number"
          min={2}
          max={8}
          step={0.25}
          placeholder="e.g. 4"
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Current weekly mileage (km)
        <input
          name="baselineWeeklyMileageKm"
          type="number"
          min={1}
          step={0.1}
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Longest recent run (km)
        <input
          name="baselineLongestRunKm"
          type="number"
          min={1}
          step={0.1}
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Days per week
        <select
          name="daysPerWeek"
          required
          className="rounded border px-3 py-2"
        >
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create race goal"}
      </button>
    </form>
  );
}

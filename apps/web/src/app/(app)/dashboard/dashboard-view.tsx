"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authControllerMe } from "@/lib/api/generated/auth/auth";
import { progressControllerGetSummary } from "@/lib/api/generated/progress/progress";
import { clearAccessToken, getAccessToken } from "@/lib/auth/token";
import type { ProgressSummaryResponseDto } from "@/lib/api/generated/models";

export function DashboardView() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProgressSummaryResponseDto | null>(
    null,
  );

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const meRes = await authControllerMe();
        setName(meRes.data?.name ?? "Runner");

        try {
          const summaryRes = await progressControllerGetSummary();
          setSummary(summaryRes.data);
        } catch {
          // no active goal / no plan yet — dashboard still works
          setSummary(null);
        }
      } catch {
        clearAccessToken();
        router.replace("/login");
      }
    }

    void load();
  }, [router]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {name ? `Welcome, ${name}` : "Loading..."}
        </h1>
        {summary && (
          <p className="mt-2 text-sm text-gray-600">
            {summary.daysUntilRace} days until race · this week{" "}
            {summary.thisWeek.actualKm}/{summary.thisWeek.plannedKm} km (
            {summary.thisWeek.adherencePercent}%)
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authControllerMe } from "@/lib/api/generated/auth/auth";
import { clearAccessToken, getAccessToken } from "@/lib/auth/token";
import Link from "next/link";

export function DashboardView() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    authControllerMe()
      .then((res) => {
        setName(res.data?.name ?? "Runner");
      })
      .catch(() => {
        clearAccessToken();
        router.replace("/login");
      });
  }, [router]);

  return (
    <>
      <h1 className="text-2xl font-semibold">
        {name ? `Welcome, ${name}` : "Loading..."}
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Auth works. Next we&apos;ll build onboarding and the plan UI.
      </p>
      <Link href="/onboarding" className="text-blue-500 block">
        Onboarding
      </Link>
      <Link href="/plan" className="text-blue-500 block">
        Plan
      </Link>
    </>
  );
}

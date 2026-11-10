"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/token";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        if (getAccessToken()) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }

    void redirect();
  }, [router]);

  return <main className="p-6 text-sm text-gray-600">Loading...</main>;
}

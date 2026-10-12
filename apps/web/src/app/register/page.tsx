"use client";

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authControllerRegister } from "@/lib/api/generated/auth/auth";
import { setAccessToken } from "@/lib/auth/token";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const res = await authControllerRegister({ name, email, password });
      setAccessToken(res.data.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Name"
          required
          minLength={2}
          className="rounded border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8)"
          required
          minLength={8}
          className="rounded border px-3 py-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </p>
    </main>
  );
}

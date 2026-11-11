import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Login</h1>
      <LoginForm />
      <p className="text-sm">
        No account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </>
  );
}

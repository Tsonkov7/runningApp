import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Create account</h1>
      <RegisterForm />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </p>
    </>
  );
}

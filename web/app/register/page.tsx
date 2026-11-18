import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoggedOutOnly } from "../logged-out-only";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 pt-20 pb-24">
      <p className="mb-10 text-sm font-semibold tracking-tight">First Nest Demo</p>
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Register</h1>
      <p className="mt-2 text-balance text-muted">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-accent underline hover:text-accent-hover">
          Log in
        </Link>
        .
      </p>
      <Suspense>
        <LoggedOutOnly>
          <RegisterForm />
        </LoggedOutOnly>
      </Suspense>
    </main>
  );
}

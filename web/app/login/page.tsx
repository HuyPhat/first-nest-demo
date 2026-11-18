import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoggedOutOnly } from "../logged-out-only";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto w-full max-w-sm px-6 pt-20 pb-24">
      {/* Same wordmark as the site header; /login has no header, so it names the app here. */}
      <p className="mb-10 text-sm font-semibold tracking-tight">First Nest Demo</p>
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Log in</h1>
      <p className="mt-2 text-balance text-muted">
        Use the email and password you registered with. Not registered yet?{" "}
        <Link href="/register" className="font-medium text-accent underline hover:text-accent-hover">
          Register
        </Link>
        .
      </p>
      <Suspense>
        <RegisteredNotice searchParams={searchParams} />
      </Suspense>
      <Suspense>
        <LoggedOutOnly>
          <LoginForm />
        </LoggedOutOnly>
      </Suspense>
    </main>
  );
}

// Shown after Registration, which sends the visitor here with ?registered=1. Reading searchParams
// is dynamic, so it sits in its own Suspense and the rest of the page stays static.
async function RegisteredNotice({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  if ((await searchParams).registered !== "1") return null;
  return (
    <p role="status" className="mt-6 rounded-md border border-border bg-surface px-3 py-2 text-sm">
      Registration complete. Log in with your email and password.
    </p>
  );
}

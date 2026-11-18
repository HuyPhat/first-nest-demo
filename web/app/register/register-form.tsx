"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { postJson } from "@/lib/post-json";
import { EmailField, PasswordField } from "../fields";

const MESSAGES = {
  invalid: "Enter a valid email and a password of at least 8 characters.",
  network: "Can't reach the server. Check your connection and try again.",
  server: "Something went wrong on our side. Try again.",
};

export function RegisterForm() {
  const router = useRouter();
  const [problem, setProblem] = useState<"taken" | "invalid" | "network" | "server">();
  // Busy until the request and navigation finish, then free again: Next keeps this page's state when we leave it.
  const [pending, startTransition] = useTransition();

  // Both fields point at the alert, as in Login; aria-invalid says which one it is about.
  const describedBy = problem ? "register-error" : undefined;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    setProblem(undefined);
    startTransition(async () => {
      // Registration does not log the User in, so go to Login. A network failure leaves res null;
      // it and a server error each get their own message.
      const res = await postJson("/api/auth/register", body);
      if (res?.ok) return router.push("/login?registered=1");
      setProblem(
        !res ? "network" : res.status === 409 ? "taken" : res.status === 400 ? "invalid" : "server",
      );
    });
  }

  return (
    // noValidate: the API is the one judge of the input; its answer is shown in our own alert.
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="mt-8 flex flex-col gap-5">
      <EmailField
        aria-describedby={describedBy}
        aria-invalid={problem === "taken" || problem === "invalid" || undefined}
      />
      <PasswordField
        autoComplete="new-password"
        aria-describedby={problem ? `register-hint ${describedBy}` : "register-hint"}
        aria-invalid={problem === "invalid" || undefined}
      >
        {/* The API's minimum, copied here so the rule is visible before typing; an e2e test checks it. */}
        <p id="register-hint" className="text-sm text-muted">
          At least 8 characters
        </p>
      </PasswordField>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-4 py-2.5 font-medium text-on-accent transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Registering…" : "Register"}
      </button>
      {problem && (
        <p
          id="register-error"
          role="alert"
          className="rounded-md bg-danger-surface px-3 py-2 text-sm text-danger"
        >
          {problem === "taken" ? (
            <>
              That email is already registered.{" "}
              <Link href="/login" className="font-medium underline">
                Log in
              </Link>{" "}
              instead.
            </>
          ) : (
            MESSAGES[problem]
          )}
        </p>
      )}
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { postJson } from "@/lib/post-json";
import { EmailField, PasswordField } from "../fields";

const INVALID_LOGIN = "Invalid email or password.";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  // Busy until the navigation finishes, then free again: Next keeps this page's state when we leave it.
  const [navigating, startNavigation] = useTransition();
  const pending = submitting || navigating;
  // Only a rejected Login marks the fields; a network or server failure is not about them.
  const fieldAria = {
    "aria-describedby": error ? "login-error" : undefined,
    "aria-invalid": error === INVALID_LOGIN || undefined,
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setSubmitting(true);
    // Same origin: the /api rewrite proxies to the API, which sets the HttpOnly login cookie.
    // A network failure leaves res null; it and a server error each get their own message.
    const res = await postJson("/api/auth/login", Object.fromEntries(new FormData(e.currentTarget)));
    setSubmitting(false);
    if (res?.ok) return startNavigation(() => router.push("/profile"));
    setError(
      !res
        ? "Can't reach the server. Check your connection and try again."
        : res.status === 401
          ? INVALID_LOGIN
          : "Something went wrong on our side. Try again.",
    );
  }

  return (
    <form onSubmit={onSubmit} aria-busy={pending} className="mt-8 flex flex-col gap-5">
      <EmailField {...fieldAria} />
      <PasswordField autoComplete="current-password" {...fieldAria} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-4 py-2.5 font-medium text-on-accent transition-colors duration-150 hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
      {/* Below the button, so showing it moves nothing the User is aiming at. */}
      {error && (
        <p
          id="login-error"
          role="alert"
          className="rounded-md bg-danger-surface px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </form>
  );
}

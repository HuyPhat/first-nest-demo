"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const field =
  "rounded-md border border-field-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted";

const INVALID_LOGIN = "Invalid email or password.";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  // Only a rejected Login marks the fields; a network or server failure is not about them.
  const fieldAria = {
    "aria-describedby": error ? "login-error" : undefined,
    "aria-invalid": error === INVALID_LOGIN || undefined,
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(undefined);
    setPending(true);
    // Same origin: the /api rewrite proxies to the API, which sets the HttpOnly login cookie.
    // A network failure leaves res null; it and a server error each get their own message.
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    }).catch(() => null);
    if (res?.ok) return router.push("/profile");
    setError(
      !res
        ? "Can't reach the server. Check your connection and try again."
        : res.status === 401
          ? INVALID_LOGIN
          : "Something went wrong on our side. Try again.",
    );
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} aria-busy={pending} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={field}
          {...fieldAria}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={field}
          {...fieldAria}
        />
      </label>
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

"use client";

import { useId, useState } from "react";

const field =
  "rounded-md border border-field-border bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted";

// Shared by the Login and Registration forms. Extra props (aria-*) go to the input.
export function EmailField(props: React.ComponentProps<"input">) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      Email
      <input name="email" type="email" required autoComplete="email" className={field} {...props} />
    </label>
  );
}

// Extra props (autoComplete, aria-*) go to the input; children render under it (a hint).
export function PasswordField({ children, ...input }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);
  // Not a fixed id: Next keeps the previous page hidden in the DOM, so two pages can mount this at once.
  const id = useId();
  return (
    // htmlFor, not a wrapping label: the Show button must not become part of the field's name.
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        Password
      </label>
      <div className="relative">
        <input
          id={id}
          name="password"
          type={showPassword ? "text" : "password"}
          required
          enterKeyHint="go"
          className={`${field} w-full pr-16`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-controls={id}
          className="absolute inset-y-0 right-0 rounded-md px-3 text-sm font-medium text-accent transition-colors duration-150 hover:text-accent-hover"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {children}
    </div>
  );
}

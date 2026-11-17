import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 pt-20 pb-24">
      {/* Same wordmark as the site header; /login has no header, so it names the app here. */}
      <p className="mb-10 text-sm font-semibold tracking-tight">First Nest Demo</p>
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Log in</h1>
      {/* Drop the second sentence once the web app has a Registration page. */}
      <p className="mt-2 text-balance text-muted">
        Use the email and password you registered with. Registration isn&apos;t in the
        web app yet.
      </p>
      <LoginForm />
    </main>
  );
}

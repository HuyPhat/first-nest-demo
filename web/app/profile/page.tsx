import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 pt-20 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Your profile</h1>
      <Suspense fallback={<div className="mt-8 h-14 animate-pulse rounded-md bg-border" />}>
        <Profile />
      </Suspense>
    </main>
  );
}

async function Profile() {
  // Calls Me from the server, forwarding the login cookie. 401 (no cookie, bad or expired token) means logged out; anything else is an outage, not a logout.
  const res = await fetch(
    `${process.env.API_URL ?? "http://localhost:3000"}/auth/me`,
    { headers: { cookie: (await cookies()).toString() } },
  );
  if (res.status === 401) redirect("/login");
  if (!res.ok) throw new Error(`Me failed with ${res.status}`);
  const { email } = (await res.json()) as { email: string };

  return (
    <dl className="mt-8 rounded-md border border-border bg-surface px-4 py-3">
      <dt className="text-sm font-medium text-muted">Email</dt>
      <dd className="mt-0.5 break-all">{email}</dd>
    </dl>
  );
}

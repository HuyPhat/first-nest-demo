import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-sm px-6 pt-20 pb-24">
      <h1 className="text-2xl font-semibold tracking-tight text-balance">Log in</h1>
      <p className="mt-2 text-muted">Use the email and password you registered with.</p>
      <LoginForm />
    </main>
  );
}

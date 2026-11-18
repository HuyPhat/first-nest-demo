import { LogoutButton } from "./logout-button";

// Pages with the site header. /login sits outside this group, so it has none.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-sm items-center justify-between px-6 py-4 text-sm">
          <span className="font-semibold tracking-tight">First Nest Demo</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </>
  );
}

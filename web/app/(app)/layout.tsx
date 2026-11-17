// Pages with the site header. /login sits outside this group, so it has none.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-sm px-6 py-4 text-sm font-semibold tracking-tight">
          First Nest Demo
        </div>
      </header>
      {children}
    </>
  );
}

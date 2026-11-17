import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "First Nest Demo", template: "%s | First Nest Demo" },
  description: "User sign-in demo: NestJS API, Next.js web app.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto w-full max-w-sm px-6 py-4 text-sm font-semibold tracking-tight">
            First Nest Demo
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

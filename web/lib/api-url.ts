// The one place that knows where the API is. Read by next.config.ts (the /api rewrite, fixed at build)
// and by server components (read on each request): set API_URL to the same value for both.
// Only development may fall back to the local API; in production a missing value would silently
// point at localhost.
export function apiUrl(env: Record<string, string | undefined> = process.env): string {
  if (env.API_URL) return env.API_URL;
  if (env.NODE_ENV === "production") throw new Error("API_URL is required in production");
  return "http://localhost:3000";
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADR 0001: the browser only talks to this origin; /api/* is proxied to the NestJS API, so no CORS.
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${process.env.API_URL ?? "http://localhost:3000"}/:path*`,
    },
  ],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

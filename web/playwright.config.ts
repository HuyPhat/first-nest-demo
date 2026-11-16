import { defineConfig } from '@playwright/test';

// Runs the real API (against the API's test database) and the web app, and drives a browser at the web app only.
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  use: { baseURL: 'http://localhost:3001' },
  webServer: [
    {
      command: 'pnpm --dir ../api start',
      url: 'http://localhost:3000/auth/me',
      // /auth/me answers 401 once the API is up
      reuseExistingServer: !process.env.CI,
      env: {
        DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/first_nest_test',
        JWT_SECRET: 'e2e-secret',
      },
    },
    {
      command: 'pnpm dev',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
    },
  ],
});

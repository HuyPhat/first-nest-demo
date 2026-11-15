import { defineConfig } from 'vitest/config';
import { TEST_DATABASE_URL } from './test/test-db.js';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    env: { DATABASE_URL: TEST_DATABASE_URL, JWT_SECRET: 'test-secret' },
    // All specs share one real PostgreSQL database.
    fileParallelism: false,
  },
});

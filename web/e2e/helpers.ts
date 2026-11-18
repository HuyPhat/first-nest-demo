import type { Page } from '@playwright/test';

export const password = 'correct horse';

// Registration does not log in, so register then log in through the same /api rewrite the forms use;
// the browser context keeps the login cookie. Returns the new User's email.
export async function logIn(page: Page) {
  const email = `ann-${crypto.randomUUID()}@example.com`;
  await page.request.post('/api/auth/register', { data: { email, password } });
  await page.request.post('/api/auth/login', { data: { email, password } });
  return email;
}

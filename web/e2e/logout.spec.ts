import { expect, test } from '@playwright/test';

const password = 'correct horse';

// Registration does not log in, so the browser logs in through the same /api rewrite the form uses.
async function loggedIn(page: import('@playwright/test').Page) {
  const email = `ann-${crypto.randomUUID()}@example.com`;
  await page.request.post('/api/auth/register', { data: { email, password } });
  await page.request.post('/api/auth/login', { data: { email, password } });
  await page.goto('/profile');
  await expect(page.getByText(email)).toBeVisible();
}

test('logging out goes to the login page, and the profile page then redirects there', async ({
  page,
}) => {
  await loggedIn(page);

  await page.getByRole('banner').getByRole('button', { name: 'Log out' }).click();

  await expect(page).toHaveURL('/login');
  await page.goto('/profile');
  await expect(page).toHaveURL('/login');
});

test('logging out still goes to the login page when the call fails', async ({ page }) => {
  await loggedIn(page);
  await page.route('**/api/auth/logout', (route) => route.abort());

  await page.getByRole('banner').getByRole('button', { name: 'Log out' }).click();

  await expect(page).toHaveURL('/login');
});

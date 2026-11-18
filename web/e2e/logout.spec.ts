import { expect, test, type Page } from '@playwright/test';
import { logIn } from './helpers';

async function loggedIn(page: Page) {
  const email = await logIn(page);
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

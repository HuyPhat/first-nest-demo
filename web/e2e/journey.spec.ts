import { expect, test } from '@playwright/test';

test('register, log in, view the profile, log out, log in again', async ({ page }) => {
  const email = `ann-${crypto.randomUUID()}@example.com`;
  const password = 'correct horse';
  // Next keeps the page we came from hidden in the DOM, so always look at the visible form.
  const form = page.locator('form:visible');
  const logIn = async () => {
    await form.getByLabel('Email').fill(email);
    await form.getByLabel('Password').fill(password);
    await form.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL('/profile');
    await expect(page.getByText(email)).toBeVisible();
  };

  await page.goto('/register');
  await form.getByLabel('Email').fill(email);
  await form.getByLabel('Password').fill(password);
  await form.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('/login?registered=1');
  await logIn();

  await page.getByRole('banner').getByRole('button', { name: 'Log out' }).click();
  await expect(page).toHaveURL('/login');
  await logIn();
});

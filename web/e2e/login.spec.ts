import { expect, test } from '@playwright/test';

const password = 'correct horse';

test('logging in with correct credentials shows the profile with the User email', async ({
  page,
  request,
}) => {
  const email = `ann-${Date.now()}@example.com`;
  // Through the web app's /api rewrite, like the browser does.
  await request.post('/api/auth/register', { data: { email, password } });

  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/profile');
  await expect(page.getByText(email)).toBeVisible();
});

test('wrong credentials show one generic error on the login page', async ({
  page,
  request,
}) => {
  const email = `bob-${Date.now()}@example.com`;
  await request.post('/api/auth/register', { data: { email, password } });

  for (const [tryEmail, tryPassword] of [
    [email, 'wrong password'],
    ['nobody@example.com', password],
  ]) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(tryEmail);
    await page.getByLabel('Password').fill(tryPassword);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Invalid email or password.')).toBeVisible();
    await expect(page).toHaveURL('/login');
  }
});

test('the profile page redirects to login when logged out', async ({ page }) => {
  await page.goto('/profile');

  await expect(page).toHaveURL('/login');
});

test('the profile page redirects to login when the login has expired', async ({
  page,
  context,
}) => {
  // An expired or invalid token is rejected by Me the same way.
  await context.addCookies([
    { name: 'access_token', value: 'expired.or.invalid', url: 'http://localhost:3001' },
  ]);

  await page.goto('/profile');

  await expect(page).toHaveURL('/login');
});

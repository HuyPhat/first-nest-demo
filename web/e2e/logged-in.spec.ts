import { expect, test } from '@playwright/test';
import { logIn, password } from './helpers';

for (const path of ['/login', '/register', '/login?registered=1']) {
  test(`a logged-in User who opens ${path} lands on the profile`, async ({ page }) => {
    const email = await logIn(page);

    await page.goto(path);

    await expect(page).toHaveURL('/profile');
    await expect(page.getByText(email)).toBeVisible();
  });
}

// Not covered by a test: an unreachable API and "no cookie, no API call" (the Me call is made by the
// Next server, which Playwright cannot intercept). Checked by hand against a fake API on 2026-11-18:
// no cookie made no Me call; with a cookie, a 500 answer and a refused connection both still showed the form.

// A cookie that is present but no longer valid must not count as logged in (and must not loop
// /login -> /profile -> /login).
for (const [path, button] of [
  ['/login', 'Log in'],
  ['/register', 'Register'],
]) {
  test(`${path} still shows its form to a visitor with an expired or invalid cookie`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'access_token', value: 'expired.or.invalid', url: 'http://localhost:3001' },
    ]);

    await page.goto(path);

    await expect(page).toHaveURL(path);
    await expect(page.getByRole('button', { name: button })).toBeVisible();
  });
}

test('after Login, Back does not return to the login form', async ({ page, request }) => {
  const email = `hal-${crypto.randomUUID()}@example.com`;
  await request.post('/api/auth/register', { data: { email, password } });
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/profile');

  await page.goBack();

  await expect(page).not.toHaveURL(/\/login/);
});

test('after Registration, Back does not return to the register form', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Email').fill(`gus-${crypto.randomUUID()}@example.com`);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('/login?registered=1');

  await page.goBack();

  await expect(page).not.toHaveURL(/\/register/);
});

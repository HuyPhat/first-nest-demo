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
  await expect(page).toHaveTitle('Your profile | First Nest Demo');
  await expect(page.getByRole('banner')).toContainText('First Nest Demo');
});

test('the login page has its own title and no site header', async ({ page }) => {
  await page.goto('/login');

  await expect(page).toHaveTitle('Log in | First Nest Demo');
  await expect(page.getByRole('banner')).toHaveCount(0);
});

test('the login page names the app and links to Registration', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByText('First Nest Demo', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
  await expect(page.getByText('Registration isn')).toHaveCount(0);
  // PRODUCT.md and the glossary: UI copy says Registration/Register, never "account".
  await expect(page.getByText(/account/i)).toHaveCount(0);
});

test('the password can be shown and hidden', async ({ page }) => {
  await page.goto('/login');
  const password = page.getByLabel('Password');
  await password.fill('correct horse');
  await expect(password).toHaveAttribute('type', 'password');

  await page.getByRole('button', { name: 'Show' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(password).toHaveValue('correct horse');

  await page.getByRole('button', { name: 'Hide' }).click();
  await expect(password).toHaveAttribute('type', 'password');
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

test('the login error is tied to both fields and does not move the button', async ({ page }) => {
  await page.goto('/login');
  const button = page.getByRole('button', { name: 'Log in' });
  const before = await button.boundingBox();
  await page.getByLabel('Email').fill('nobody@example.com');
  await page.getByLabel('Password').fill('wrong password');
  await button.click();

  await expect(page.locator('form').getByRole('alert')).toHaveText('Invalid email or password.');
  for (const field of ['Email', 'Password']) {
    const input = page.getByLabel(field);
    await expect(input).toHaveAccessibleDescription('Invalid email or password.');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  }
  expect(await button.boundingBox()).toEqual(before);
});

test('an unreachable server and a server error each get their own message', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('ann@example.com');
  await page.getByLabel('Password').fill(password);

  await page.route('**/api/auth/login', (route) => route.abort());
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.locator('form').getByRole('alert')).toHaveText(
    "Can't reach the server. Check your connection and try again.",
  );
  // Not a credentials problem, so the fields are not marked invalid.
  await expect(page.getByLabel('Email')).not.toHaveAttribute('aria-invalid', 'true');

  await page.unroute('**/api/auth/login');
  await page.route('**/api/auth/login', (route) => route.fulfill({ status: 500 }));
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.locator('form').getByRole('alert')).toHaveText(
    'Something went wrong on our side. Try again.',
  );
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

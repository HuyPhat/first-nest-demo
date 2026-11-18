import { expect, test } from '@playwright/test';

const password = 'correct horse';

test('registering sends the visitor to the login page, where they log in themselves', async ({
  page,
}) => {
  const email = `ann-${crypto.randomUUID()}@example.com`;

  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL('/login?registered=1');
  await expect(page.getByRole('status')).toHaveText(
    'Registration complete. Log in with your email and password.',
  );

  // Next keeps the register page hidden in the DOM after navigating away, so look at the visible form only.
  const login = page.locator('form:visible');
  await login.getByLabel('Email').fill(email);
  // Each page's password field needs its own id, or the hidden register one steals the label.
  await expect(login.getByLabel('Password')).toHaveAccessibleName('Password');
  await login.getByLabel('Password').fill(password);
  await login.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/profile');
  await expect(page.getByText(email)).toBeVisible();
});

test('an already registered email shows an error tied to the email field and keeps what was typed', async ({
  page,
  request,
}) => {
  const email = `bob-${crypto.randomUUID()}@example.com`;
  await request.post('/api/auth/register', { data: { email, password } });

  await page.goto('/register');
  // Capitalised: the API treats it as the same email.
  await page.getByLabel('Email').fill(email.toUpperCase());
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();

  const alert = page.locator('form').getByRole('alert');
  await expect(alert).toHaveText('That email is already registered. Log in instead.');
  await expect(alert.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  await expect(page.getByLabel('Email')).toHaveAccessibleDescription(
    'That email is already registered. Log in instead.',
  );
  await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Email')).toHaveValue(email.toUpperCase());
  await expect(page.getByLabel('Password')).toHaveValue(password);
  await expect(page).toHaveURL('/register');
});

const INVALID_INPUT = 'Enter a valid email and a password of at least 8 characters.';

test('a malformed email and a short password each show one error tied to both fields', async ({
  page,
}) => {
  for (const [email, tryPassword] of [
    ['not-an-email', password],
    [`dee-${crypto.randomUUID()}@example.com`, 'a'.repeat(7)],
  ]) {
    await page.goto('/register');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(tryPassword);
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.locator('form').getByRole('alert')).toHaveText(INVALID_INPUT);
    for (const field of ['Email', 'Password']) {
      await expect(page.getByLabel(field)).toHaveAccessibleDescription(
        new RegExp(INVALID_INPUT),
      );
      await expect(page.getByLabel(field)).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(page).toHaveURL('/register');
  }
});

// The hint copies the API's minimum, so this fails if the API moves it and the hint does not.
test('the password hint says 8 characters, and 7 is rejected while 8 is accepted', async ({
  page,
}) => {
  const email = `eve-${crypto.randomUUID()}@example.com`;
  await page.goto('/register');
  await expect(page.getByLabel('Password')).toHaveAccessibleDescription('At least 8 characters');
  await page.getByLabel('Email').fill(email);

  await page.getByLabel('Password').fill('a'.repeat(7));
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.locator('form').getByRole('alert')).toHaveText(INVALID_INPUT);

  await page.getByLabel('Password').fill('a'.repeat(8));
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('/login?registered=1');
});

test('an unreachable server and a server error each get their own message', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Email').fill('ann@example.com');
  await page.getByLabel('Password').fill(password);
  const alert = page.locator('form').getByRole('alert');

  await page.route('**/api/auth/register', (route) => route.abort());
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(alert).toHaveText("Can't reach the server. Check your connection and try again.");
  // Both fields point at the alert (as in Login), but it is not about the input: not marked invalid.
  for (const field of ['Email', 'Password']) {
    await expect(page.getByLabel(field)).toHaveAccessibleDescription(
      new RegExp("Can't reach the server"),
    );
    await expect(page.getByLabel(field)).not.toHaveAttribute('aria-invalid', 'true');
  }
  // The form can be retried.
  await expect(page.getByRole('button', { name: 'Register' })).toBeEnabled();

  await page.unroute('**/api/auth/register');
  await page.route('**/api/auth/register', (route) => route.fulfill({ status: 500 }));
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(alert).toHaveText('Something went wrong on our side. Try again.');
});

test('the register page names the app and links to Login', async ({ page }) => {
  await page.goto('/register');

  await expect(page).toHaveTitle('Register | First Nest Demo');
  await expect(page.getByText('First Nest Demo', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
});

// Next keeps a page we navigated away from, state included; a form left "busy" must not come back stuck.
test('returning to the register page after registering shows a form that can be used', async ({
  page,
}) => {
  await page.goto('/register');
  await page.getByLabel('Email').fill(`fay-${crypto.randomUUID()}@example.com`);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('/login?registered=1');

  await page.getByRole('link', { name: 'Register' }).click();

  await expect(page).toHaveURL('/register');
  // /^Regist/ matches both "Register" and the stuck "Registering…".
  const submit = page.locator('form:visible').getByRole('button', { name: /^Regist/ });
  await expect(submit).toHaveText('Register');
  await expect(submit).toBeEnabled();
});

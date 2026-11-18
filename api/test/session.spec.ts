import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, loginCookie, resetUsers, setCookies } from './app.js';

describe('Staying logged in', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });
  beforeEach(() => resetUsers(app));
  afterAll(() => app.close());

  const register = (email = 'ann@example.com', password = 'correct horse') =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password });

  const login = (email: string, password: string) =>
    request(app.getHttpServer()).post('/auth/login').send({ email, password });

  // Registration does not log the User in, so a cookie comes from Login.
  const registerAndLogin = async (
    email = 'ann@example.com',
    password = 'correct horse',
  ) => {
    await register(email, password);
    return login(email, password);
  };

  const me = (cookie?: string) => {
    const req = request(app.getHttpServer()).get('/auth/me');
    return cookie ? req.set('Cookie', cookie) : req;
  };

  it('marks the login cookie Secure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    try {
      const res = await registerAndLogin();

      expect(setCookies(res)[0]).toContain('Secure');
    } finally {
      vi.unstubAllEnvs();
    }
  });

  describe('Me', () => {
    it('returns the current User with a valid cookie, and only its id and email', async () => {
      const loggedIn = await registerAndLogin('ann@example.com');

      const res = await me(loginCookie(loggedIn));

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: loggedIn.body.id,
        email: 'ann@example.com',
      });
    });

    it.each([
      ['no cookie', undefined],
      ['an empty cookie', 'access_token='],
      ['a garbage token', 'access_token=garbage'],
    ])('returns 401 with %s', async (_name, cookie) => {
      expect((await me(cookie)).status).toBe(401);
    });

    it('returns 401 with a tampered token', async () => {
      const cookie = loginCookie(await registerAndLogin());
      const [head, payload, signature] = cookie.split('.');
      const flipped = (signature[0] === 'A' ? 'B' : 'A') + signature.slice(1);

      expect((await me(`${head}.${payload}.${flipped}`)).status).toBe(401);
    });

    it('returns 401 when the User no longer exists', async () => {
      const cookie = loginCookie(await registerAndLogin());
      await resetUsers(app);

      expect((await me(cookie)).status).toBe(401);
    });

    it('returns 401 once the token is over an hour old', async () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      try {
        const cookie = loginCookie(await registerAndLogin());

        vi.setSystemTime(Date.now() + 59 * 60_000);
        expect((await me(cookie)).status).toBe(200);

        vi.setSystemTime(Date.now() + 2 * 60_000);
        expect((await me(cookie)).status).toBe(401);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('Login', () => {
    it('sets an HttpOnly, SameSite=Lax cookie lasting an hour', async () => {
      const res = await registerAndLogin();

      const [cookie] = setCookies(res);
      expect(cookie).toMatch(/^access_token=[\w-]+\.[\w-]+\.[\w-]+;/);
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Lax');
      expect(cookie).toContain('Max-Age=3600');
      expect(cookie).not.toContain('Secure');
    });

    it('sets the login cookie and returns the User, whatever the email capitalisation', async () => {
      const registered = await register('ann@example.com', 'correct horse');

      const res = await login('  ANN@Example.com ', 'correct horse');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: registered.body.id,
        email: 'ann@example.com',
      });
      const [cookie] = setCookies(res);
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Lax');
      expect((await me(loginCookie(res))).status).toBe(200);
    });

    it('answers a wrong password and an unknown email with the identical 401 and no cookie', async () => {
      await register('ann@example.com', 'correct horse');

      const wrongPassword = await login('ann@example.com', 'wrong password');
      const unknownEmail = await login('nobody@example.com', 'correct horse');

      expect(wrongPassword.status).toBe(401);
      expect(unknownEmail.status).toBe(401);
      expect(unknownEmail.body).toEqual(wrongPassword.body);
      expect(setCookies(wrongPassword)).toEqual([]);
      expect(setCookies(unknownEmail)).toEqual([]);
    });

    it.each([
      [{ email: 'ann@example.com' }],
      [{ password: 'correct horse' }],
      [{ email: 42, password: 'correct horse' }],
      [{ email: 'ann@example.com', password: 'a'.repeat(129) }],
      [{ email: 'ann@example.com', password: 'correct horse', admin: true }],
    ])('rejects the malformed body %j with 400', async (body) => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(body);

      expect(res.status).toBe(400);
    });
  });

  describe('Logout', () => {
    it('clears the login cookie', async () => {
      const browser = request.agent(app.getHttpServer());
      const credentials = {
        email: 'ann@example.com',
        password: 'correct horse',
      };
      await browser.post('/auth/register').send(credentials);
      await browser.post('/auth/login').send(credentials);
      expect((await browser.get('/auth/me')).status).toBe(200);

      const res = await browser.post('/auth/logout');

      expect(res.status).toBe(204);
      expect(setCookies(res)[0]).toMatch(
        /^access_token=;.*Expires=Thu, 01 Jan 1970/,
      );
      expect((await browser.get('/auth/me')).status).toBe(401);
    });
  });
});

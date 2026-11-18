import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, resetUsers, setCookies } from './app.js';

describe('Register (POST /auth/register)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });
  beforeEach(() => resetUsers(app));

  afterAll(() => app.close());

  const register = (body: object) =>
    request(app.getHttpServer()).post('/auth/register').send(body);

  it('creates a User and returns only its id and email', async () => {
    const res = await register({
      email: 'ann@example.com',
      password: 'correct horse',
    });

    expect(res.status).toBe(201);
    expect(Object.keys(res.body).sort()).toEqual(['email', 'id']);
    expect(res.body.email).toBe('ann@example.com');
    expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(res.text).not.toContain('correct horse');
  });

  it('does not log the new User in: no cookie is set', async () => {
    const res = await register({
      email: 'ann@example.com',
      password: 'correct horse',
    });

    expect(res.status).toBe(201);
    expect(setCookies(res)).toEqual([]);
  });

  it('trims and lower-cases the email', async () => {
    const res = await register({
      email: '  Ann@Example.COM ',
      password: 'correct horse',
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('ann@example.com');
  });

  it.each(['ann@example.com', 'ANN@Example.com', '  ann@example.com  '])(
    'rejects an already registered email (%j) with 409',
    async (email) => {
      await register({ email: 'ann@example.com', password: 'correct horse' });

      const res = await register({ email, password: 'another pass' });

      expect(res.status).toBe(409);
      expect(res.text).not.toContain('another pass');
    },
  );

  it.each(['not-an-email', 'ann@', '', 42, null])(
    'rejects a malformed email (%j) with 400',
    async (email) => {
      const res = await register({ email, password: 'correct horse' });

      expect(res.status).toBe(400);
    },
  );

  it.each([8, 128])('accepts a %i-character password', async (length) => {
    const res = await register({
      email: 'ann@example.com',
      password: 'a'.repeat(length),
    });

    expect(res.status).toBe(201);
  });

  it.each(['a'.repeat(7), 'a'.repeat(129), '', 12345678, null, undefined])(
    'rejects an invalid password (%j) with 400',
    async (password) => {
      const res = await register({ email: 'ann@example.com', password });

      expect(res.status).toBe(400);
    },
  );

  it('rejects unknown properties with 400', async () => {
    const res = await register({
      email: 'ann@example.com',
      password: 'correct horse',
      id: '00000000-0000-0000-0000-000000000000',
    });

    expect(res.status).toBe(400);
  });
});

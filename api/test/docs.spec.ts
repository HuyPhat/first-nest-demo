import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './app.js';

describe('API documentation', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(() => app.close());

  it('serves the OpenAPI document listing Register, Login, Logout and Me', async () => {
    const res = await request(app.getHttpServer()).get('/docs-json');

    expect(res.status).toBe(200);
    expect(Object.keys(res.body.paths)).toEqual(
      expect.arrayContaining([
        '/auth/register',
        '/auth/login',
        '/auth/logout',
        '/auth/me',
      ]),
    );
  });
});

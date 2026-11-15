import type { INestApplication } from '@nestjs/common';
import { getDrizzleToken } from '@nestjs/drizzle';
import { Test } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Response } from 'supertest';
import { AppModule } from '../src/app.module.js';

export async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

export const resetUsers = (app: INestApplication) =>
  app.get<NodePgDatabase>(getDrizzleToken()).execute(sql`truncate users`);

/** All Set-Cookie header values of a response. */
export const setCookies = (res: Response) =>
  (res.headers['set-cookie'] ?? []) as unknown as string[];

/** The `name=value` pair of the login cookie, ready to send back as a Cookie header. */
export const loginCookie = (res: Response) =>
  setCookies(res)
    .find((c) => c.startsWith('access_token='))
    ?.split(';')[0] ?? '';

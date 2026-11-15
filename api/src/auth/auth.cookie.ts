import type { CookieOptions, Response } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const ACCESS_TOKEN_TTL_SECONDS = 3600;

// Secure in production; local development and tests run over plain http.
const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});

export const setLoginCookie = (res: Response, token: string) =>
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    ...cookieOptions(),
    maxAge: ACCESS_TOKEN_TTL_SECONDS * 1000,
  });

export const clearLoginCookie = (res: Response) =>
  res.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions());

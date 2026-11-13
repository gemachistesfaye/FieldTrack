import { CookieOptions } from 'express';
import { env } from './env.js';

export const REFRESH_COOKIE_NAME = 'fieldsync_refresh_token';

/**
 * Returns hardened cookie configuration options for refresh tokens.
 * - httpOnly prevents client-side JavaScript access (mitigating XSS).
 * - sameSite protects against CSRF.
 * - secure ensures cookies are transmitted over TLS in production.
 */
export const getRefreshCookieOptions = (): CookieOptions => {
  const isProduction = env.nodeEnv === 'production';

  return {
    httpOnly: true,
    secure: env.cookieSecure || isProduction,
    sameSite: env.cookieSameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };
};

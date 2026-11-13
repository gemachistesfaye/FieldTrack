import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';
import { REFRESH_COOKIE_NAME } from '../src/config/jwt.js';
import { randomUUID } from 'crypto';

describe('Authentication & Authorization API (/api/auth)', () => {
  const app = createApp();

  const testUserPassword = 'Password123!';

  describe('POST /api/auth/register', () => {
    it('should register a new user with default FIELD_WORKER role', async () => {
      const email = `worker.${randomUUID().substring(0, 8)}@fieldsync.local`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test Field Technician',
          email,
          password: testUserPassword,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe(email);
      expect(res.body.data.user.role).toBe('FIELD_WORKER');
      expect(res.body.data.user.isActive).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user).not.toHaveProperty('passwordHash');

      // Refresh cookie should be set
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain(REFRESH_COOKIE_NAME);
      expect(cookies[0]).toContain('HttpOnly');
    });

    it('should prevent privilege escalation: reject public registration with ADMIN or COORDINATOR role', async () => {
      const email = `attacker.${randomUUID().substring(0, 8)}@fieldsync.local`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Malicious Actor',
          email,
          password: testUserPassword,
          role: 'ADMIN',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(JSON.stringify(res.body.errors)).toContain('restricted to FIELD_WORKER accounts only');
    });

    it('should reject registration with duplicate email address', async () => {
      const email = `duplicate.${randomUUID().substring(0, 8)}@fieldsync.local`;

      // 1. Initial registration
      await request(app).post('/api/auth/register').send({
        fullName: 'First Register',
        email,
        password: testUserPassword,
      });

      // 2. Duplicate registration attempt
      const res = await request(app).post('/api/auth/register').send({
        fullName: 'Second Register Same Email',
        email,
        password: testUserPassword,
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject weak password shorter than 8 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        fullName: 'Short Pass User',
        email: `shortpass.${randomUUID().substring(0, 8)}@fieldsync.local`,
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(JSON.stringify(res.body.errors)).toContain('at least 8 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials and return access token + cookie', async () => {
      const email = `login.test.${randomUUID().substring(0, 8)}@fieldsync.local`;

      await request(app).post('/api/auth/register').send({
        fullName: 'Login Test User',
        email,
        password: testUserPassword,
      });

      const res = await request(app).post('/api/auth/login').send({
        email,
        password: testUserPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(email);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data.user).not.toHaveProperty('passwordHash');

      const cookies = res.headers['set-cookie'];
      expect(cookies[0]).toContain(REFRESH_COOKIE_NAME);
      expect(cookies[0]).toContain('HttpOnly');
    });

    it('should reject login with incorrect password with 401', async () => {
      const email = `wrongpass.${randomUUID().substring(0, 8)}@fieldsync.local`;

      await request(app).post('/api/auth/register').send({
        fullName: 'Wrong Pass User',
        email,
        password: testUserPassword,
      });

      const res = await request(app).post('/api/auth/login').send({
        email,
        password: 'CompletelyWrongPassword123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should reject login for deactivated user with 403', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'deactivated.worker@fieldsync.local',
        password: 'Password123!',
      });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('deactivated');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return authenticated user profile when Bearer token is provided', async () => {
      const email = `me.test.${randomUUID().substring(0, 8)}@fieldsync.local`;

      const regRes = await request(app).post('/api/auth/register').send({
        fullName: 'Me Test User',
        email,
        password: testUserPassword,
      });

      const token = regRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(email);
      expect(res.body.data.fullName).toBe('Me Test User');
      expect(res.body.data.role).toBe('FIELD_WORKER');
    });

    it('should reject request without Bearer token with 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject request with forged/invalid token with 401', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.forged.jwt.token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh & Token Rotation', () => {
    it('should rotate refresh token and issue a fresh access token', async () => {
      const email = `refresh.test.${randomUUID().substring(0, 8)}@fieldsync.local`;

      const loginRes = await request(app).post('/api/auth/register').send({
        fullName: 'Refresh Test User',
        email,
        password: testUserPassword,
      });

      const initialCookie = loginRes.headers['set-cookie'];
      const rawRefreshToken = loginRes.body.data.refreshToken;

      // Request new token pair using the refresh token
      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', initialCookie)
        .send({ refreshToken: rawRefreshToken });

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.data).toHaveProperty('accessToken');
      expect(refreshRes.body.data).toHaveProperty('refreshToken');
      expect(refreshRes.body.data.refreshToken).not.toBe(rawRefreshToken);
    });

    it('should detect refresh token reuse attack and revoke all user sessions', async () => {
      const email = `reuse.test.${randomUUID().substring(0, 8)}@fieldsync.local`;

      const loginRes = await request(app).post('/api/auth/register').send({
        fullName: 'Reuse Test User',
        email,
        password: testUserPassword,
      });

      const initialRefreshToken = loginRes.body.data.refreshToken;
      const initialCookie = loginRes.headers['set-cookie'];

      // Legitimate first refresh (rotates and revokes initialRefreshToken)
      const firstRefreshRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', initialCookie)
        .send({ refreshToken: initialRefreshToken });

      expect(firstRefreshRes.status).toBe(200);

      // Malicious or replayed second refresh with the already-revoked initialRefreshToken
      const attackRes = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', initialCookie)
        .send({ refreshToken: initialRefreshToken });

      expect(attackRes.status).toBe(401);
      expect(attackRes.body.message).toContain('reuse detected');

      // Verify that all active tokens for this user have now been revoked
      const user = await prisma.user.findUnique({ where: { email } });
      const activeTokens = await prisma.refreshToken.findMany({
        where: { userId: user!.id, isRevoked: false },
      });
      expect(activeTokens.length).toBe(0);
    });
  });

  describe('POST /api/auth/logout and /api/auth/logout-all', () => {
    it('should revoke session on logout and clear cookie', async () => {
      const email = `logout.test.${randomUUID().substring(0, 8)}@fieldsync.local`;

      const regRes = await request(app).post('/api/auth/register').send({
        fullName: 'Logout Test User',
        email,
        password: testUserPassword,
      });

      const cookie = regRes.headers['set-cookie'];
      const rawRefreshToken = regRes.body.data.refreshToken;

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookie)
        .send({ refreshToken: rawRefreshToken });

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Attempting to refresh with the logged-out token should now fail
      const refreshAttempt = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookie)
        .send({ refreshToken: rawRefreshToken });

      expect(refreshAttempt.status).toBe(401);
    });

    it('should revoke all active sessions on logout-all', async () => {
      const email = `logoutall.test.${randomUUID().substring(0, 8)}@fieldsync.local`;

      const regRes = await request(app).post('/api/auth/register').send({
        fullName: 'Logout All User',
        email,
        password: testUserPassword,
      });

      const token = regRes.body.data.accessToken;

      // Simulate second login session (e.g. from mobile device)
      const login2 = await request(app).post('/api/auth/login').send({
        email,
        password: testUserPassword,
      });
      const refresh2 = login2.body.data.refreshToken;

      // Call logout-all
      const logoutAllRes = await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutAllRes.status).toBe(200);
      expect(logoutAllRes.body.message).toContain('All active sessions');

      // Verify second session's refresh token is now revoked
      const refreshAttempt = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: refresh2 });

      expect(refreshAttempt.status).toBe(401);
    });
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';
import { SecurityUtil } from '../src/utils/security.js';
import { randomUUID } from 'crypto';

describe('User Management API & RBAC (/api/users)', () => {
  const app = createApp();

  let adminToken: string;
  let coordinatorToken: string;
  let workerToken: string;

  beforeAll(async () => {
    // Fetch seeded users directly from database
    const [admin, coord, worker] = await Promise.all([
      prisma.user.findUnique({ where: { email: 'admin@fieldsync.local' } }),
      prisma.user.findUnique({ where: { email: 'marcus.vance@fieldsync.local' } }),
      prisma.user.findUnique({ where: { email: 'amina.osei@fieldsync.local' } }),
    ]);

    if (!admin || !coord || !worker) {
      throw new Error('Required seeded test users not found in database. Run db:seed.');
    }

    adminToken = SecurityUtil.generateAccessToken(admin);
    coordinatorToken = SecurityUtil.generateAccessToken(coord);
    workerToken = SecurityUtil.generateAccessToken(worker);
  });

  describe('GET /api/users - User Listing Access Control', () => {
    it('should ALLOW Admin to view user list', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should ALLOW Coordinator to view user list for assignment coordination', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${coordinatorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should FORBID Field Worker from viewing user list', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${workerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Forbidden');
    });
  });

  describe('POST /api/users - User Provisioning Permissions', () => {
    it('should ALLOW Admin to provision a new user with any role', async () => {
      const email = `provisioned.${randomUUID().substring(0, 8)}@fieldsync.local`;
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Provisioned Coordinator',
          email,
          password: 'Password123!',
          role: 'COORDINATOR',
          isActive: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('COORDINATOR');
      expect(res.body.data.email).toBe(email);
    });

    it('should FORBID Coordinator from creating new users', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${coordinatorToken}`)
        .send({
          fullName: 'Unauthorized Provisioning',
          email: `unauthorized.${randomUUID().substring(0, 8)}@fieldsync.local`,
          password: 'Password123!',
          role: 'FIELD_WORKER',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should FORBID Field Worker from creating new users', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          fullName: 'Unauthorized Worker Attempt',
          email: `worker.attempt.${randomUUID().substring(0, 8)}@fieldsync.local`,
          password: 'Password123!',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/users/:id - Account Modification & Deactivation', () => {
    it('should ALLOW Admin to deactivate an account and prevent subsequent login', async () => {
      // 1. Create a user to deactivate
      const email = `to.deactivate.${randomUUID().substring(0, 8)}@fieldsync.local`;
      const createRes = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'User To Deactivate',
          email,
          password: 'Password123!',
          role: 'FIELD_WORKER',
          isActive: true,
        });

      const userId = createRes.body.data.id;

      // 2. Deactivate the account via Admin PATCH
      const patchRes = await request(app)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.isActive).toBe(false);

      // 3. Verify user can no longer log in
      const loginAttempt = await request(app).post('/api/auth/login').send({
        email,
        password: 'Password123!',
      });

      expect(loginAttempt.status).toBe(403);
      expect(loginAttempt.body.message).toContain('deactivated');
    });
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';
import { SecurityUtil } from '../src/utils/security.js';
import { randomUUID } from 'crypto';

describe('Report API Endpoints & Role-Based Access Control', () => {
  const app = createApp();

  let adminToken: string;
  let coordinatorToken: string;
  let worker1Token: string;
  let worker2Token: string;
  let worker1Id: string;

  beforeAll(async () => {
    // Fetch seeded users directly from database to avoid slow sequential bcrypt calls
    const [admin, coord, worker1, worker2] = await Promise.all([
      prisma.user.findUnique({ where: { email: 'admin@fieldsync.local' } }),
      prisma.user.findUnique({ where: { email: 'marcus.vance@fieldsync.local' } }),
      prisma.user.findUnique({ where: { email: 'amina.osei@fieldsync.local' } }),
      prisma.user.findUnique({ where: { email: 'samuel.kiprop@fieldsync.local' } }),
    ]);

    if (!admin || !coord || !worker1 || !worker2) {
      throw new Error('Required seeded test users not found in database. Run db:seed.');
    }

    adminToken = SecurityUtil.generateAccessToken(admin);
    coordinatorToken = SecurityUtil.generateAccessToken(coord);
    worker1Token = SecurityUtil.generateAccessToken(worker1);
    worker2Token = SecurityUtil.generateAccessToken(worker2);
    worker1Id = worker1.id;
  });

  describe('Authentication Enforcement', () => {
    it('should reject unauthenticated request with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/reports');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Authentication required');
    });

    it('should reject request with invalid Bearer token with 401', async () => {
      const res = await request(app)
        .get('/api/reports')
        .set('Authorization', 'Bearer invalid.token.payload');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/reports - Creation & Validation', () => {
    it('should successfully create a new incident report when authenticated', async () => {
      const clientId = randomUUID();
      const payload = {
        clientId,
        title: 'Leaking Distribution Valve at Sector 4',
        description: 'Underground high-pressure pipe seal cracked, causing moderate water seepage.',
        category: 'WATER',
        location: 'Sector 4 Distribution Manhole 12',
        priority: 'HIGH',
        status: 'SUBMITTED',
        latitude: -1.305,
        longitude: 36.791,
      };

      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.category).toBe('WATER');
      expect(res.body.data.priority).toBe('HIGH');
      expect(res.body.data.status).toBe('SUBMITTED');
      expect(res.body.data.clientId).toBe(clientId);
      expect(res.body.data.createdById).toBe(worker1Id);
      expect(res.body.meta).toEqual({ isDuplicate: false });
    });

    it('should reject invalid report input with 400 Bad Request', async () => {
      const invalidPayload = {
        title: 'Hi', // Too short (min 3)
        description: 'Short', // Too short (min 10)
        category: 'NON_EXISTENT_CATEGORY', // Invalid enum
        location: '', // Empty (min 2)
      };

      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`)
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Validation failed');
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-UUID clientId format with 400', async () => {
      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`)
        .send({
          clientId: 'invalid-client-uuid-123',
          title: 'Valid Report Title',
          description: 'Valid description that has enough characters for validation.',
          category: 'EQUIPMENT',
          location: 'Valid Location Landmark',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(JSON.stringify(res.body.errors)).toContain('Client ID must be a valid UUID');
    });

    it('should handle duplicate clientId idempotently without creating duplicates', async () => {
      const uniqueClientId = randomUUID();
      const payload = {
        clientId: uniqueClientId,
        title: 'Substation Transformer Relay Trip Test',
        description: 'Tripped circuit breaker observed during routine morning patrol.',
        category: 'ELECTRICAL',
        location: 'Substation Yard C Relay Panel 2',
        priority: 'MEDIUM',
      };

      // 1. Initial creation
      const firstRes = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`)
        .send(payload);
      expect(firstRes.status).toBe(201);
      const originalReportId = firstRes.body.data.id;

      // 2. Repeated submission (simulating offline client retry)
      const secondRes = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`)
        .send(payload);

      expect(secondRes.status).toBe(200);
      expect(secondRes.body).toHaveProperty('success', true);
      expect(secondRes.body.data.id).toBe(originalReportId);
      expect(secondRes.body.meta).toEqual({ isDuplicate: true });
      expect(secondRes.body.message).toContain('idempotent');
    });
  });

  describe('Role-Based Access Control (RBAC) & Scoping', () => {
    let worker1ReportId: string;

    beforeAll(async () => {
      // Create a report specifically owned by Worker 1
      const res = await request(app)
        .post('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`)
        .send({
          title: 'Isolated Valve Failure at Pump Station Alpha',
          description: 'High pressure flange bolt sheared off causing immediate emergency isolation.',
          category: 'WATER',
          location: 'Pump Station Alpha Valve Chamber 1',
          priority: 'CRITICAL',
        });
      worker1ReportId = res.body.data.id;
    });

    it('should allow creator field worker to view their own report', async () => {
      const res = await request(app)
        .get(`/api/reports/${worker1ReportId}`)
        .set('Authorization', `Bearer ${worker1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(worker1ReportId);
    });

    it('should FORBID another field worker from viewing a private report they did not create', async () => {
      const res = await request(app)
        .get(`/api/reports/${worker1ReportId}`)
        .set('Authorization', `Bearer ${worker2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Field workers can only view their own reports');
    });

    it('should ALLOW a coordinator to view any field worker report', async () => {
      const res = await request(app)
        .get(`/api/reports/${worker1ReportId}`)
        .set('Authorization', `Bearer ${coordinatorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(worker1ReportId);
    });

    it('should ALLOW an admin to view any report in the system', async () => {
      const res = await request(app)
        .get(`/api/reports/${worker1ReportId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(worker1ReportId);
    });

    it('should automatically scope GET /api/reports for field workers to only their own reports', async () => {
      const res = await request(app)
        .get('/api/reports')
        .set('Authorization', `Bearer ${worker1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      // Verify every returned report belongs to Worker 1
      for (const item of res.body.data) {
        expect(item.createdById).toBe(worker1Id);
      }
    });

    it('should allow coordinators to update report workflow status and assignment', async () => {
      const res = await request(app)
        .patch(`/api/reports/${worker1ReportId}`)
        .set('Authorization', `Bearer ${coordinatorToken}`)
        .send({
          status: 'IN_PROGRESS',
          priority: 'HIGH',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('IN_PROGRESS');
      expect(res.body.data.priority).toBe('HIGH');
    });

    it('should FORBID field workers from reassigning or updating submitted report statuses', async () => {
      const res = await request(app)
        .patch(`/api/reports/${worker1ReportId}`)
        .set('Authorization', `Bearer ${worker1Token}`)
        .send({
          status: 'RESOLVED',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('DRAFT');
    });
  });

  describe('GET /api/reports/:id - General Retrieval', () => {
    it('should return 404 for nonexistent report UUID', async () => {
      const nonexistentId = randomUUID();
      const res = await request(app)
        .get(`/api/reports/${nonexistentId}`)
        .set('Authorization', `Bearer ${coordinatorToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });

    it('should return 400 for malformed report ID parameter', async () => {
      const res = await request(app)
        .get('/api/reports/not-a-valid-uuid')
        .set('Authorization', `Bearer ${coordinatorToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/health Endpoint', () => {
    it('should return healthy status when connected to PostgreSQL (publicly accessible)', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(res.body.data.database.status).toBe('connected');
    });
  });
});

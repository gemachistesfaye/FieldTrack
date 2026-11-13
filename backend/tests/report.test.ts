import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { randomUUID } from 'crypto';

describe('Report API Endpoints', () => {
  const app = createApp();

  describe('POST /api/reports - Creation & Validation', () => {
    it('should successfully create a new incident report with valid input', async () => {
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

      const res = await request(app).post('/api/reports').send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.category).toBe('WATER');
      expect(res.body.data.priority).toBe('HIGH');
      expect(res.body.data.status).toBe('SUBMITTED');
      expect(res.body.data.clientId).toBe(clientId);
      expect(res.body.meta).toEqual({ isDuplicate: false });
    });

    it('should reject invalid report input with 400 Bad Request', async () => {
      const invalidPayload = {
        title: 'Hi', // Too short (min 3)
        description: 'Short', // Too short (min 10)
        category: 'NON_EXISTENT_CATEGORY', // Invalid enum
        location: '', // Empty (min 2)
      };

      const res = await request(app).post('/api/reports').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Validation failed');
      expect(res.body).toHaveProperty('errors');
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should reject non-UUID clientId format with 400', async () => {
      const res = await request(app).post('/api/reports').send({
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
      const firstRes = await request(app).post('/api/reports').send(payload);
      expect(firstRes.status).toBe(201);
      const originalReportId = firstRes.body.data.id;

      // 2. Repeated submission (simulating offline client retry)
      const secondRes = await request(app).post('/api/reports').send(payload);

      expect(secondRes.status).toBe(200);
      expect(secondRes.body).toHaveProperty('success', true);
      expect(secondRes.body.data.id).toBe(originalReportId);
      expect(secondRes.body.meta).toEqual({ isDuplicate: true });
      expect(secondRes.body.message).toContain('idempotent');
    });
  });

  describe('GET /api/reports/:id - Single Report Retrieval', () => {
    it('should retrieve an existing report by UUID with relational details', async () => {
      // First create a report to fetch
      const createRes = await request(app).post('/api/reports').send({
        title: 'Standby Generator Battery Drain Issue',
        description: 'Auxiliary 24V starter battery dropped below 21V during idle standby.',
        category: 'EQUIPMENT',
        location: 'Pump Station Aux Plant Room',
        priority: 'HIGH',
      });

      const reportId = createRes.body.data.id;

      // Retrieve via GET
      const res = await request(app).get(`/api/reports/${reportId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(reportId);
      expect(res.body.data.title).toBe('Standby Generator Battery Drain Issue');
      expect(res.body.data).toHaveProperty('createdBy');
      expect(res.body.data.createdBy).toHaveProperty('fullName');
      expect(res.body.data).toHaveProperty('history');
      expect(Array.isArray(res.body.data.history)).toBe(true);
      expect(res.body.data.history.length).toBeGreaterThan(0);
    });

    it('should return 404 for nonexistent report UUID', async () => {
      const nonexistentId = randomUUID();
      const res = await request(app).get(`/api/reports/${nonexistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });

    it('should return 400 for malformed report ID parameter', async () => {
      const res = await request(app).get('/api/reports/not-a-valid-uuid');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/reports - Listing, Filtering, and Pagination', () => {
    it('should retrieve a paginated list of reports', async () => {
      const res = await request(app).get('/api/reports?page=1&limit=5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('page', 1);
      expect(res.body.meta).toHaveProperty('limit', 5);
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('totalPages');
    });

    it('should filter reports by category', async () => {
      const res = await request(app).get('/api/reports?category=WATER');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const item of res.body.data) {
        expect(item.category).toBe('WATER');
      }
    });

    it('should filter reports by priority', async () => {
      const res = await request(app).get('/api/reports?priority=CRITICAL');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      for (const item of res.body.data) {
        expect(item.priority).toBe('CRITICAL');
      }
    });

    it('should search reports by keyword in title/description', async () => {
      const res = await request(app).get('/api/reports?search=Pump');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/health Endpoint', () => {
    it('should return healthy status when connected to PostgreSQL', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(res.body.data.database.status).toBe('connected');
    });
  });
});

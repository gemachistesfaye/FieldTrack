import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health and System Endpoints', () => {
  const app = createApp();

  it('should return operational status on GET /', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'FieldSync API');
    expect(res.body).toHaveProperty('status', 'operational');
    expect(res.body).toHaveProperty('version', '0.1.0');
  });

  it('should return health check payload on GET /api/v1/health', async () => {
    const res = await request(app).get('/api/v1/health');

    // Health can be 200 (healthy or degraded)
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('status');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(res.body.data).toHaveProperty('uptime');
    expect(res.body.data).toHaveProperty('environment');
    expect(res.body.data).toHaveProperty('database');
  });

  it('should return standard 404 response for unknown routes', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint-xyz');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Route not found');
  });
});

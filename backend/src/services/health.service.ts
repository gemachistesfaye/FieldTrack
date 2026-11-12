import { checkDatabaseConnection } from '../config/database.js';
import { HealthStatus } from '../types/api.js';
import { env } from '../config/env.js';

export class HealthService {
  static async getHealthStatus(): Promise<HealthStatus> {
    const isDbConnected = await checkDatabaseConnection();

    return {
      status: isDbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        message: isDbConnected
          ? 'PostgreSQL connection operational'
          : 'Database unavailable or pending configuration',
      },
      version: '0.1.0',
    };
  }
}

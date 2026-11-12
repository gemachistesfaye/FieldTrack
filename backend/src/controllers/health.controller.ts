import { Request, Response, NextFunction } from 'express';
import { HealthService } from '../services/health.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class HealthController {
  static async check(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await HealthService.getHealthStatus();
      const statusCode = health.status === 'unhealthy' ? 503 : 200;
      ApiResponse.success(res, health, 'FieldSync API service health check', statusCode);
    } catch (error) {
      next(error);
    }
  }
}

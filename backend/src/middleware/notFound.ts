import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';

export function notFound(req: Request, res: Response, next: NextFunction): void {
  next(AppError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

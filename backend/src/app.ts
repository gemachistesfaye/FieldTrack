import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : [env.corsOrigin, 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLogger);

  // Root welcome / basic ping
  app.get('/', (req, res) => {
    res.json({
      name: 'FieldSync API',
      version: '0.1.0',
      description: 'Offline-First Field Issue Reporting & Management System API',
      status: 'operational',
      healthCheck: '/api/v1/health',
    });
  });

  // Direct health route for cloud platforms (Render, Railway, AWS ALB)
  app.use('/health', apiRouter);

  // API endpoints (/api and /api/v1 versioned)
  app.use('/api', apiRouter);
  app.use('/api/v1', apiRouter);

  // Catch-all 404 handler
  app.use(notFound);

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}

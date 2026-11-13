import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { reportRouter } from './report.routes.js';
import { userRouter } from './user.routes.js';

export const apiRouter = Router();

// System Health Endpoint
apiRouter.use('/health', healthRouter);

// Report Management Endpoints
apiRouter.use('/reports', reportRouter);

// User Management Endpoints
apiRouter.use('/users', userRouter);

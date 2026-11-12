import { Router } from 'express';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

// Health check endpoint
apiRouter.use('/health', healthRouter);

// Module route placeholders (to be expanded in subsequent prompts)
// apiRouter.use('/auth', authRouter);
// apiRouter.use('/reports', reportRouter);
// apiRouter.use('/users', userRouter);
// apiRouter.use('/analytics', analyticsRouter);

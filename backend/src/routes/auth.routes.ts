import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, requireActiveUser } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();

// Public Authentication Endpoints
authRouter.post('/register', validate(registerSchema), AuthController.register);
authRouter.post('/login', validate(loginSchema), AuthController.login);
authRouter.post('/refresh', validate(refreshTokenSchema), AuthController.refresh);
authRouter.post('/logout', AuthController.logout);

// Protected User Context Endpoints
authRouter.get('/me', authenticate, requireActiveUser, AuthController.me);
authRouter.post('/logout-all', authenticate, requireActiveUser, AuthController.logoutAll);

import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, requireActiveUser, authorizeRoles } from '../middleware/auth.js';
import { createUserSchema, userIdParamSchema } from '../validators/user.validator.js';

export const userRouter = Router();

// Enforce authentication & active account on all user management routes
userRouter.use(authenticate, requireActiveUser);

// List users (Admin and Coordinator only)
userRouter.get('/', authorizeRoles('ADMIN', 'COORDINATOR'), UserController.getUsers);

// Create user (Admin only)
userRouter.post(
  '/',
  authorizeRoles('ADMIN'),
  validate(createUserSchema),
  UserController.createUser
);

// Get user by ID (Admin and Coordinator only)
userRouter.get(
  '/:id',
  authorizeRoles('ADMIN', 'COORDINATOR'),
  validate(userIdParamSchema),
  UserController.getUserById
);

// Update user role or active status (Admin only)
userRouter.patch(
  '/:id',
  authorizeRoles('ADMIN'),
  validate(userIdParamSchema),
  UserController.updateUser
);

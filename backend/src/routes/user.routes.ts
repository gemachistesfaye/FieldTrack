import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, userIdParamSchema } from '../validators/user.validator.js';

export const userRouter = Router();

// List users
userRouter.get('/', UserController.getUsers);

// Create user
userRouter.post('/', validate(createUserSchema), UserController.createUser);

// Get user by ID
userRouter.get('/:id', validate(userIdParamSchema), UserController.getUserById);

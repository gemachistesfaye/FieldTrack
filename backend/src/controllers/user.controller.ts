import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getUsers();
      ApiResponse.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      ApiResponse.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      ApiResponse.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      ApiResponse.success(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

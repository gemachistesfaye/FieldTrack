import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { REFRESH_COOKIE_NAME, getRefreshCookieOptions } from '../config/jwt.js';
import { AppError } from '../utils/appError.js';

export class AuthController {
  /**
   * POST /api/auth/register
   * Create account (defaults to FIELD_WORKER)
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = {
        deviceInfo: req.headers['user-agent']?.substring(0, 255),
        ipAddress: req.ip,
      };

      const result = await AuthService.register(req.body, meta);

      // Set HTTP-only secure cookie for refresh token
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());

      ApiResponse.created(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          // Expose refreshToken in response body as fallback for non-browser/CLI clients
          refreshToken: result.refreshToken,
        },
        'Account registered successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticate user with credentials
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = {
        deviceInfo: req.headers['user-agent']?.substring(0, 255),
        ipAddress: req.ip,
      };

      const result = await AuthService.login(req.body, meta);

      // Set HTTP-only secure cookie for refresh token
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());

      ApiResponse.success(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        'Authentication successful'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Rotate refresh token and issue fresh access token
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Look for refresh token in HTTP-only cookie first, then request body
      const refreshToken =
        req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

      if (!refreshToken) {
        throw AppError.unauthorized('Refresh token is required');
      }

      const meta = {
        deviceInfo: req.headers['user-agent']?.substring(0, 255),
        ipAddress: req.ip,
      };

      const result = await AuthService.refreshTokens(refreshToken, meta);

      // Set new rotated refresh token in HTTP-only cookie
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, getRefreshCookieOptions());

      ApiResponse.success(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
        'Token refreshed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Revoke current session and clear cookie
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken =
        req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

      await AuthService.logout(refreshToken);

      res.clearCookie(REFRESH_COOKIE_NAME, {
        ...getRefreshCookieOptions(),
        maxAge: 0,
      });

      ApiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout-all
   * Revoke all active sessions for the authenticated user
   */
  static async logoutAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw AppError.unauthorized('Authentication required to terminate all sessions');
      }

      await AuthService.logoutAll(req.user.id);

      res.clearCookie(REFRESH_COOKIE_NAME, {
        ...getRefreshCookieOptions(),
        maxAge: 0,
      });

      ApiResponse.success(
        res,
        null,
        'All active sessions have been revoked successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Return authenticated user profile and role
   */
  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw AppError.unauthorized('Authentication required');
      }

      const user = await AuthService.getCurrentUser(req.user.id);

      ApiResponse.success(res, user, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/auth/profile
   * Update authenticated user's profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw AppError.unauthorized('Authentication required');
      }

      const updated = await AuthService.updateProfile(req.user.id, req.body);
      ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Change authenticated user's password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw AppError.unauthorized('Authentication required');
      }

      await AuthService.changePassword(req.user.id, req.body);
      ApiResponse.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }
}

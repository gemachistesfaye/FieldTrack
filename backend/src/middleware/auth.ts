import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { SecurityUtil } from '../utils/security.js';
import { AppError } from '../utils/appError.js';
import { prisma } from '../config/database.js';
import { AuthUser } from '../types/auth.js';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware: Verify JWT Bearer access token and attach user context to request
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Authentication required: Missing or malformed Bearer token');
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw AppError.unauthorized('Authentication required: Bearer token is empty');
  }

  const payload = SecurityUtil.verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
    isActive: true, // Will be strictly verified by requireActiveUser
  };

  next();
};

/**
 * Middleware: Verify that the authenticated user's account is currently active in the database
 */
export const requireActiveUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      throw AppError.unauthorized('Authentication required before checking active status');
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, isActive: true, role: true, email: true, fullName: true },
    });

    if (!dbUser) {
      throw AppError.unauthorized('User account associated with this token no longer exists');
    }

    if (!dbUser.isActive) {
      throw AppError.forbidden('Your account has been deactivated. Please contact an administrator.');
    }

    // Refresh context with exact DB state
    req.user.role = dbUser.role;
    req.user.isActive = dbUser.isActive;
    req.user.fullName = dbUser.fullName;
    req.user.email = dbUser.email;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Restrict route access to specified roles
 */
export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required before role authorization');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        `Forbidden: Role '${req.user.role}' does not have permission to access this resource`
      );
    }

    next();
  };
};

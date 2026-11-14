import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AccessTokenPayload, RefreshTokenPayload, AuthUser } from '../types/auth.js';
import { AppError } from './appError.js';

const BCRYPT_SALT_ROUNDS = 10;

export class SecurityUtil {
  /**
   * Securely hash a plaintext password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  /**
   * Verify a plaintext password against a stored bcrypt hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Calculate a deterministic SHA-256 hash of a token secret.
   * Stored in the database to prevent raw token exposure in database breaches.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate a short-lived signed JWT access token (15m default)
   */
  static generateAccessToken(user: AuthUser): string {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      type: 'access',
    };

    return jwt.sign(payload, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions['expiresIn'],
      issuer: 'FieldTrack-Auth-Server',
      audience: 'FieldTrack-Clients',
    });
  }

  /**
   * Generate a secure signed refresh token (7d default) with unique jti and calculated expiry
   */
  static generateRefreshToken(userId: string): { token: string; expiresAt: Date } {
    const jti = crypto.randomUUID();
    const payload: RefreshTokenPayload = {
      sub: userId,
      jti,
      type: 'refresh',
    };

    const token = jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
      issuer: 'FieldTrack-Auth-Server',
      audience: 'FieldTrack-Clients',
    });

    // Calculate expiry date: 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return { token, expiresAt };
  }

  /**
   * Verify and decode a JWT access token
   */
  static verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const decoded = jwt.verify(token, env.jwtAccessSecret, {
        issuer: ['FieldTrack-Auth-Server', 'FieldSync-Auth-Server'],
        audience: ['FieldTrack-Clients', 'FieldSync-Clients'],
      }) as AccessTokenPayload;

      if (decoded.type !== 'access') {
        throw AppError.unauthorized('Invalid token type: expected access token');
      }

      return decoded;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof jwt.TokenExpiredError) {
        throw AppError.unauthorized('Access token has expired');
      }
      throw AppError.unauthorized('Invalid access token');
    }
  }

  /**
   * Verify and decode a JWT refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, env.jwtRefreshSecret, {
        issuer: ['FieldTrack-Auth-Server', 'FieldSync-Auth-Server'],
        audience: ['FieldTrack-Clients', 'FieldSync-Clients'],
      }) as RefreshTokenPayload;

      if (decoded.type !== 'refresh') {
        throw AppError.unauthorized('Invalid token type: expected refresh token');
      }

      return decoded;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof jwt.TokenExpiredError) {
        throw AppError.unauthorized('Refresh token has expired. Please sign in again.');
      }
      throw AppError.unauthorized('Invalid refresh token signature');
    }
  }
}

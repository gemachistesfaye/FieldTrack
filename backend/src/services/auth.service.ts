import { prisma } from '../config/database.js';
import { SecurityUtil } from '../utils/security.js';
import { AppError } from '../utils/appError.js';
import {
  AuthResult,
  AuthSessionMeta,
  AuthUser,
  LoginInput,
  RegisterInput,
} from '../types/auth.js';

export class AuthService {
  /**
   * Register a new user.
   * Public registration always assigns the FIELD_WORKER role.
   * Administrative & Coordinator roles must be provisioned by an Administrator.
   */
  static async register(input: RegisterInput, meta?: AuthSessionMeta): Promise<AuthResult> {
    const normalizedEmail = input.email.trim().toLowerCase();

    // 1. Duplicate email check
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw AppError.conflict(`An account with email ${normalizedEmail} already exists`);
    }

    // 2. Hash password securely with bcrypt
    const passwordHash = await SecurityUtil.hashPassword(input.password);

    // 3. Create user in database (enforce FIELD_WORKER for public registration)
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'FIELD_WORKER',
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    // 4. Issue token pair
    const accessToken = SecurityUtil.generateAccessToken(user);
    const { token: refreshToken, expiresAt } = SecurityUtil.generateRefreshToken(user.id);

    // 5. Store SHA-256 hashed refresh token in database
    await prisma.refreshToken.create({
      data: {
        tokenHash: SecurityUtil.hashToken(refreshToken),
        userId: user.id,
        deviceInfo: meta?.deviceInfo || null,
        ipAddress: meta?.ipAddress || null,
        expiresAt,
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate user with email and password
   */
  static async login(input: LoginInput, meta?: AuthSessionMeta): Promise<AuthResult> {
    const normalizedEmail = input.email.trim().toLowerCase();

    // 1. Fetch user by email (including passwordHash)
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Seamless alias resolution between @fieldtrack.local and legacy @fieldsync.local
    if (!user && normalizedEmail.endsWith('@fieldtrack.local')) {
      const alias = normalizedEmail.replace('@fieldtrack.local', '@fieldsync.local');
      user = await prisma.user.findUnique({ where: { email: alias } });
    } else if (!user && normalizedEmail.endsWith('@fieldsync.local')) {
      const alias = normalizedEmail.replace('@fieldsync.local', '@fieldtrack.local');
      user = await prisma.user.findUnique({ where: { email: alias } });
    }

    // 2. Generic authentication failure to mitigate account enumeration
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // 3. Verify password hash
    const isPasswordValid = await SecurityUtil.comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // 4. Verify account active status
    if (!user.isActive) {
      throw AppError.forbidden(
        'Your account has been deactivated. Please contact an administrator.'
      );
    }

    const sanitizedUser: AuthUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    // 5. Issue token pair
    const accessToken = SecurityUtil.generateAccessToken(sanitizedUser);
    const { token: refreshToken, expiresAt } = SecurityUtil.generateRefreshToken(user.id);

    // 6. Store SHA-256 hashed refresh token in database
    await prisma.refreshToken.create({
      data: {
        tokenHash: SecurityUtil.hashToken(refreshToken),
        userId: user.id,
        deviceInfo: meta?.deviceInfo || null,
        ipAddress: meta?.ipAddress || null,
        expiresAt,
      },
    });

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh authentication credentials using token rotation and reuse detection
   */
  static async refreshTokens(
    refreshTokenRaw: string,
    meta?: AuthSessionMeta
  ): Promise<AuthResult> {
    // 1. Verify cryptographic validity of JWT
    const payload = SecurityUtil.verifyRefreshToken(refreshTokenRaw);
    const tokenHash = SecurityUtil.hashToken(refreshTokenRaw);

    // 2. Look up token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw AppError.unauthorized('Invalid refresh token');
    }

    // 3. REUSE DETECTION: If token was already revoked, someone may be replaying an intercepted token!
    if (storedToken.isRevoked) {
      // Revoke all active sessions for this user to protect their account
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, isRevoked: false },
        data: { isRevoked: true },
      });

      throw AppError.unauthorized(
        'Security alert: Refresh token reuse detected. All active sessions have been revoked. Please sign in again.'
      );
    }

    // 4. Check expiration
    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });
      throw AppError.unauthorized('Refresh token has expired. Please sign in again.');
    }

    // 5. Check user account active status
    if (!storedToken.user.isActive) {
      throw AppError.forbidden(
        'Your account has been deactivated. Please contact an administrator.'
      );
    }

    // 6. ROTATION: Revoke current token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const user: AuthUser = {
      id: storedToken.user.id,
      fullName: storedToken.user.fullName,
      email: storedToken.user.email,
      role: storedToken.user.role,
      isActive: storedToken.user.isActive,
    };

    // 7. Issue new access token and new rotated refresh token
    const newAccessToken = SecurityUtil.generateAccessToken(user);
    const { token: newRefreshToken, expiresAt } = SecurityUtil.generateRefreshToken(user.id);

    // 8. Store new hashed refresh token in database
    await prisma.refreshToken.create({
      data: {
        tokenHash: SecurityUtil.hashToken(newRefreshToken),
        userId: user.id,
        deviceInfo: meta?.deviceInfo || storedToken.deviceInfo,
        ipAddress: meta?.ipAddress || storedToken.ipAddress,
        expiresAt,
      },
    });

    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Log out from the current session by revoking the specific refresh token
   */
  static async logout(refreshTokenRaw?: string): Promise<void> {
    if (!refreshTokenRaw) return;

    try {
      const tokenHash = SecurityUtil.hashToken(refreshTokenRaw);
      await prisma.refreshToken.updateMany({
        where: { tokenHash, isRevoked: false },
        data: { isRevoked: true },
      });
    } catch {
      // Silent catch on logout cleanup
    }
  }

  /**
   * Revoke all active sessions for a user (across all devices/browsers)
   */
  static async logoutAll(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Get user profile by ID
   */
  static async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw AppError.notFound('User profile not found');
    }

    if (!user.isActive) {
      throw AppError.forbidden('User account is deactivated');
    }

    return user;
  }

  /**
   * Update authenticated user's own profile (e.g. full name)
   */
  static async updateProfile(userId: string, input: { fullName: string }): Promise<AuthUser> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { fullName: input.fullName.trim() },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    return updated;
  }

  /**
   * Change authenticated user's password
   */
  static async changePassword(
    userId: string,
    input: { currentPassword: string; newPassword: string }
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const isValid = await SecurityUtil.comparePassword(input.currentPassword, user.passwordHash);
    if (!isValid) {
      throw AppError.badRequest('Current password is incorrect');
    }

    const newHash = await SecurityUtil.hashPassword(input.newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Revoke previous refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }
}

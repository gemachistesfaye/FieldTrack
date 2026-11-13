import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface AccessTokenPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  fullName: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string; // User ID
  jti: string; // Unique token identifier for tracking
  type: 'refresh';
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSessionMeta {
  deviceInfo?: string;
  ipAddress?: string;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

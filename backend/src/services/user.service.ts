import { prisma } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import { UserDTO, CreateUserInput } from '../types/user.js';
import { Role } from '@prisma/client';
import { SecurityUtil } from '../utils/security.js';

export interface UpdateUserInput {
  fullName?: string;
  role?: Role;
  isActive?: boolean;
}

export class UserService {
  static async getUsers(): Promise<UserDTO[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  static async getUserById(id: string): Promise<UserDTO> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound(`User with ID ${id} was not found`);
    }

    return user;
  }

  static async createUser(input: CreateUserInput): Promise<UserDTO> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      throw AppError.conflict(`A user with email ${normalizedEmail} already exists`);
    }

    // Ensure password is cryptographically hashed with bcrypt
    const rawPassword = input.password || input.passwordHash || 'DefaultPass123!';
    const passwordHash = rawPassword.startsWith('$2')
      ? rawPassword
      : await SecurityUtil.hashPassword(rawPassword);

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: input.role || 'FIELD_WORKER',
        isActive: input.isActive ?? true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async updateUser(id: string, input: UpdateUserInput): Promise<UserDTO> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound(`User with ID ${id} was not found`);
    }

    const data: { fullName?: string; role?: Role; isActive?: boolean } = {};
    if (input.fullName !== undefined) data.fullName = input.fullName.trim();
    if (input.role !== undefined) data.role = input.role;
    if (input.isActive !== undefined) {
      data.isActive = input.isActive;

      // If user is deactivated, revoke all active refresh tokens immediately
      if (input.isActive === false) {
        await prisma.refreshToken.updateMany({
          where: { userId: id, isRevoked: false },
          data: { isRevoked: true },
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }
}

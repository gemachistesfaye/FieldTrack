import { prisma } from '../config/database.js';
import { AppError } from '../utils/appError.js';
import { UserDTO, CreateUserInput } from '../types/user.js';

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
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw AppError.conflict(`A user with email ${input.email} already exists`);
    }

    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        passwordHash: input.passwordHash,
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
}

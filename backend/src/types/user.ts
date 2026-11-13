import { Role } from './report.js';

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  password?: string;
  passwordHash?: string;
  role?: Role;
  isActive?: boolean;
}

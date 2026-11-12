import { Role } from './report.js';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  phoneNumber?: string | null;
  department?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

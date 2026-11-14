import { apiClient, ApiResponse } from './apiClient';
import { User, Role } from '../types/auth';

export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>('/users');
  },
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${id}`);
  },
  updateUser: async (id: string, data: { role?: Role; isActive?: boolean }): Promise<ApiResponse<User>> => {
    return apiClient.patch<User>(`/users/${id}`, data);
  },
};

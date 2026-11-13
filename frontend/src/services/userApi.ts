import { apiClient, ApiResponse } from './apiClient';
import { User } from '../types/auth';

export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>('/users');
  },
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${id}`);
  },
};

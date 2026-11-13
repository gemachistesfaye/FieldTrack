import { apiClient, ApiResponse } from './apiClient';
import {
  AuthResponseData,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/login', credentials);
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/register', {
      fullName: credentials.fullName,
      email: credentials.email,
      password: credentials.password,
    });
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/me');
  },

  refreshToken: async (): Promise<ApiResponse<AuthResponseData>> => {
    return apiClient.post<AuthResponseData>('/auth/refresh');
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return apiClient.post<null>('/auth/logout');
  },

  logoutAll: async (): Promise<ApiResponse<null>> => {
    return apiClient.post<null>('/auth/logout-all');
  },
};

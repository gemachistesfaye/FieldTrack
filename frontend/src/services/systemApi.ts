import { apiClient, ApiResponse } from './apiClient';

export interface HealthStatusDTO {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  database: {
    status: 'connected' | 'disconnected';
    message: string;
  };
  version: string;
}

export const systemApi = {
  getHealth: async (): Promise<ApiResponse<HealthStatusDTO>> => {
    return apiClient.get<HealthStatusDTO>('/health');
  },
};

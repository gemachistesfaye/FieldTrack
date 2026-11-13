import { apiClient, ApiResponse } from './apiClient';
import { ReportDTO, ReportFilterParams, ReportStatisticsDTO } from '../types/report';

export const reportApi = {
  getReports: async (params?: ReportFilterParams): Promise<ApiResponse<ReportDTO[]>> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.status) query.append('status', params.status);
      if (params.priority) query.append('priority', params.priority);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.assignedToId) query.append('assignedToId', params.assignedToId);
      if (params.createdById) query.append('createdById', params.createdById);
    }
    const queryString = query.toString();
    const endpoint = queryString ? `/reports?${queryString}` : '/reports';
    return apiClient.get<ReportDTO[]>(endpoint);
  },

  getReportById: async (id: string): Promise<ApiResponse<ReportDTO>> => {
    return apiClient.get<ReportDTO>(`/reports/${id}`);
  },

  getReportStatistics: async (): Promise<ApiResponse<ReportStatisticsDTO>> => {
    return apiClient.get<ReportStatisticsDTO>('/reports/statistics');
  },

  createReport: async (data: Partial<ReportDTO>): Promise<ApiResponse<ReportDTO>> => {
    return apiClient.post<ReportDTO>('/reports', data);
  },

  updateReport: async (id: string, data: Partial<ReportDTO>): Promise<ApiResponse<ReportDTO>> => {
    return apiClient.patch<ReportDTO>(`/reports/${id}`, data);
  },
};

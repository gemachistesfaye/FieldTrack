const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  errors?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// In-memory token storage (XSS-safe, never stored in localStorage)
let inMemoryAccessToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAuthToken = (): string | null => {
  return inMemoryAccessToken;
};

// Concurrency mutex for token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string | null) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

async function executeFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (inMemoryAccessToken) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensure HTTP-only cookies are exchanged
  });

  const data = await response.json().catch(() => ({
    success: response.ok,
    message: response.statusText,
  }));

  if (!response.ok) {
    throw new ApiError(data.message || 'API request failed', response.status, data.errors);
  }

  return data as ApiResponse<T>;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    return await executeFetch<T>(endpoint, options);
  } catch (error) {
    // If request failed with 401 Unauthorized and is not already an auth endpoint, attempt silent token refresh
    if (
      error instanceof ApiError &&
      error.statusCode === 401 &&
      !endpoint.includes('/auth/login') &&
      !endpoint.includes('/auth/refresh') &&
      !endpoint.includes('/auth/register')
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Attempt silent refresh using HTTP-only cookie
          const refreshRes = await executeFetch<{ accessToken: string }>('/auth/refresh', {
            method: 'POST',
          });

          const newAccessToken = refreshRes.data.accessToken;
          setAuthToken(newAccessToken);
          isRefreshing = false;
          onTokenRefreshed(newAccessToken);

          // Retry the original request
          return await executeFetch<T>(endpoint, options);
        } catch (refreshErr) {
          isRefreshing = false;
          setAuthToken(null);
          onTokenRefreshed(null);
          throw refreshErr;
        }
      }

      // If refresh is already in progress, queue and wait for the new token
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(newToken => {
          if (newToken) {
            resolve(executeFetch<T>(endpoint, options));
          } else {
            reject(error);
          }
        });
      });
    }

    throw error;
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth';
import { authApi } from '../services/authApi';
import { setAuthToken } from '../services/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  initialUser?: User | null;
  initialLoading?: boolean;
}> = ({ children, initialUser = null, initialLoading }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialUser ? 'mock-valid-token' : null);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialLoading !== undefined ? initialLoading : !initialUser
  );
  const [error, setError] = useState<string | null>(null);

  // Initialize session on application mount via HTTP-only refresh cookie
  useEffect(() => {
    if (initialUser) {
      return; // If test/mock user provided, skip network initialization
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const response = await authApi.refreshToken();
        if (isMounted && response.success && response.data) {
          setAuthToken(response.data.accessToken);
          setToken(response.data.accessToken);
          setUser(response.data.user);
        }
      } catch {
        // No active session or expired refresh token; user remains unauthenticated
        if (isMounted) {
          setAuthToken(null);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        setAuthToken(response.data.accessToken);
        setToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(credentials);
      if (response.success && response.data) {
        setAuthToken(response.data.accessToken);
        setToken(response.data.accessToken);
        setUser(response.data.user);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Clean up local state regardless of server logout status
    } finally {
      setAuthToken(null);
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logoutAll();
    } catch {
      // Clean up local state regardless
    } finally {
      setAuthToken(null);
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    logoutAll,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

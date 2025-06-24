import { useState, useEffect, useCallback } from 'react';
import AuthService from '../services/AuthService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const isAuth = await AuthService.initializeAuth();
        if (isAuth) {
          const currentUser = AuthService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      AuthService.stopAutoRefresh();
    };
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      const response = await AuthService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, []);

  // Check if user has specific permissions (example)
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    // Add your permission logic here
    return true;
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    refreshUser,
    hasPermission,
  };
};
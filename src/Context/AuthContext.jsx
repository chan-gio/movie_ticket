/* eslint-disable no-unused-vars */
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// HOC to protect routes
export const withAuth = WrappedComponent => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading, isInitialized } = useAuthContext();

    // Show loading while initializing
    if (!isInitialized || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

// Component to show only when authenticated
export const AuthenticatedOnly = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuthContext();

  if (!isInitialized || isLoading) {
    return fallback;
  }

  return isAuthenticated ? children : fallback;
};

// Component to show only when not authenticated
export const UnauthenticatedOnly = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuthContext();

  if (!isInitialized || isLoading) {
    return fallback;
  }

  return !isAuthenticated ? children : fallback;
};

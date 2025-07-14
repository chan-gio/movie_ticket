import api from './api';

const AuthService = {
  // Register a new user
  register: async userData => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.status >= 200 && response.status < 300) {
        if (response.data.code === 201) {
          const { user, access_token, refresh_token } = response.data.data;

          // Store tokens and user info
          AuthService.setTokens(access_token, refresh_token);
          AuthService.setUser(user);

          // Start auto refresh timer
          AuthService.startAutoRefresh();

          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to register user');
        }
      } else {
        throw new Error(response.data?.message || 'Failed to register user');
      }
    } catch (error) {
      console.error('Register Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register user';
      throw new Error(errorMessage);
    }
  },

  // Login a user
  login: async credentials => {
    try {
      const response = await api.post('/auth/login', credentials);

      if (response.status >= 200 && response.status < 300) {
        if (response.data.code === 200) {
          const { user, access_token, refresh_token } = response.data.data;

          // Store tokens and user info
          AuthService.setTokens(access_token, refresh_token);
          AuthService.setUser(user);

          // Start auto refresh timer
          AuthService.startAutoRefresh();

          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to login');
        }
      } else {
        throw new Error(response.data?.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to login';
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout API to invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local storage and stop auto refresh
      AuthService.clearAuth();
    }
  },

  // Refresh token manually
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken
      });

      if (response.data.code === 200) {
        const { access_token, refresh_token } = response.data.data;

        AuthService.setTokens(access_token, refresh_token);

        return { access_token, refresh_token };
      } else {
        throw new Error(response.data.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('Refresh Token Error:', error);

      // If refresh fails, clear auth and redirect to login
      AuthService.clearAuth();

      throw error;
    }
  },

  // Auto refresh token based on expiration time
  startAutoRefresh: () => {
    // Clear any existing timer
    AuthService.stopAutoRefresh();

    const accessToken = AuthService.getAccessToken();
    if (!accessToken) return;

    try {
      // Decode JWT to get expiration time
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Refresh token 5 minutes before expiry (or immediately if already expired)
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 1000);


      AuthService.refreshTimer = setTimeout(async () => {
        try {
          await AuthService.refreshToken();
          // Start the timer again for the new token
          AuthService.startAutoRefresh();
        } catch (error) {
          console.error('Auto refresh failed:', error);
          // Redirect to login if auto refresh fails
          if (typeof AuthService.onAuthFailNavigate === 'function') {
            AuthService.onAuthFailNavigate();
          } else {
            window.location.assign('/login');
          }
        }
      }, refreshTime);
    } catch (error) {
      console.error('Error parsing token for auto refresh:', error);
    }
  },

  // Stop auto refresh timer
  stopAutoRefresh: () => {
    if (AuthService.refreshTimer) {
      clearTimeout(AuthService.refreshTimer);
      AuthService.refreshTimer = null;
    }
  },

  // Initialize auth on app start
  initializeAuth: async () => {
    const accessToken = AuthService.getAccessToken();
    const refreshToken = AuthService.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    try {
      // Thử decode accessToken để kiểm tra hạn
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      if (expirationTime < currentTime) {
        // Token đã hết hạn, thử refresh
        await AuthService.refreshToken();
      }
      AuthService.startAutoRefresh();
      return true;
    } catch (error) {
      // Nếu decode lỗi hoặc refresh lỗi thì clearAuth
      try {
        await AuthService.refreshToken();
        AuthService.startAutoRefresh();
        return true;
      } catch (refreshError) {
        console.error('Token refresh failed during initialization:', refreshError);
        AuthService.clearAuth();
        return false;
      }
    }
  },

  // Utility methods
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  setUser: user => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('profile_picture_url');
    localStorage.removeItem('user_role');
    AuthService.stopAutoRefresh();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
  },

  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenNearExpiry: () => {
    const accessToken = AuthService.getAccessToken();
    if (!accessToken) return true;

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Return true if token expires within 5 minutes
      return timeUntilExpiry < 5 * 60 * 1000;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }
};

// Static property to hold the refresh timer
AuthService.refreshTimer = null;

export default AuthService;

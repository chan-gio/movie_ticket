import api from "./api"; // Import the configured Axios instance

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      // Check if the HTTP status is in the success range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Backend uses code 201 for successful registration
        if (response.data.code === 201) {
          const { user, access_token, refresh_token } = response.data.data;
          
          // Lưu token và user info vào localStorage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          return response.data.data; // Returns { user, access_token, refresh_token }
        } else {
          throw new Error(response.data.message || "Failed to register user");
        }
      } else {
        throw new Error(response.data?.message || "Failed to register user");
      }
    } catch (error) {
      console.error("Register Error:", error); // Debug log
      // Prioritize backend error message if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to register user";
      throw new Error(errorMessage);
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Check if the HTTP status is in the success range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Backend uses code 200 for successful login
        if (response.data.code === 200) {
          const { user, access_token, refresh_token } = response.data.data;
          
          // Lưu token và user info vào localStorage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          return response.data.data; // Returns { access_token, refresh_token, user }
        } else {
          throw new Error(response.data.message || "Failed to login");
        }
      } else {
        throw new Error(response.data?.message || "Failed to login");
      }
    } catch (error) {
      console.error("Login Error:", error); // Debug log
      // Prioritize backend error message if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to login";
      throw new Error(errorMessage);
    }
  },

  // Refresh token manually (thường không cần gọi trực tiếp vì đã có auto refresh)
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post("/auth/refresh");
      
      if (response.data.code === 200) {
        const { access_token, refresh_token } = response.data.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        return { access_token, refresh_token };
      } else {
        throw new Error(response.data.message || "Failed to refresh token");
      }
    } catch (error) {
      console.error("Refresh Token Error:", error);
      
      // Nếu refresh thất bại, xóa token và chuyển về login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      throw error;
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra xem user có đang đăng nhập không
  isAuthenticated: () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return !!(accessToken && refreshToken);
  },

  // Lấy access token
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  // Lấy refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  }
};

export default AuthService;
import axios from "axios";
import tokenManager from "./TokenManager";
import AuthService from "./AuthService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});



// Add access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response và auto refresh token khi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu là lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tránh refresh token cho các endpoint auth
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/register') ||
          originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      // Nếu AuthService đang xử lý refresh token, chỉ thêm vào queue
      // và không gọi refresh token từ interceptor
      if (tokenManager.getIsRefreshing()) {
        return new Promise((resolve, reject) => {
          tokenManager.addToQueue(resolve, reject);
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      
      // Thêm request vào queue và trigger refresh nếu cần
      
      return new Promise((resolve, reject) => {
        tokenManager.addToQueue(resolve, reject);
        // Trigger refresh nếu cần
        AuthService.refreshTokenIfNeeded();
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return api(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    return Promise.reject(error);
  }
);

export default api;
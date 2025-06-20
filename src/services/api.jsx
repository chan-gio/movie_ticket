import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến để theo dõi trạng thái đang refresh token
let isRefreshing = false;
let failedQueue = [];

// Xử lý queue khi refresh thành công/thất bại
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

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
      if (originalRequest.url.includes('/auth/auth') || 
          originalRequest.url.includes('/auth/register') ||
          originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}auth/refresh`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.code === 200) {
          const { access_token, refresh_token } = response.data.data;
          
          // Cập nhật token mới vào localStorage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Cập nhật header cho request gốc
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
          
          // Xử lý queue
          processQueue(null, access_token);
          
          // Retry request gốc
          return api(originalRequest);
        } else {
          throw new Error('Refresh token failed');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Xóa token và chuyển về login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Xử lý queue với lỗi
        processQueue(refreshError, null);
        
        // Chuyển về trang login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
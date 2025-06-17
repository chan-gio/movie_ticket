import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add access token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized
axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status === 401) {
            try {
                const refresh_token = localStorage.getItem('refresh_token');
                const response = await axios.post('/api/auth/refresh', {}, {
                    headers: {
                        'Refresh-Token': refresh_token
                    }
                });
                
                // Lưu token mới
                const { access_token, new_refresh_token } = response.data;
                // Cập nhật token trong storage
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', new_refresh_token);
                // Thử lại request ban đầu
                error.config.headers['Authorization'] = 'Bearer ' + access_token;
                return axios(error.config);
            } catch (refreshError) {
                // Nếu refresh thất bại, chuyển về trang login
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
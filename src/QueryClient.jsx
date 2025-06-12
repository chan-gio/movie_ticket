import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache 5 phút
      cacheTime: 10 * 60 * 1000, // Giữ cache 10 phút
      retry: 1, // Thử lại 1 lần nếu lỗi
    },
  },
});

export default queryClient;
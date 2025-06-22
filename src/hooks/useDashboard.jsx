import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardService from '../services/DashboardService';
import dayjs from 'dayjs';

// Default dashboard data structure
const defaultDashboardData = {
  totalBookings: 0,
  totalRevenue: 0,
  recentBookings: [],
  revenueData: [],
  topMovies: [],
  topCinemas: [],
  topMoviesByCinema: [],
};

// Hook để lấy dashboard data
export const useDashboardData = ({ filter = "month", month = null } = {}) => {
  return useQuery({
    queryKey: ['dashboard', filter, month],
    queryFn: async () => {
      try {
        const data = await DashboardService.fetchDashboardData({ filter, month });
        return data;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Return default data on error
        return defaultDashboardData;
      }
    },
    staleTime: 2 * 60 * 1000, // Dữ liệu được coi là fresh trong 2 phút
    cacheTime: 5 * 60 * 1000, // Cache được giữ trong 5 phút
    retry: 2, // Thử lại 2 lần nếu lỗi
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Không refetch khi focus lại window
    refetchOnReconnect: true, // Refetch khi kết nối lại internet
  });
};

// Hook để lấy dashboard data với current month
export const useCurrentMonthDashboard = () => {
  const currentMonth = dayjs().format("YYYY-MM");
  return useDashboardData({ filter: "month", month: currentMonth });
};

// Hook để lấy dashboard data với custom filter
export const useDashboardWithFilter = (filter = "month", month = null) => {
  return useDashboardData({ filter, month });
};

// Hook để refresh dashboard data
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ filter, month }) => {
      return await DashboardService.fetchDashboardData({ filter, month });
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['dashboard', variables.filter, variables.month], data);
      // Invalidate và refetch để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['dashboard']);
    },
    onError: (error) => {
      console.error("Error refreshing dashboard data:", error);
    },
  });
};

// Hook để lấy statistics
export const useDashboardStats = ({ filter = "month", month = null } = {}) => {
  const { data, isLoading, error } = useDashboardData({ filter, month });
  
  return {
    totalBookings: data?.totalBookings || 0,
    totalRevenue: data?.totalRevenue || 0,
    isLoading,
    error,
  };
};

// Hook để lấy revenue data
export const useRevenueData = ({ filter = "month", month = null } = {}) => {
  const { data, isLoading, error } = useDashboardData({ filter, month });
  
  return {
    revenueData: data?.revenueData || [],
    isLoading,
    error,
  };
};

// Hook để lấy top movies
export const useTopMovies = ({ filter = "month", month = null } = {}) => {
  const { data, isLoading, error } = useDashboardData({ filter, month });
  
  return {
    topMovies: data?.topMovies || [],
    isLoading,
    error,
  };
};

// Hook để lấy top cinemas
export const useTopCinemas = ({ filter = "month", month = null } = {}) => {
  const { data, isLoading, error } = useDashboardData({ filter, month });
  
  return {
    topCinemas: data?.topCinemas || [],
    isLoading,
    error,
  };
};

// Hook để lấy top movies by cinema
export const useTopMoviesByCinema = ({ filter = "month", month = null } = {}) => {
  const { data, isLoading, error } = useDashboardData({ filter, month });
  
  return {
    topMoviesByCinema: data?.topMoviesByCinema || [],
    isLoading,
    error,
  };
};

// Hook để lấy recent bookings
export const useRecentBookings = ({ filter = "month", month = null } = {}) => {
  const { data, isLoading, error } = useDashboardData({ filter, month });
  
  return {
    recentBookings: data?.recentBookings || [],
    isLoading,
    error,
  };
}; 
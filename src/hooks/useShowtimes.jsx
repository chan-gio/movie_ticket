import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ShowTimeService from '../services/ShowtimeService';

// Hook để lấy danh sách showtimes với pagination
export const useShowtimes = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['showtimes', page, perPage],
    queryFn: async () => {
      const response = await ShowTimeService.getAllShowTimes(page, perPage);
      return response;
    },
    staleTime: 2 * 60 * 1000, // Dữ liệu được coi là fresh trong 2 phút
    cacheTime: 5 * 60 * 1000, // Cache được giữ trong 5 phút
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Hook để tìm kiếm showtimes
export const useSearchShowtimes = ({ keyword, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['searchShowtimes', keyword, page, perPage],
    queryFn: async () => {
      const response = await ShowTimeService.searchShowtimes(keyword, page, perPage);
      return response;
    },
    enabled: !!keyword, // Chỉ gọi khi có keyword
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy showtime theo ID
export const useShowtimeById = (showtimeId) => {
  return useQuery({
    queryKey: ['showtime', showtimeId],
    queryFn: async () => {
      const showtime = await ShowTimeService.getShowTimeById(showtimeId);
      return showtime;
    },
    enabled: !!showtimeId, // Chỉ gọi khi có showtimeId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho showtime details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy showtimes theo movie ID
export const useShowtimesByMovieId = ({ movieId, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['showtimesByMovie', movieId, page, perPage],
    queryFn: async () => {
      const response = await ShowTimeService.getShowTimesByMovieId(movieId, page, perPage);
      return response;
    },
    enabled: !!movieId, // Chỉ gọi khi có movieId
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo showtime mới
export const useCreateShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (showtimeData) => {
      const response = await ShowTimeService.createShowTime(showtimeData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch showtimes list
      queryClient.invalidateQueries(['showtimes']);
      queryClient.invalidateQueries(['searchShowtimes']);
      queryClient.invalidateQueries(['showtimesByMovie']);
    },
    onError: (error) => {
      console.error("Error creating showtime:", error);
    },
  });
};

// Hook để cập nhật showtime
export const useUpdateShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ showtimeId, showtimeData }) => {
      const response = await ShowTimeService.updateShowTime(showtimeId, showtimeData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['showtime', variables.showtimeId], data);
      // Invalidate showtimes list
      queryClient.invalidateQueries(['showtimes']);
      queryClient.invalidateQueries(['searchShowtimes']);
      queryClient.invalidateQueries(['showtimesByMovie']);
    },
    onError: (error) => {
      console.error("Error updating showtime:", error);
    },
  });
};

// Hook để xóa showtime
export const useDeleteShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (showtimeId) => {
      const response = await ShowTimeService.deleteShowTime(showtimeId);
      return response;
    },
    onSuccess: (_, showtimeId) => {
      // Xóa showtime khỏi cache
      queryClient.removeQueries(['showtime', showtimeId]);
      // Invalidate showtimes list
      queryClient.invalidateQueries(['showtimes']);
      queryClient.invalidateQueries(['searchShowtimes']);
      queryClient.invalidateQueries(['showtimesByMovie']);
    },
    onError: (error) => {
      console.error("Error deleting showtime:", error);
    },
  });
};

// Hook để restore showtime
export const useRestoreShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (showtimeId) => {
      const response = await ShowTimeService.restoreShowTime(showtimeId);
      return response;
    },
    onSuccess: () => {
      // Invalidate showtimes list
      queryClient.invalidateQueries(['showtimes']);
      queryClient.invalidateQueries(['searchShowtimes']);
      queryClient.invalidateQueries(['showtimesByMovie']);
    },
    onError: (error) => {
      console.error("Error restoring showtime:", error);
    },
  });
};

// Hook để refresh showtimes data
export const useRefreshShowtimes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, perPage, keyword }) => {
      if (keyword) {
        return await ShowTimeService.searchShowtimes(keyword, page, perPage);
      } else {
        return await ShowTimeService.getAllShowTimes(page, perPage);
      }
    },
    onSuccess: (data, variables) => {
      if (variables.keyword) {
        queryClient.setQueryData(['searchShowtimes', variables.keyword, variables.page, variables.perPage], data);
      } else {
        queryClient.setQueryData(['showtimes', variables.page, variables.perPage], data);
      }
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['showtimes']);
      queryClient.invalidateQueries(['searchShowtimes']);
    },
    onError: (error) => {
      console.error("Error refreshing showtimes:", error);
    },
  });
};

// Hook để lấy showtimes với search và pagination
export const useShowtimesWithSearch = ({ keyword, page = 1, perPage = 10 } = {}) => {
  const showtimesQuery = useShowtimes({ page, perPage });
  const searchQuery = useSearchShowtimes({ keyword, page, perPage });

  // Trả về query phù hợp dựa trên có keyword hay không
  if (keyword) {
    return {
      ...searchQuery,
      data: searchQuery.data,
      isSearching: true,
    };
  }

  return {
    ...showtimesQuery,
    data: showtimesQuery.data,
    isSearching: false,
  };
}; 
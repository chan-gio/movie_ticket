import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BookingSeatService from '../services/BookingSeatService';

// Hook để lấy tất cả booking seats
export const useBookingSeats = () => {
  return useQuery({
    queryKey: ['bookingSeats'],
    queryFn: async () => {
      const response = await BookingSeatService.getAllBookingSeats();
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

// Hook để lấy booking seat theo ID
export const useBookingSeatById = (bookingSeatId) => {
  return useQuery({
    queryKey: ['bookingSeat', bookingSeatId],
    queryFn: async () => {
      const bookingSeat = await BookingSeatService.getBookingSeatById(bookingSeatId);
      return bookingSeat;
    },
    enabled: !!bookingSeatId, // Chỉ gọi khi có bookingSeatId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho booking seat details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy seats theo showtime ID
export const useSeatsByShowtime = (showtimeId) => {
  return useQuery({
    queryKey: ['seatsByShowtime', showtimeId],
    queryFn: async () => {
      const seats = await BookingSeatService.getSeatsByShowtime(showtimeId);
      return seats;
    },
    enabled: !!showtimeId, // Chỉ gọi khi có showtimeId
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho seats (thay đổi thường xuyên)
    cacheTime: 3 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// Hook để tạo booking seat mới
export const useCreateBookingSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingSeatData) => {
      const response = await BookingSeatService.createBookingSeat(bookingSeatData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate và refetch booking seats list
      queryClient.invalidateQueries(['bookingSeats']);
      // Invalidate seats by showtime nếu có showtimeId
      if (variables.showtime_id) {
        queryClient.invalidateQueries(['seatsByShowtime', variables.showtime_id]);
      }
    },
    onError: (error) => {
      console.error("Error creating booking seat:", error);
    },
  });
};

// Hook để cập nhật booking seat
export const useUpdateBookingSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingSeatId, bookingSeatData }) => {
      const response = await BookingSeatService.updateBookingSeat(bookingSeatId, bookingSeatData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['bookingSeat', variables.bookingSeatId], data);
      // Invalidate booking seats list
      queryClient.invalidateQueries(['bookingSeats']);
      // Invalidate seats by showtime nếu có showtimeId
      if (variables.bookingSeatData.showtime_id) {
        queryClient.invalidateQueries(['seatsByShowtime', variables.bookingSeatData.showtime_id]);
      }
    },
    onError: (error) => {
      console.error("Error updating booking seat:", error);
    },
  });
};

// Hook để soft delete booking seat
export const useSoftDeleteBookingSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingSeatId) => {
      const response = await BookingSeatService.softDeleteBookingSeat(bookingSeatId);
      return response;
    },
    onSuccess: (_, bookingSeatId) => {
      // Xóa booking seat khỏi cache
      queryClient.removeQueries(['bookingSeat', bookingSeatId]);
      // Invalidate booking seats list
      queryClient.invalidateQueries(['bookingSeats']);
      // Invalidate tất cả seats by showtime (vì có thể ảnh hưởng đến nhiều showtime)
      queryClient.invalidateQueries(['seatsByShowtime']);
    },
    onError: (error) => {
      console.error("Error soft deleting booking seat:", error);
    },
  });
};

// Hook để force delete booking seat
export const useForceDeleteBookingSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingSeatId) => {
      const response = await BookingSeatService.forceDeleteBookingSeat(bookingSeatId);
      return response;
    },
    onSuccess: (_, bookingSeatId) => {
      // Xóa booking seat khỏi cache
      queryClient.removeQueries(['bookingSeat', bookingSeatId]);
      // Invalidate booking seats list
      queryClient.invalidateQueries(['bookingSeats']);
      // Invalidate tất cả seats by showtime
      queryClient.invalidateQueries(['seatsByShowtime']);
    },
    onError: (error) => {
      console.error("Error force deleting booking seat:", error);
    },
  });
};

// Hook để tạo nhiều booking seats cùng lúc
export const useCreateMultipleBookingSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingSeatsData) => {
      const promises = bookingSeatsData.map(seatData => 
        BookingSeatService.createBookingSeat(seatData)
      );
      const responses = await Promise.all(promises);
      return responses;
    },
    onSuccess: (data, variables) => {
      // Invalidate và refetch booking seats list
      queryClient.invalidateQueries(['bookingSeats']);
      // Invalidate seats by showtime cho tất cả showtime có liên quan
      const showtimeIds = [...new Set(variables.map(seat => seat.showtime_id))];
      showtimeIds.forEach(showtimeId => {
        queryClient.invalidateQueries(['seatsByShowtime', showtimeId]);
      });
    },
    onError: (error) => {
      console.error("Error creating multiple booking seats:", error);
    },
  });
};

// Hook để refresh seats by showtime
export const useRefreshSeatsByShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (showtimeId) => {
      const seats = await BookingSeatService.getSeatsByShowtime(showtimeId);
      return seats;
    },
    onSuccess: (data, showtimeId) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['seatsByShowtime', showtimeId], data);
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['seatsByShowtime', showtimeId]);
    },
    onError: (error) => {
      console.error("Error refreshing seats by showtime:", error);
    },
  });
};

// Hook để lấy seats với real-time updates
export const useSeatsByShowtimeWithRefresh = (showtimeId, refreshInterval = 30000) => {
  return useQuery({
    queryKey: ['seatsByShowtime', showtimeId],
    queryFn: async () => {
      const seats = await BookingSeatService.getSeatsByShowtime(showtimeId);
      return seats;
    },
    enabled: !!showtimeId,
    staleTime: 0, // Luôn coi là stale để refetch
    cacheTime: 1 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: refreshInterval, // Tự động refetch mỗi 30 giây
    refetchIntervalInBackground: true,
  });
}; 
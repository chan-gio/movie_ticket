import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BookingService from '../services/BookingService';

// Hook để lấy danh sách bookings với pagination
export const useBookings = ({ page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['bookings', page, perPage],
    queryFn: async () => {
      const response = await BookingService.getAllBookings(page, perPage);
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

// Hook để tìm kiếm bookings
export const useSearchBookings = ({ keyword, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['searchBookings', keyword, page, perPage],
    queryFn: async () => {
      const response = await BookingService.searchBooking(keyword, page, perPage);
      return response;
    },
    enabled: !!keyword, // Chỉ gọi khi có keyword
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy booking theo ID
export const useBookingById = (bookingId) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const booking = await BookingService.getBookingById(bookingId);
      return booking;
    },
    enabled: !!bookingId, // Chỉ gọi khi có bookingId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho booking details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy bookings theo user ID
export const useBookingsByUserId = ({ userId, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['bookingsByUser', userId, page, perPage],
    queryFn: async () => {
      const response = await BookingService.getBookingsByUserId(userId, { page, per_page: perPage });
      return response;
    },
    enabled: !!userId, // Chỉ gọi khi có userId
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo booking mới
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await BookingService.createBooking(bookingData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
    },
  });
};

// Hook để cập nhật booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const response = await BookingService.updateBookingStatus(bookingId, status);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['booking', variables.bookingId], data);
      // Invalidate bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error updating booking status:", error);
    },
  });
};

// Hook để cập nhật total price
export const useUpdateTotalPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, totalPrice }) => {
      const response = await BookingService.updateTotalPrice(bookingId, totalPrice);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['booking', variables.bookingId], data);
      // Invalidate bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error updating total price:", error);
    },
  });
};

// Hook để cập nhật order code
export const useUpdateOrderCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, orderCode }) => {
      const response = await BookingService.updateOrderCode(bookingId, orderCode);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['booking', variables.bookingId], data);
      // Invalidate bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error updating order code:", error);
    },
  });
};

// Hook để cập nhật coupon
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, couponCode }) => {
      const response = await BookingService.updateCoupon(bookingId, couponCode);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['booking', variables.bookingId], data);
      // Invalidate bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error updating coupon:", error);
    },
  });
};

// Hook để cập nhật barcode
export const useUpdateBarcode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, barcodeUrl }) => {
      const response = await BookingService.updateBarcode(bookingId, barcodeUrl);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['booking', variables.bookingId], data);
      // Invalidate bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error updating barcode:", error);
    },
  });
};

// Hook để xóa booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
      const response = await BookingService.deleteBooking(bookingId);
      return response;
    },
    onSuccess: (_, bookingId) => {
      // Xóa booking khỏi cache
      queryClient.removeQueries(['booking', bookingId]);
      // Invalidate bookings list
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
      queryClient.invalidateQueries(['bookingsByUser']);
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
    },
  });
};

// Hook để refresh bookings data
export const useRefreshBookings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ page, perPage, keyword }) => {
      if (keyword) {
        return await BookingService.searchBooking(keyword, page, perPage);
      } else {
        return await BookingService.getAllBookings(page, perPage);
      }
    },
    onSuccess: (data, variables) => {
      if (variables.keyword) {
        queryClient.setQueryData(['searchBookings', variables.keyword, variables.page, variables.perPage], data);
      } else {
        queryClient.setQueryData(['bookings', variables.page, variables.perPage], data);
      }
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['bookings']);
      queryClient.invalidateQueries(['searchBookings']);
    },
    onError: (error) => {
      console.error("Error refreshing bookings:", error);
    },
  });
};

// Hook để lấy bookings với search và pagination
export const useBookingsWithSearch = ({ keyword, page = 1, perPage = 10 } = {}) => {
  const bookingsQuery = useBookings({ page, perPage });
  const searchQuery = useSearchBookings({ keyword, page, perPage });

  // Trả về query phù hợp dựa trên có keyword hay không
  if (keyword) {
    return {
      ...searchQuery,
      data: searchQuery.data,
      isSearching: true,
    };
  }

  return {
    ...bookingsQuery,
    data: bookingsQuery.data,
    isSearching: false,
  };
}; 
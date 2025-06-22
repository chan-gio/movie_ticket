import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import BookingService from '../services/BookingService';
import { toast } from 'react-toastify';

// Format order history data for display
const formatOrderHistory = (bookings) =>
  bookings.map((booking) => ({
    id: booking.booking_id,
    date: new Date(booking.showtime.start_time).toLocaleString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    movie: booking.showtime.movie.title,
    orderCode: booking.order_code,
    status: booking.status === 'CONFIRMED' ? 'active' : 
            booking.status === 'PENDING' ? 'pending' : 
            booking.status === 'CANCELLED' ? 'cancelled' : booking.status,
    createdAt: new Date(booking.created_at).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  }));

// Main hook for order history with pagination
export const useOrderHistory = (userId, initialPage = 1, initialPageSize = 10) => {
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialPageSize,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orderHistory', userId, pagination.current, pagination.pageSize],
    queryFn: async () => {
      const response = await BookingService.getBookingsByUserId(userId, { 
        page: pagination.current, 
        per_page: pagination.pageSize 
      });
      return {
        orders: formatOrderHistory(response.data),
        pagination: {
          current: response.current_page,
          pageSize: response.per_page,
          total: response.total,
        },
      };
    },
    enabled: !!userId,
    keepPreviousData: true, // Smooth pagination transitions
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  // Refresh data
  const refreshData = () => {
    refetch();
  };

  return {
    // Data
    orderHistory: data?.orders || [],
    pagination: data?.pagination || pagination,
    
    // Loading and error states
    isLoading,
    error,
    
    // Actions
    handlePaginationChange,
    refreshData,
    
    // Raw data for advanced usage
    rawData: data,
  };
};

// Hook for canceling a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
      const response = await BookingService.updateBookingStatus(bookingId, 'CANCELLED');
      return response;
    },
    onSuccess: (data, bookingId) => {
      // Update the specific booking in cache
      queryClient.setQueryData(['orderHistory'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          orders: oldData.orders.map(order => 
            order.id === bookingId 
              ? { ...order, status: 'cancelled' }
              : order
          ),
        };
      });
      
      // Invalidate all order history queries to refresh data
      queryClient.invalidateQueries(['orderHistory']);
      
      toast.success('Booking cancelled successfully');
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
};

// Hook for getting a single booking by ID
export const useBookingById = (bookingId) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const booking = await BookingService.getBookingById(bookingId);
      return booking;
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook for searching orders
export const useSearchOrders = (userId, searchTerm, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['searchOrders', userId, searchTerm, page, pageSize],
    queryFn: async () => {
      const response = await BookingService.searchBooking(searchTerm, page, pageSize);
      return {
        orders: formatOrderHistory(response.data),
        pagination: response.pagination,
      };
    },
    enabled: !!userId && !!searchTerm,
    staleTime: 1 * 60 * 1000, // Shorter cache for search results
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook for invalidating order history cache
export const useInvalidateOrderHistory = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries(['orderHistory']);
    queryClient.invalidateQueries(['searchOrders']);
  };
}; 
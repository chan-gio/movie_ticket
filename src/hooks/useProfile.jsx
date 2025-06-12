import { useQuery, useQueryClient } from '@tanstack/react-query';
import UserService from '../services/UserService';
import BookingService from '../services/BookingService';

const formatUserData = (userResponse) => {
  const [firstName, ...lastNameParts] = (userResponse.full_name || '').trim().split(/\s+/);
  return {
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
    email: userResponse.email || '',
    phone: userResponse.phone || '',
    profile_picture_url: userResponse.profile_picture_url || '',
  };
};

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
    status: booking.status === 'CONFIRMED' ? 'active' : booking.status === 'PENDING' ? 'pending' : booking.status === 'CANCELLED' ? 'cancelled' : booking.status,
    createdAt: new Date(booking.created_at).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  }));

export const useUserData = (userId) => {
  return useQuery({
    queryKey: ['userData', userId],
    queryFn: async () => {
      const response = await UserService.getUserById(userId);
      return formatUserData(response);
    },
    enabled: !!userId, // Only fetch if userId exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useOrderHistory = (userId, { page = 1, pageSize = 10 }) => {
  return useQuery({
    queryKey: ['orderHistory', userId, page, pageSize],
    queryFn: async () => {
      const response = await BookingService.getBookingsByUserId(userId, { page, per_page: pageSize });
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
    keepPreviousData: true, // Smooth pagination
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook to invalidate user data after profile update
export const useInvalidateUserData = () => {
  const queryClient = useQueryClient();
  return (userId) => queryClient.invalidateQueries(['userData', userId]);
};
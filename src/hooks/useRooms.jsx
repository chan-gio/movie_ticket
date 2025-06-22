import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RoomService from '../services/RoomService';
import SeatService from '../services/SeatService';

// Hook để lấy tất cả rooms
export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await RoomService.getAllRooms();
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

// Hook để lấy room theo ID
export const useRoomById = (roomId) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const room = await RoomService.getRoomById(roomId);
      return room;
    },
    enabled: !!roomId, // Chỉ gọi khi có roomId
    staleTime: 5 * 60 * 1000, // Cache lâu hơn cho room details
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy rooms theo cinema ID
export const useRoomsByCinemaId = ({ cinemaId, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['roomsByCinema', cinemaId, page, perPage],
    queryFn: async () => {
      const response = await RoomService.getRoomsByCinemaId(cinemaId, page, perPage);
      return response;
    },
    enabled: !!cinemaId, // Chỉ gọi khi có cinemaId
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tìm kiếm rooms theo tên
export const useSearchRooms = ({ keyword } = {}) => {
  return useQuery({
    queryKey: ['searchRooms', keyword],
    queryFn: async () => {
      const response = await RoomService.searchRoomsByName(keyword);
      return response;
    },
    enabled: !!keyword, // Chỉ gọi khi có keyword
    staleTime: 1 * 60 * 1000, // Cache ngắn hơn cho search
    cacheTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo room mới
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomData) => {
      const response = await RoomService.createRoom(roomData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error creating room:", error);
    },
  });
};

// Hook để cập nhật room
export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, roomData }) => {
      const response = await RoomService.updateRoom(roomId, roomData);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['room', variables.roomId], data);
      // Invalidate rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error updating room:", error);
    },
  });
};

// Hook để cập nhật room status
export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, status }) => {
      const response = await RoomService.updateRoomStatus(roomId, status);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['room', variables.roomId], data);
      // Invalidate rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error updating room status:", error);
    },
  });
};

// Hook để cập nhật room capacity
export const useUpdateRoomCapacity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, capacity }) => {
      const response = await RoomService.updateCapacity(roomId, capacity);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['room', variables.roomId], data);
      // Invalidate rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error updating room capacity:", error);
    },
  });
};

// Hook để soft delete room
export const useSoftDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId) => {
      const response = await RoomService.softDeleteRoom(roomId);
      return response;
    },
    onSuccess: (_, roomId) => {
      // Xóa room khỏi cache
      queryClient.removeQueries(['room', roomId]);
      // Invalidate rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error soft deleting room:", error);
    },
  });
};

// Hook để restore room
export const useRestoreRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId) => {
      const response = await RoomService.restoreRoom(roomId);
      return response;
    },
    onSuccess: () => {
      // Invalidate rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error restoring room:", error);
    },
  });
};

// Hook để destroy room
export const useDestroyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId) => {
      const response = await RoomService.destroyRoom(roomId);
      return response;
    },
    onSuccess: (_, roomId) => {
      // Xóa room khỏi cache
      queryClient.removeQueries(['room', roomId]);
      // Invalidate rooms list
      queryClient.invalidateQueries(['rooms']);
      queryClient.invalidateQueries(['roomsByCinema']);
      queryClient.invalidateQueries(['searchRooms']);
    },
    onError: (error) => {
      console.error("Error destroying room:", error);
    },
  });
};

// Hook để refresh rooms data
export const useRefreshRooms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const rooms = await RoomService.getAllRooms();
      return rooms;
    },
    onSuccess: (data) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['rooms'], data);
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['rooms']);
    },
    onError: (error) => {
      console.error("Error refreshing rooms:", error);
    },
  });
};

// ===== SEAT HOOKS =====

// Hook để lấy seats theo room ID
export const useSeatsByRoomId = ({ roomId, page = 1, perPage = 10 } = {}) => {
  return useQuery({
    queryKey: ['seatsByRoom', roomId, page, perPage],
    queryFn: async () => {
      try {
        const response = await SeatService.getSeatByRoomId(roomId, page, perPage);
        return response;
      } catch (error) {
        // Xử lý trường hợp 404 - không có ghế nào trong phòng
        if (error.message?.includes('404') || 
            error.message?.includes('Không tìm thấy ghế nào') ||
            error.response?.status === 404) {
          // Trả về response rỗng thay vì throw error
          return {
            data: [],
            total: 0,
            message: 'No seats found'
          };
        }
        // Throw lại các lỗi khác
        throw error;
      }
    },
    enabled: !!roomId, // Chỉ gọi khi có roomId
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Không retry nếu là lỗi 404 (không có ghế)
      if (error.message?.includes('404') || 
          error.message?.includes('Không tìm thấy ghế nào') ||
          error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook để lấy seat theo ID
export const useSeatById = (seatId) => {
  return useQuery({
    queryKey: ['seat', seatId],
    queryFn: async () => {
      const seat = await SeatService.getSeatById(seatId);
      return seat;
    },
    enabled: !!seatId, // Chỉ gọi khi có seatId
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook để tạo seat mới
export const useCreateSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seatData) => {
      const response = await SeatService.createSeat(seatData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error creating seat:", error);
    },
  });
};

// Hook để tạo nhiều seats cùng lúc
export const useCreateSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seatsData) => {
      const response = await SeatService.createBatchSeats(seatsData);
      return response;
    },
    onSuccess: () => {
      // Invalidate và refetch seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error creating seats:", error);
    },
  });
};

// Hook để cập nhật seat
export const useUpdateSeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ seatId, data }) => {
      const response = await SeatService.updateSeat(seatId, data);
      return response;
    },
    onSuccess: (data, variables) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['seat', variables.seatId], data);
      // Invalidate seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error updating seat:", error);
    },
  });
};

// Hook để xóa seats
export const useDeleteSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seatIds) => {
      const response = await SeatService.softDeleteBatchSeats(seatIds);
      return response;
    },
    onSuccess: () => {
      // Invalidate seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error deleting seats:", error);
    },
  });
};

// Hook để refresh seats data
export const useRefreshSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const seats = await SeatService.getAllSeats();
      return seats;
    },
    onSuccess: (data) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['seats'], data);
      // Invalidate để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['seats']);
      queryClient.invalidateQueries(['seatsByRoom']);
    },
    onError: (error) => {
      console.error("Error refreshing seats:", error);
    },
  });
};

// Hook để cập nhật nhiều seats cùng lúc
export const useUpdateMultipleSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      const updatePromises = updates.map(({ seatId, data }) => 
        SeatService.updateSeat(seatId, data)
      );
      const results = await Promise.all(updatePromises);
      return results;
    },
    onSuccess: () => {
      // Invalidate seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error updating multiple seats:", error);
    },
  });
};

// Hook để lưu cấu hình seats
export const useStoreMultipleSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seatData) => {
      const response = await SeatService.storeMultipleSeats(seatData);
      return response;
    },
    onSuccess: () => {
      // Invalidate seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error storing multiple seats:", error);
    },
  });
};

// Hook để xóa seats theo batch với điều kiện
export const useSoftDeleteBatchSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seatData) => {
      const response = await SeatService.softDeleteBatchSeats(seatData);
      return response;
    },
    onSuccess: () => {
      // Invalidate seats list
      queryClient.invalidateQueries(['seatsByRoom']);
      queryClient.invalidateQueries(['seats']);
    },
    onError: (error) => {
      console.error("Error soft deleting batch seats:", error);
    },
  });
}; 
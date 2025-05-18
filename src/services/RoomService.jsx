import api from '../api'; // Import the configured Axios instance

// Service methods for RoomController endpoints
const RoomService = {
  // Fetch all rooms that are not deleted
  getAllRooms: async () => {
    try {
      const response = await api.get('/rooms');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
  },

  // Create a new room
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create room');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create room');
    }
  },

  // Fetch a single room by ID
  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch room');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch room');
    }
  },

  // Update a room
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`/rooms/${roomId}`, roomData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update room');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room');
    }
  },

  // Update room capacity
  updateRoomCapacity: async (roomId, capacity) => {
    try {
      const response = await api.put(`/rooms/${roomId}/capacity`, { capacity });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update room capacity');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update room capacity');
    }
  },

  // Soft delete a room (set is_deleted to true)
  softDeleteRoom: async (roomId) => {
    try {
      const response = await api.delete(`/rooms/${roomId}/soft`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to soft delete room');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to soft delete room');
    }
  },

  // Restore a soft-deleted room
  restoreRoom: async (roomId) => {
    try {
      const response = await api.put(`/rooms/${roomId}/restore`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to restore room');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore room');
    }
  },

  // Permanently delete a room
  destroyRoom: async (roomId) => {
    try {
      const response = await api.delete(`/rooms/${roomId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to permanently delete room');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete room');
    }
  },
};

export default RoomService;
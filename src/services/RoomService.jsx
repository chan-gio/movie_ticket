import api from "./api"; // Import the configured Axios instance

const RoomService = {
  /**
   * Fetch all non-deleted rooms with their cinema data
   * @returns {Promise<Array>} Array of room objects including cinema.cinema_name
   */
  getAllRooms: async () => {
    try {
      const response = await api.get("/rooms");
      if (response.data.code === 200) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || "Failed to fetch rooms");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch rooms");
    }
  },

  /**
   * Create a new room
   * @param {Object} roomData - { cinema_id: string, room_name: string, capacity: number }
   * @returns {Promise<Object>} Created room object
   */
  createRoom: async (roomData) => {
    try {
      const response = await api.post("/rooms", roomData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create room");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create room");
    }
  },

  /**
   * Fetch a single room by ID
   * @param {string} roomId - Room ID
   * @returns {Promise<Object>} Room object including cinema.cinema_name
   */
  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch room");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch room");
    }
  },

  /**
   * Update a room's details
   * @param {string} roomId - Room ID
   * @param {Object} roomData - { cinema_id: string, room_name: string, capacity: number }
   * @returns {Promise<Object>} Updated room object
   */
  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`/rooms/${roomId}`, roomData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update room");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update room");
    }
  },

  /**
   * Update a room's capacity
   * @param {string} roomId - Room ID
   * @param {number} capacity - New capacity
   * @returns {Promise<Object>} Updated room object
   */
  updateCapacity: async (roomId, capacity) => {
    try {
      const response = await api.put(`/rooms/${roomId}/capacity`, { capacity });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(
        response.data.message || "Failed to update room capacity"
      );
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update room capacity"
      );
    }
  },

  /**
   * Soft delete a room (set is_deleted to true)
   * @param {string} roomId - Room ID
   * @returns {Promise<boolean>} True if successful
   */
  softDeleteRoom: async (roomId) => {
    try {
      const response = await api.delete(`/rooms/${roomId}/soft`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to soft delete room");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to soft delete room"
      );
    }
  },

  /**
   * Restore a soft-deleted room (set is_deleted to false)
   * @param {string} roomId - Room ID
   * @returns {Promise<Object>} Restored room object
   */
  restoreRoom: async (roomId) => {
    try {
      const response = await api.put(`/rooms/${roomId}/restore`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to restore room");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to restore room"
      );
    }
  },

  /**
   * Permanently delete a room
   * @param {string} roomId - Room ID
   * @returns {Promise<boolean>} True if successful
   */
  destroyRoom: async (roomId) => {
    try {
      const response = await api.delete(`/rooms/${roomId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(
        response.data.message || "Failed to permanently delete room"
      );
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to permanently delete room"
      );
    }
  },
};

export default RoomService;

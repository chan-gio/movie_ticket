import api from './api'; // Import the configured Axios instance

// Service methods for SeatController endpoints
const SeatService = {
  // Fetch all seats that are not deleted
  getAllSeats: async () => {
    try {
      const response = await api.get('/seats');
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch seats');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch seats');
    }
  },

  // Create a new seat
  createSeat: async (seatData) => {
    try {
      const response = await api.post('/seats', seatData);
      if (response.data.code === 201) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create seat');
    }
  },

  // Create multiple seats
  storeMultipleSeats: async (seatData) => {
    try {
      const response = await api.post('/seats/store-multiple', seatData);
      if (response.data.code === 201) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create multiple seats');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create multiple seats');
    }
  },

  // Fetch a single seat by ID
  getSeatById: async (seatId) => {
    try {
      const response = await api.get(`/seats/${seatId}`);
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch seat');
    }
  },

  getSeatByRoomId: async (roomId) => {
    try {
      const response = await api.get(`/seats/roomId/${roomId}`);
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch seat');
    }
  },


  // Update a seat
  updateSeat: async (seatId, seatData) => {
    try {
      const response = await api.put(`/seats/${seatId}`, seatData);
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to update seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update seat');
    }
  },

  // Soft delete a seat (set is_deleted to true)
  softDeleteSeat: async (seatId) => {
    try {
      const response = await api.delete(`/seats/${seatId}/soft`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to soft delete seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to soft delete seat');
    }
  },

  // Restore a soft-deleted seat
  restoreSeat: async (seatId) => {
    try {
      const response = await api.put(`/seats/${seatId}/restore`);
      if (response.data.code === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to restore seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to restore seat');
    }
  },

  // Permanently delete a seat
  destroySeat: async (seatId) => {
    try {
      const response = await api.delete(`/seats/${seatId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to permanently delete seat');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to permanently delete seat');
    }
  },
};

export default SeatService;
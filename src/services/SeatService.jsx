import api from "./api";

const SeatService = {
  getAllSeats: async () => {
    try {
      const response = await api.get("/seats");
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch seats");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch seats");
    }
  },

  createSeat: async (seatData) => {
    try {
      const response = await api.post("/seats", seatData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create seat");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create seat");
    }
  },

  storeMultipleSeats: async (seatData) => {
    try {
      const response = await api.post("/seats/batch", seatData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create multiple seats");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create multiple seats");
    }
  },

  createBatchSeats: async (seatData) => {
    try {
      const response = await api.post("/seats/batch", seatData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create batch seats");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create batch seats");
    }
  },

  softDeleteBatchSeats: async (seatData) => {
    try {
      const response = await api.post("/seats/softDeleteMultipe", seatData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to soft delete batch seats");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to soft delete batch seats");
    }
  },

  getSeatById: async (seatId) => {
    try {
      const response = await api.get(`/seats/${seatId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch seat");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch seat");
    }
  },

  getSeatByRoomId: async (roomId) => {
    try {
      const response = await api.get(`/seats/roomId/${roomId}`);
      if (response.data.code === 200) {
        return response.data;
      }
      throw new Error(response.data.message || "Failed to fetch seats");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch seats");
    }
  },

  updateSeat: async (seatId, seatData) => {
    try {
      const response = await api.put(`/seats/${seatId}`, seatData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update seat");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update seat");
    }
  },

  softDeleteSeat: async (seatId) => {
    try {
      const response = await api.delete(`/seats/soft/${seatId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to soft delete seat");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to soft delete seat");
    }
  },

  restoreSeat: async (seatId) => {
    try {
      const response = await api.patch(`/seats/restore/${seatId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to restore seat");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to restore seat");
    }
  },

  destroySeat: async (seatId) => {
    try {
      const response = await api.delete(`/seats/${seatId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to permanently delete seat");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to permanently delete seat");
    }
  },
};

export default SeatService;
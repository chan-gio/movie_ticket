import api from "./api";

const RoomService = {
  getAllRooms: async () => {
    try {
      const response = await api.get("/rooms");
      if (response.data.code === 200) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || "Failed to fetch rooms");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch rooms");
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await api.post("/rooms", roomData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create room");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create room");
    }
  },

  getRoomById: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch room");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch room");
    }
  },

  updateRoom: async (roomId, roomData) => {
    try {
      const response = await api.put(`/rooms/${roomId}`, roomData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update room");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update room");
    }
  },

  updateRoomStatus: async (roomId, status) => {
    try {
      const response = await api.put(`/rooms/${roomId}`, { status });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update room status");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update room status");
    }
  },

  updateCapacity: async (roomId, capacity) => {
    try {
      const response = await api.put(`/rooms/update-capacity/${roomId}`, { capacity });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update room capacity");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update room capacity");
    }
  },

  softDeleteRoom: async (roomId) => {
    try {
      const response = await api.put(`/rooms/soft-delete/${roomId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to soft delete room");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to soft delete room");
    }
  },

  restoreRoom: async (roomId) => {
    try {
      const response = await api.patch(`/rooms/restore/${roomId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to restore room");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to restore room");
    }
  },

  destroyRoom: async (roomId) => {
    try {
      const response = await api.delete(`/rooms/${roomId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to permanently delete room");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to permanently delete room");
    }
  },

  getRoomsByCinemaId: async (cinemaId, page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/rooms/cinema/${cinemaId}?page=${page}&per_page=${perPage}`);
      if (response.data.code === 200) {
        return Array.isArray(response.data.data?.data) ? response.data.data.data : [];
      }
      throw new Error(response.data.message || "Failed to fetch rooms for cinema");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch rooms for cinema");
    }
  },

  searchRoomsByName: async (keyword) => {
    try {
      const response = await api.get("/rooms/search", { params: { keyword } });
      if (response.data.code === 200) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || "Failed to search rooms");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search rooms");
    }
  },
};

export default RoomService;
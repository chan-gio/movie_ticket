import api from "./api";

const ShowTimeService = {
  getAllShowTimes: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/showtimes", {
        params: { page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch showtimes");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch showtimes");
    }
  },

  createShowTime: async (showtimeData) => {
    try {
      const response = await api.post("/showtimes", showtimeData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create showtime");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create showtime");
    }
  },

  getShowTimeById: async (showtimeId) => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch showtime");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch showtime");
    }
  },

  getShowTimesByMovieId: async (movieId, page = 1, perPage = 10) => {
    try {
      const response = await api.get(`/showtimes/movieId/${movieId}`, {
        params: { page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch showtimes");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch showtimes");
    }
  },

  updateShowTime: async (showtimeId, showtimeData) => {
    try {
      const response = await api.put(`/showtimes/${showtimeId}`, showtimeData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update showtime");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update showtime");
    }
  },

  deleteShowTime: async (showtimeId) => {
    try {
      const response = await api.delete(`/showtimes/soft/${showtimeId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to delete showtime");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to delete showtime");
    }
  },

  restoreShowTime: async (showtimeId) => {
    try {
      const response = await api.patch(`/showtimes/restore/${showtimeId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to restore showtime");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to restore showtime");
    }
  },

  searchShowtimes: async (keyword, page = 1, perPage = 10) => {
    try {
      const response = await api.get("/showtimes/search", {
        params: { keyword, page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search showtimes");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to search showtimes");
    }
  },
};

export default ShowTimeService;
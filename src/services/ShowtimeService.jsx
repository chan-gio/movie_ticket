import api from "./api"; // Import the configured Axios instance

// Service methods for ShowTimeController endpoints
const ShowtimeService = {
  // Fetch all showtimes that are not deleted
  getAllShowtimes: async () => {
    try {
      const response = await api.get("/showtimes");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch showtimes");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtimes"
      );
    }
  },

  // Create a new showtime
  createShowtime: async (showtimeData) => {
    try {
      const response = await api.post("/showtimes", showtimeData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create showtime");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create showtime"
      );
    }
  },

  // Fetch a single showtime by ID
  getShowtimeById: async (showtimeId) => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch showtime");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtime"
      );
    }
  },

  getShowtimeByMovieId: async (movieId) => {
    try {
      const response = await api.get(`/showtimes/movieId/${movieId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch showtime");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtime"
      );
    }
  },

  // Update a showtime
  updateShowtime: async (showtimeId, showtimeData) => {
    try {
      const response = await api.put(`/showtimes/${showtimeId}`, showtimeData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update showtime");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update showtime"
      );
    }
  },

  // Soft delete a showtime (set is_deleted to true)
  softDeleteShowtime: async (showtimeId) => {
    try {
      const response = await api.delete(`/showtimes/${showtimeId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to soft delete showtime"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to soft delete showtime"
      );
    }
  },
};

export default ShowtimeService;

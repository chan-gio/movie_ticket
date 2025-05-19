import api from "./api"; // Import the configured Axios instance

const ShowTimeService = {
  /**
   * Fetch all non-deleted showtimes with movie, room, and cinema data
   * @returns {Promise<Array>} Array of showtime objects
   */
  getAllShowTimes: async () => {
    try {
      const response = await api.get("/showtimes");
      if (response.data.code === 200) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || "Failed to fetch showtimes");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtimes"
      );
    }
  },

  /**
   * Create a new showtime
   * @param {Object} showtimeData - { movie_id: string, room_id: string, start_time: string, price: number }
   * @returns {Promise<Object>} Created showtime object
   */
  createShowTime: async (showtimeData) => {
    try {
      const response = await api.post("/showtimes", showtimeData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create showtime");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create showtime"
      );
    }
  },

  /**
   * Fetch a single showtime by ID
   * @param {string} showtimeId - Showtime ID
   * @returns {Promise<Object>} Showtime object
   */
  getShowTimeById: async (showtimeId) => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch showtime");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtime"
      );
    }
  },

  /**
   * Fetch showtimes by movie ID
   * @param {string} movieId - Movie ID
   * @returns {Promise<Array>} Array of showtime objects
   */
  getShowTimesByMovieId: async (movieId) => {
    try {
      const response = await api.get(`/showtimes/movie/${movieId}`);
      if (response.data.code === 200) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || "Failed to fetch showtimes");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtimes"
      );
    }
  },

  /**
   * Update a showtime
   * @param {string} showtimeId - Showtime ID
   * @param {Object} showtimeData - { movie_id?: string, room_id?: string, start_time?: string, price?: number }
   * @returns {Promise<Object>} Updated showtime object
   */
  updateShowTime: async (showtimeId, showtimeData) => {
    try {
      const response = await api.put(`/showtimes/${showtimeId}`, showtimeData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update showtime");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update showtime"
      );
    }
  },

  /**
   * Soft delete a showtime (set is_deleted to true)
   * @param {string} showtimeId - Showtime ID
   * @returns {Promise<boolean>} True if successful
   */
  deleteShowTime: async (showtimeId) => {
    try {
      const response = await api.delete(`/showtimes/${showtimeId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to delete showtime");
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete showtime"
      );
    }
  },
};

export default ShowTimeService;

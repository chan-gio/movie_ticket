import api from "./api"; // Import the configured Axios instance

// Service methods for MovieController endpoints
const MovieService = {
  // Fetch all movies that are not deleted
  getAllMovies: async () => {
    try {
      const response = await api.get("/movies/");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch movies");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch movies"
      );
    }
  },

  // Create a new movie
  createMovie: async (movieData) => {
    try {
      const response = await api.post("/movies", movieData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create movie");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create movie"
      );
    }
  },

  // Fetch a single movie by ID
  getMovieById: async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch movie");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch movie");
    }
  },

  // Update a movie
  updateMovie: async (movieId, movieData) => {
    try {
      const response = await api.put(`/movies/${movieId}`, movieData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update movie");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update movie"
      );
    }
  },

  // Soft delete a movie (set is_deleted to true)
  softDeleteMovie: async (movieId) => {
    try {
      const response = await api.delete(`/movies/movies//${movieId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to soft delete movie");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to soft delete movie"
      );
    }
  },

  // Restore a soft-deleted movie
  restoreMovie: async (movieId) => {
    try {
      const response = await api.put(`/movies/${movieId}/restore`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to restore movie");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to restore movie"
      );
    }
  },

  // Fetch all soft-deleted movies
  getDeletedMovies: async () => {
    try {
      const response = await api.get("/movies/deleted");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch deleted movies"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch deleted movies"
      );
    }
  },

  // Search movies by title
  searchMoviesByTitle: async (title) => {
    try {
      const response = await api.get("/movies/search", { params: { title } });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to search movies");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search movies"
      );
    }
  },

  // Fetch currently showing movies
  getNowShowing: async () => {
    try {
      const response = await api.get("/movies/movies/now-showing");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch now showing movies"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch now showing movies"
      );
    }
  },
  getUpcomingMovie: async () => {
    try {
      const response = await api.get("/movies/movies/upcoming-movie");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch now showing movies"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch now showing movies"
      );
    }
  },
};

export default MovieService;

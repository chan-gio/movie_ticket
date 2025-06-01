import api from "./api";
import { uploadMoviePosterToCloudinary } from "../utils/cloudinaryConfig";

const MovieService = {
  // Fetch all movies that are not deleted with pagination
  getAllMovies: async ({ perPage, page } = {}) => {
    try {
      const params = {};
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/", { params });

      if (response.data.code === 200) {
        return response.data.data; // response.data.data sẽ là object của Laravel paginator
      } else {
        throw new Error(response.data.message || "Failed to fetch movies");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch movies"
      );
    }
  },

  // Create a new movie with poster upload
  createMovie: async (movieData, posterFile) => {
    try {
      let posterUrl = movieData.poster_url || null;

      // Upload poster image to Cloudinary if provided
      if (posterFile) {
        posterUrl = await uploadMoviePosterToCloudinary(
          posterFile,
          (progress) => {
            console.log(`Upload progress: ${progress}%`);
          }
        );
        if (!posterUrl) {
          throw new Error("Failed to upload poster image");
        }
      }

      // Prepare movie data with the uploaded poster URL
      const moviePayload = {
        ...movieData,
        poster_url: posterUrl,
      };

      const response = await api.post("/movies", moviePayload);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create movie");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create movie"
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

  // Update a movie with optional poster upload
  updateMovie: async (movieId, movieData, posterFile) => {
    try {
      let posterUrl = movieData.poster_url || null;

      // Upload new poster image to Cloudinary if provided
      if (posterFile) {
        posterUrl = await uploadMoviePosterToCloudinary(
          posterFile,
          (progress) => {
            console.log(`Upload progress: ${progress}%`);
          }
        );
        if (!posterUrl) {
          throw new Error("Failed to upload poster image");
        }
      }

      // Prepare movie data with the uploaded poster URL
      const moviePayload = {
        ...movieData,
        poster_url: posterUrl,
      };

      const response = await api.put(`/movies/${movieId}`, moviePayload);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update movie");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update movie"
      );
    }
  },

  // Soft delete a movie (set is_deleted to true)
  softDeleteMovie: async (movieId) => {
    try {
      const response = await api.delete(`/movies/soft/${movieId}`);
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
      const response = await api.patch(`/movies/restore/${movieId}`);
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

  // Search deleted movies by title with pagination
  searchDeletedMovies: async ({ title, perPage, page } = {}) => {
    try {
      const params = { title };
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/deleted/search", { params });

      if (response.data.code === 200) {
        return response.data.data; // response.data.data sẽ là object của Laravel paginator
      } else {
        throw new Error(response.data.message || "Failed to search deleted movies");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search deleted movies"
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

  // Fetch upcoming movies
  getUpcomingMovie: async () => {
    try {
      const response = await api.get("/movies/movies/upcoming-movie");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch upcoming movies"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch upcoming movies"
      );
    }
  },

  // Fetch all movies for frontend with pagination
  getAllMoviesFE: async ({ perPage, page } = {}) => {
    try {
      const params = {};
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/movies/get-all-movies", {
        params,
      });

      if (response.data.code === 200) {
        return response.data.data; // response.data.data sẽ là object của Laravel paginator
      } else {
        throw new Error(response.data.message || "Failed to fetch movies");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch movies"
      );
    }
  },

  // Search movies by title for frontend with pagination
  searchByTitleFE: async ({ title, perPage, page } = {}) => {
    try {
      const params = { title };
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/movies/search-movies", {
        params,
      });

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
};

export default MovieService;
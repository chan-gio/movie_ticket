import api from "./api";
import { uploadMoviePosterToCloudinary } from "../utils/cloudinaryConfig";

const MovieService = {
  getAllMovies: async ({ perPage, page } = {}) => {
    try {
      const params = {};
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/", { params });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch movies");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch movies");
    }
  },

  createMovie: async (movieData, posterFile) => {
    try {
      let posterUrl = movieData.poster_url || null;
      if (posterFile) {
        posterUrl = await uploadMoviePosterToCloudinary(posterFile, (progress) => {
          console.log(`Upload progress: ${progress}%`);
        });
        if (!posterUrl) {
          throw new Error("Failed to upload poster image");
        }
      }

      const moviePayload = { ...movieData, poster_url: posterUrl };
      const response = await api.post("/movies", moviePayload);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create movie");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create movie");
    }
  },

  getMovieById: async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch movie");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch movie");
    }
  },

  updateMovie: async (movieId, movieData, posterFile) => {
    try {
      let posterUrl = movieData.poster_url || null;
      if (posterFile) {
        posterUrl = await uploadMoviePosterToCloudinary(posterFile, (progress) => {
          console.log(`Upload progress: ${progress}%`);
        });
        if (!posterUrl) {
          throw new Error("Failed to upload poster image");
        }
      }

      const moviePayload = { ...movieData, poster_url: posterUrl };
      const response = await api.put(`/movies/${movieId}`, moviePayload);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update movie");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update movie");
    }
  },

  softDeleteMovie: async (movieId) => {
    try {
      const response = await api.delete(`/movies/soft/${movieId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to soft delete movie");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to soft delete movie");
    }
  },

  restoreMovie: async (movieId) => {
    try {
      const response = await api.patch(`/movies/restore/${movieId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to restore movie");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to restore movie");
    }
  },

  getDeletedMovies: async () => {
    try {
      const response = await api.get("/movies/deleted");
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch deleted movies");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch deleted movies");
    }
  },

  searchMoviesByTitle: async (title) => {
    try {
      const response = await api.get("/movies/search", { params: { title } });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search movies");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search movies");
    }
  },

  searchDeletedMovies: async ({ title, perPage, page } = {}) => {
    try {
      const params = { title };
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/deleted/search", { params });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search deleted movies");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search deleted movies");
    }
  },

getNowShowing: async () => {
    try {
      const response = await api.get("/movies/now-showing");
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch now showing movies");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch now showing movies");
    }
  },

  getUpcomingMovie: async () => {
    try {
      const response = await api.get("/movies/upcoming-movie");
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch upcoming movies");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch upcoming movies");
    }
  },

  getAllMoviesFE: async ({ perPage, page } = {}) => {
    try {
      const params = {};
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/get-all-movies", { params });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch movies");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch movies");
    }
  },

  searchByTitleFE: async ({ title, perPage, page } = {}) => {
    try {
      const params = { title };
      if (perPage) params.per_page = perPage;
      if (page) params.page = page;

      const response = await api.get("/movies/search-movies", { params });
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search movies");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to search movies");
    }
  },
};

export default MovieService;
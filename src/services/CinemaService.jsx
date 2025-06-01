import api from "./api";

// Service methods for CinemaController endpoints
const CinemaService = {
  // Fetch all cinemas that are not deleted
  getAllCinemas: async (params = {}) => {
    try {
      const response = await api.get("/cinemas/", { params });
      if (response.data.code === 200) {
        return response.data.data; // Return paginator object
      } else {
        throw new Error(response.data.message || "Failed to fetch cinemas");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch cinemas"
      );
    }
  },

  // Search cinemas by address
  searchCinemaByAddress: async (searchTerm, page = 1, params = {}) => {
    try {
      const response = await api.get("/cinemas/search-by-address", {
        params: {
          address: searchTerm,
          per_page: params.per_page || 10,
          page,
        },
      });
      if (response.data.success) {
        return response.data.data; // Return paginator object
      } else {
        return { data: [], total: 0, current_page: 1 }; // Empty response for no results
      }
    } catch (error) {
      console.error("Search by address error:", error.message);
      return { data: [], total: 0, current_page: 1 };
    }
  },

  // Search cinemas by name
  searchCinemaByName: async (searchTerm, page = 1, params = {}) => {
    try {
      const response = await api.get("/cinemas/search-by-name", {
        params: {
          name: searchTerm,
          per_page: params.per_page || 10,
          page,
        },
      });
      if (response.data.success) {
        return response.data.data; // Return paginator object
      } else {
        return { data: [], total: 0, current_page: 1 }; // Empty response for no results
      }
    } catch (error) {
      console.error("Search by name error:", error.message);
      return { data: [], total: 0, current_page: 1 };
    }
  },

  // Fetch showtimes by cinema and date
  getShowtimesByCinemaAndDate: async (cinemaId, date, params = {}) => {
    try {
      const response = await api.get(`/showtimes/cinema/${cinemaId}/date/${date}`, { params });
      if (response.data.code === 200) {
        return response.data.data.data; // Return array of showtimes
      } else {
        throw new Error(response.data.message || "Failed to fetch showtimes");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtimes"
      );
    }
  },

  // Fetch deleted cinemas with pagination
  getDeletedCinemas: async (params = {}) => {
    try {
      const response = await api.get("/cinemas/deleted", { params });
      if (response.data.code === 200) {
        return response.data.data; // Return paginator object
      } else {
        throw new Error(response.data.message || "Failed to fetch deleted cinemas");
      }
    } catch (error) {
      console.error("Get deleted cinemas error:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch deleted cinemas"
      );
    }
  },

  // Search deleted cinemas by name
  searchDeletedCinemaByName: async (searchTerm, page = 1, params = {}) => {
    try {
      const response = await api.get("/cinemas/deleted/search-by-name", {
        params: {
          name: searchTerm,
          per_page: params.per_page || 10,
          page,
        },
      });
      if (response.data.success) {
        return response.data.data; // Return paginator object
      } else {
        return { data: [], total: 0, current_page: 1 }; // Empty response for no results
      }
    } catch (error) {
      console.error("Search deleted by name error:", error.message);
      return { data: [], total: 0, current_page: 1 };
    }
  },

  // Search deleted cinemas by address
  searchDeletedCinemaByAddress: async (searchTerm, page = 1, params = {}) => {
    try {
      const response = await api.get("/cinemas/deleted/search-by-address", {
        params: {
          address: searchTerm,
          per_page: params.per_page || 10,
          page,
        },
      });
      if (response.data.success) {
        return response.data.data; // Return paginator object
      } else {
        return { data: [], total: 0, current_page: 1 }; // Empty response for no results
      }
    } catch (error) {
      console.error("Search deleted by address error:", error.message);
      return { data: [], total: 0, current_page: 1 };
    }
  },

  // Other methods
  createCinema: async (cinemaData) => {
    try {
      const response = await api.post("/cinemas", cinemaData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create cinema");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create cinema"
      );
    }
  },

  getCinemaById: async (cinemaId) => {
    try {
      const response = await api.get(`/cinemas/${cinemaId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch cinema");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch cinema"
      );
    }
  },

  updateCinema: async (cinemaId, cinemaData) => {
    try {
      const response = await api.put(`/cinemas/${cinemaId}`, cinemaData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update cinema");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update cinema"
      );
    }
  },

  softDeleteCinema: async (cinemaId) => {
    try {
      const response = await api.delete(`/cinemas/${cinemaId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to soft delete cinema");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to soft delete cinema"
      );
    }
  },

  restoreCinema: async (cinemaId) => {
    try {
      const response = await api.put(`/cinemas/restore/${cinemaId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to restore cinema");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to restore cinema"
      );
    }
  },
};

export default CinemaService;
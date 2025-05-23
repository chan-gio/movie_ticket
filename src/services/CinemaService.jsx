import api from "./api";

// Service methods for CinemaController endpoints
const CinemaService = {
  // Fetch all cinemas that are not deleted
  getAllCinemas: async (params = {}) => {
    try {
      const response = await api.get("/cinemas/", { params });
      if (response.data.code === 200) {
        return response.data.data.data; // Trả về mảng rạp
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
  searchCinemaByAddress: async (searchTerm, page = 1) => {
    try {
      const response = await api.get("/cinemas/search-by-address", {
        params: {
          address: searchTerm,
          per_pages: 20,
          pages: page,
        },
      });
      if (response.data.success) {
        return response.data.data.data; // Trả về mảng rạp
      } else {
        throw new Error(
          response.data.message || "Failed to search cinemas by address"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search cinemas by address"
      );
    }
  },

  // Search cinemas by name
  searchCinemaByName: async (searchTerm, page = 1) => {
    try {
      const response = await api.get("/cinemas/search-by-name", {
        params: {
          name: searchTerm,
          per_pages: 20,
          pages: page,
        },
      });
      if (response.data.success) {
        return response.data.data.data; // Trả về mảng rạp
      } else {
        throw new Error(
          response.data.message || "Failed to search cinemas by name"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to search cinemas by name"
      );
    }
  },

  // Fetch showtimes by cinema and date
  getShowtimesByCinemaAndDate: async (cinemaId, date, params = {}) => {
    try {
      const response = await api.get(`/showtimes/cinema/${cinemaId}/date/${date}`, { params });
      if (response.data.code === 200) {
        return response.data.data.data; // Trả về mảng suất chiếu
      } else {
        throw new Error(response.data.message || "Failed to fetch showtimes");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch showtimes"
      );
    }
  },

  // Các phương thức khác
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

  getDeletedCinemas: async () => {
    try {
      const response = await api.get("/cinemas/deleted");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch deleted cinemas"
        );
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch deleted cinemas"
      );
    }
  },
};

export default CinemaService;
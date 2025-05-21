import api from "./api";

// Service methods for CinemaController endpoints
const CinemaService = {
  // Fetch all cinemas that are not deleted
  getAllCinemas: async (params = {}) => {
    try {
      const response = await api.get("/cinemas/", { params });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch cinemas");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch cinemas"
      );
    }
  },

  // Create a new cinema
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

  // Fetch a single cinema by ID
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

  // Update a cinema
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

  // Soft delete a cinema (set is_deleted to true)
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

  // Restore a soft-deleted cinema
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

  // Fetch all soft-deleted cinemas
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
import api from "./api"; // Import the configured Axios instance

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.success === true) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to register user");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to register user");
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.success === true) {
        return {
          token: response.data.token,
          user: response.data.user,
        };
      } else {
        throw new Error(response.data.message || "Failed to login");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to login");
    }
  },
};

export default AuthService;
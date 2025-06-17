import api from "./api"; // Import the configured Axios instance

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      // Check if the HTTP status is in the success range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Backend uses code 201 for successful registration
        if (response.data.code === 201) {
          return response.data.data; // Returns { user, access_token, refresh_token }
        } else {
          throw new Error(response.data.message || "Failed to register user");
        }
      } else {
        throw new Error(response.data?.message || "Failed to register user");
      }
    } catch (error) {
      console.error("Register Error:", error); // Debug log
      // Prioritize backend error message if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to register user";
      throw new Error(errorMessage);
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Check if the HTTP status is in the success range (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Backend uses code 200 for successful login
        if (response.data.code === 200) {
          return response.data.data; // Returns { access_token, refresh_token, user }
        } else {
          throw new Error(response.data.message || "Failed to login");
        }
      } else {
        throw new Error(response.data?.message || "Failed to login");
      }
    } catch (error) {
      console.error("Login Error:", error); // Debug log
      // Prioritize backend error message if available
      const errorMessage = error.response?.data?.message || error.message || "Failed to login";
      throw new Error(errorMessage);
    }
  },
};

export default AuthService;
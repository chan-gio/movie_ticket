import api from "./api"; // Import the configured Axios instance

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      console.log("Register Response:", response); // Debug log
      if (response.status >= 200 && response.status < 300) {
        if (response.data.success === true) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || "Failed to register user");
        }
      } else if (response.status === 302) {
        throw new Error("Unexpected redirect during registration");
      } else {
        throw new Error(response.data?.message || "Failed to register user");
      }
    } catch (error) {
      console.error("Register Error:", error); // Debug log
      throw new Error(error.response?.data?.message || error.message || "Failed to register user");
    }
  },

  // Login a user
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      console.log("Login Response:", response); // Debug log
      if (response.status >= 200 && response.status < 300) {
        if (response.data.success === true) {
          return {
            token: response.data.token,
            user: response.data.user,
          };
        } else {
          throw new Error(response.data.message || "Failed to login");
        }
      } else if (response.status === 302) {
        throw new Error("Unexpected redirect during login");
      } else {
        throw new Error(response.data?.message || "Failed to login");
      }
    } catch (error) {
      console.error("Login Error:", error); // Debug log
      throw new Error(error.response?.data?.message || error.message || "Failed to login");
    }
  },
};

export default AuthService;
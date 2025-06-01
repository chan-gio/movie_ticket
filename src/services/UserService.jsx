import api from "./api"; // Import the configured Axios instance

const UserService = {
  // Fetch all users with pagination
  getAllUsers: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/users", {
        params: { page, per_page: perPage },
      });
      if (response.data) {
        return {
          data: response.data.data.data, // Extract the user array from paginated response
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch users. Please try again later."
          : error.response?.data?.message || "Failed to fetch users";
      throw new Error(message);
    }
  },

  // Fetch a single user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch user");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to fetch user. Please try again later."
          : error.response?.data?.message || "Failed to fetch user";
      throw new Error(message);
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      if (response.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to create user. Please try again later."
          : error.response?.data?.message || "Failed to create user";
      throw new Error(message);
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      if (response.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to update user. Please try again later."
          : error.response?.data?.message || "Failed to update user";
      throw new Error(message);
    }
  },

  // Soft delete a user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to delete user. Please try again later."
          : error.response?.data?.message || "Failed to delete user";
      throw new Error(message);
    }
  },

  // Search users by keyword (username or phone) with pagination
  searchUser: async (keyword, page = 1, perPage = 10) => {
    try {
      const response = await api.get("/users/search", {
        params: { keyword, page, per_page: perPage },
      });
      if (response.data) {
        return {
          data: response.data.data.data, // Extract the user array from paginated response
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to search users");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to search users. Please try again later."
          : error.response?.data?.message || "Failed to search users";
      throw new Error(message);
    }
  },

  // Change user password
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.post(`/users/${userId}/change-password`, passwordData);
      if (response.data) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to change password. Please try again later."
          : error.response?.data?.message || "Failed to change password";
      throw new Error(message);
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      if (response.data) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to process forgot password request");
      }
    } catch (error) {
      const message =
        error.response?.status === 500
          ? "Server error: Unable to process forgot password request. Please try again later."
          : error.response?.data?.message || "Failed to process forgot password request";
      throw new Error(message);
    }
  },
};

export default UserService;
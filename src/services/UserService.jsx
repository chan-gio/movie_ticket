import api from "./api"; // Import the configured Axios instance

const UserService = {
  // Fetch all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/users");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  // Fetch a single user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch user");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      if (response.data.code === 201) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  },

  // Soft delete a user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data.code === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },
};

export default UserService;

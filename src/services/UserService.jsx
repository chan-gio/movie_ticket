import api from "./api";

const UserService = {
  getAllUsers: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get("/users", {
        params: { page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data,
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      }
      throw new Error(response.data.message || "Failed to fetch users");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch user");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      if (response.data.code === 201) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create user");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update user");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/soft/${userId}`);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to delete user");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },

  searchUser: async (keyword, page = 1, perPage = 10) => {
    try {
      const response = await api.get("/users/search", {
        params: { keyword, page, per_page: perPage },
      });
      if (response.data.code === 200) {
        return {
          data: response.data.data.data,
          pagination: {
            current: response.data.data.current_page,
            pageSize: response.data.data.per_page,
            total: response.data.data.total,
          },
        };
      }
      throw new Error(response.data.message || "Failed to search users");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to search users");
    }
  },

  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.post(`/users/${userId}/change-password`, passwordData);
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to change password");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to change password");
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      if (response.data.code === 200) {
        return true;
      }
      throw new Error(response.data.message || "Failed to process forgot password request");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to process forgot password request");
    }
  },
};

export default UserService;
import api from "./api"; // Import the configured Axios instance

const DashboardService = {
  async fetchDashboardData(filter = "month") {
    try {
      const response = await api.get(`/dashboard`, {
        params: { filter },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw error.response?.data || { message: "Unknown error occurred" };
    }
  },
};

export default DashboardService;

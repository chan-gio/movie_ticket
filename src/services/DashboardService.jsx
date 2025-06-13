import api from "./api";

const DashboardService = {
  async fetchDashboardData({ filter = "month", month = null } = {}) {
    try {
      const validFilter = ["day", "week", "month"].includes(filter) ? filter : "month";
      const validMonth = month && /^\d{4}-\d{2}$/.test(month) ? month : null;

      const params = { filter: validFilter };
      if (validFilter === "month" && validMonth) {
        params.month = validMonth;
      }

      const response = await api.get("/dashboard", { params });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw error.response?.data || { message: "Unknown error occurred" };
    }
  },
};

export default DashboardService;
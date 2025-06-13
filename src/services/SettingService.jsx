import api from "./api";

const SettingService = {
  getSetting: async () => {
    try {
      const response = await api.get("/setting");
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch setting");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch setting");
    }
  },

  updateSetting: async (settingData) => {
    try {
      const response = await api.put("/setting", settingData);
      if (response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update setting");
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Unauthorized: Please login again");
      }
      throw new Error(error.response?.data?.message || "Failed to update setting");
    }
  },
};

export default SettingService;
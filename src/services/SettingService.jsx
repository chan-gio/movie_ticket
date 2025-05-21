import api from "./api"; // Import the configured Axios instance

const SettingService = {
  // Fetch the current setting
  getSetting: async () => {
    try {
      const response = await api.get("/setting");
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch setting");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch setting"
      );
    }
  },

  // Update the setting
  updateSetting: async (settingData) => {
    try {
      const response = await api.put("/setting", settingData);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to update setting");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update setting"
      );
    }
  },
};

export default SettingService;

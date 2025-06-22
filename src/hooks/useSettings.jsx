import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SettingService from '../services/SettingService';
import { toastError, toastSuccess, toastInfo } from '../utils/toastNotifier';

// Default settings to use as a fallback
const defaultSettings = {
  name: "https://via.placeholder.com/150x50?text=MovieLogo", // Default logo
  vip: 20, // Default VIP price increase (20%)
  couple: 30, // Default Couple price increase (30%)
  banner: [], // Default banner array
};

// Hook để lấy settings
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const settingsData = await SettingService.getSetting();
        // Cache the settings in localStorage for offline fallback
        localStorage.setItem("settings", JSON.stringify(settingsData));
        return settingsData;
      } catch (error) {
        console.error("Error fetching settings:", error);
        toastError("Failed to load settings. Using cached data.");
        // Fallback to cached settings or default settings
        const cachedSettings = localStorage.getItem("settings");
        if (cachedSettings) {
          try {
            return JSON.parse(cachedSettings);
          } catch (parseError) {
            console.error("Error parsing cached settings:", parseError);
          }
        }
        return defaultSettings;
      }
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu được coi là fresh trong 5 phút
    cacheTime: 10 * 60 * 1000, // Cache được giữ trong 10 phút
    retry: 2, // Thử lại 2 lần nếu lỗi
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Không refetch khi focus lại window
    refetchOnReconnect: true, // Refetch khi kết nối lại internet
  });
};

// Hook để cập nhật settings
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settingData) => {
      const response = await SettingService.updateSetting(settingData);
      return response;
    },
    onSuccess: (data) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(['settings'], data);
      // Cập nhật localStorage
      localStorage.setItem("settings", JSON.stringify(data));
      // Invalidate và refetch để đảm bảo dữ liệu đồng bộ
      queryClient.invalidateQueries(['settings']);
      toastSuccess("Settings saved successfully!");
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toastError(error.response?.data?.message || error.message || "Failed to save settings");
    },
  });
};

// Hook để refresh settings
export const useRefreshSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await SettingService.getSetting();
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      localStorage.setItem("settings", JSON.stringify(data));
      toastSuccess("Settings refreshed successfully!");
    },
    onError: (error) => {
      console.error("Error refreshing settings:", error);
      toastError("Failed to refresh settings");
    },
  });
};

// Hook để reset settings to default
export const useResetSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await SettingService.updateSetting(defaultSettings);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      localStorage.setItem("settings", JSON.stringify(data));
      toastSuccess("Settings reset to default values!");
    },
    onError: (error) => {
      console.error("Error resetting settings:", error);
      toastError("Failed to reset settings");
    },
  });
};

// Hook để lấy settings với fallback
export const useSettingsWithFallback = () => {
  const { data: settings, isLoading, error, refetch } = useSettings();

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
    refetch,
    // Helper function để kiểm tra xem có đang sử dụng fallback không
    isUsingFallback: !settings && !isLoading,
  };
};

// Hook để lấy một setting cụ thể
export const useSetting = (key) => {
  const { settings, isLoading, error } = useSettingsWithFallback();
  
  return {
    value: settings?.[key] ?? defaultSettings[key],
    isLoading,
    error,
    // Helper function để kiểm tra xem setting có tồn tại không
    exists: key in (settings || defaultSettings),
  };
};

// Hook để lấy logo
export const useLogo = () => {
  return useSetting('name');
};

// Hook để lấy VIP price
export const useVipPrice = () => {
  return useSetting('vip');
};

// Hook để lấy Couple price
export const useCouplePrice = () => {
  return useSetting('couple');
};

// Hook để lấy banner
export const useBanner = () => {
  return useSetting('banner');
};

// Hook để validate image URL
export const useValidateImageUrl = () => {
  return (url) => {
    if (!url) return false;
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
    return urlPattern.test(url);
  };
};

// Hook để parse banner data
export const useParseBannerData = () => {
  return (bannerData) => {
    if (!bannerData) return [];
    
    try {
      // Try parsing as JSON if it's a string
      let banners = typeof bannerData === "string" 
        ? JSON.parse(bannerData) 
        : bannerData;
      
      // Ensure banners is an array of strings
      banners = Array.isArray(banners)
        ? banners.filter(url => typeof url === "string" && url.trim() !== "")
        : [];
      
      return banners;
    } catch (err) {
      console.error("Error parsing banner data:", err);
      // If parsing fails, treat as a comma-separated string
      return typeof bannerData === "string"
        ? bannerData.split(",").filter(url => url.trim() !== "")
        : [];
    }
  };
}; 
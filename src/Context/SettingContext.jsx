import { createContext, useContext, useState, useEffect } from "react";
import SettingService from "../services/SettingService";

// Create the Settings Context
const SettingsContext = createContext();

// Default settings to use as a fallback
const defaultSettings = {
  name: "https://via.placeholder.com/150x50?text=MovieLogo", // Default logo
  vip: 20, // Default VIP price increase (20%)
  couple: 30, // Default Couple price increase (30%)
  banner: [], // Default banner array
};

// Create a Provider component to fetch and provide settings data
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null); // Initial state is null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        // // Check for cached settings in localStorage
        // const cachedSettings = localStorage.getItem("settings");
        // if (cachedSettings) {
        //   setSettings(JSON.parse(cachedSettings));
        //   setLoading(false);
        //   return;
        // }

        // Fetch settings from API
        const settingsData = await SettingService.getSetting();
        setSettings(settingsData);
        setError(null);
        // Cache the settings in localStorage
        localStorage.setItem("settings", JSON.stringify(settingsData));
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message || "Failed to fetch settings");
        // Fallback to default settings on error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Provide the context value with a fallback for settings
  const value = {
    settings: settings || defaultSettings, // Use defaultSettings if settings is null
    loading,
    error,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the Settings Context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
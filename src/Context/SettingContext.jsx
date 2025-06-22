import { createContext, useContext } from "react";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";

// Create the Settings Context
const SettingsContext = createContext();

// Create a Provider component to fetch and provide settings data
export const SettingsProvider = ({ children }) => {
  // Sử dụng custom hook với react-query
  const { data: settings, isLoading, error, refetch } = useSettings();
  const { mutate: updateSettings, isLoading: isUpdating } = useUpdateSettings();

  // Provide the context value
  const value = {
    settings,
    loading: isLoading,
    error,
    refetch,
    updateSettings,
    isUpdating,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the Settings Context
export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
};
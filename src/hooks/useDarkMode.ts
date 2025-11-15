import { useUIStore } from '../app/store/uiStore';

/**
 * Hook to access dark mode state and toggle function
 * This hook provides a consistent way to access dark mode across the application
 */
export const useDarkMode = () => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useUIStore();
  
  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
  };
};


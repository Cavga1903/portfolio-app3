import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AppTheme, lightTheme, darkTheme, ThemeMode } from './theme';

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark'; // The actual resolved mode (system -> light/dark)
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'app_theme_mode';

// Helper function to get system preference
const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default fallback
};

// Helper function to resolve theme mode
const resolveThemeMode = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemPreference();
  }
  return mode;
};

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      // Check if there's an existing theme preference
      const existingTheme = window.localStorage.getItem('theme');
      if (existingTheme === 'light' || existingTheme === 'dark') {
        return existingTheme as ThemeMode;
      }
    }
    return 'system'; // Default to system
  });

  // Resolve the actual theme mode (system -> light/dark)
  const resolvedMode = useMemo(() => resolveThemeMode(mode), [mode]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const actualMode = resolveThemeMode(mode);
      
      window.localStorage.setItem(STORAGE_KEY, mode);
      // Also update the old theme key for backward compatibility (use resolved mode)
      window.localStorage.setItem('theme', actualMode);
      
      // Update HTML class for CSS compatibility
      if (actualMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Set data-theme attribute
      document.documentElement.setAttribute('data-theme', actualMode);
    }
  }, [mode]);

  // Listen to system preference changes when mode is 'system'
  useEffect(() => {
    if (typeof window !== 'undefined' && mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const actualMode = resolveThemeMode(mode);
        if (actualMode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        document.documentElement.setAttribute('data-theme', actualMode);
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } 
      // Fallback for older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleTheme = () => {
    setModeState((prev) => {
      // Cycle: system -> light -> dark -> system
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  const theme = resolvedMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setMode, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
};


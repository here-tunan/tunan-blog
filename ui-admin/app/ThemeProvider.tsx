'use client';

import React, {createContext, useState, useMemo, useContext, useEffect} from 'react';
import { ConfigProvider, theme } from 'antd';

// Create a context for the theme
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // On theme change, update the class on the `html` element
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const antdTheme = useMemo(() => ({
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // Seed Token
      colorPrimary: '#13c2c2',
      borderRadius: 6,

      // Alias Token
      colorBgContainer: currentTheme === 'dark' ? '#2c2c2c' : '#ffffff',
    },
  }), [currentTheme]);

  const contextValue = useMemo(() => ({
    theme: currentTheme,
    toggleTheme,
  }), [currentTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

'use client'
import React, {createContext, useState} from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export default function CustomThemeProvider({children}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialTheme = 'light';
  if (typeof window !== "undefined") {
    initialTheme = window.localStorage.getItem('theme') === null ? 'light' : String(window.localStorage.getItem('theme'))
  }
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
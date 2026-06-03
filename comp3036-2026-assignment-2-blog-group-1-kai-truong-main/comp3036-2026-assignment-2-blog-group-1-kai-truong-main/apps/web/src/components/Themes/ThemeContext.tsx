"use client";

import { Children, createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// TODOS:
// 1. Create Theme Provider

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";

  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);   
  document.documentElement.setAttribute("data-theme", newTheme);
};
   useEffect(() => {
  const saved = localStorage.getItem("theme") as "light" | "dark";

  if (saved) {
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }
}, []);
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
// 2. Create useTheme hook

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};
// 3. Use the provider in your layout